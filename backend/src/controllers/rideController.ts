import { Request, Response } from 'express';
import db from '../database/database';
import { generateId } from '../utils/crypto';
import { calculateDistance, calculateFare, estimateTravelTime } from '../utils/distance';
import { CreateRideRequest, RideStatus } from '../types';
import logger from '../utils/logger';
import { getSocketInstance } from '../services/socketService';

export class RideController {
  // Создание новой поездки
  static async createRide(req: Request, res: Response) {
    try {
      const { pickup, destination, pickupCoords, destinationCoords, rideType, paymentMethod }: CreateRideRequest = req.body;
      const clientId = req.user!.id;

      // Проверяем, нет ли активной поездки у клиента
      const activeRide = await db('rides')
        .where({ client_id: clientId })
        .whereIn('status', ['PENDING', 'DRIVER_ASSIGNED', 'DRIVER_EN_ROUTE', 'IN_PROGRESS'])
        .first();

      if (activeRide) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'У вас уже есть активная поездка',
            code: 'ACTIVE_RIDE_EXISTS'
          }
        });
      }

      // Рассчитываем расстояние и стоимость
      const distance = calculateDistance(
        pickupCoords.lat,
        pickupCoords.lng,
        destinationCoords.lat,
        destinationCoords.lng
      );
      const fare = calculateFare(distance, rideType);
      const estimatedDuration = estimateTravelTime(distance);

      const rideId = generateId();

      // Создаем поездку
      await db('rides').insert({
        id: rideId,
        client_id: clientId,
        pickup,
        destination,
        pickup_lat: pickupCoords.lat,
        pickup_lng: pickupCoords.lng,
        destination_lat: destinationCoords.lat,
        destination_lng: destinationCoords.lng,
        fare,
        ride_type: rideType,
        payment_method: paymentMethod,
        status: 'PENDING',
        estimated_duration: estimatedDuration,
        distance
      });

      // Получаем созданную поездку
      const ride = await db('rides').where('id', rideId).first();

      // Уведомляем всех онлайн водителей о новой поездке
      const io = getSocketInstance();
      io.to('drivers').emit('new_ride_request', {
        rideId: ride.id,
        pickup: ride.pickup,
        destination: ride.destination,
        pickupCoords: {
          lat: parseFloat(ride.pickup_lat),
          lng: parseFloat(ride.pickup_lng)
        },
        destinationCoords: {
          lat: parseFloat(ride.destination_lat),
          lng: parseFloat(ride.destination_lng)
        },
        fare: parseFloat(ride.fare),
        rideType: ride.ride_type,
        distance: parseFloat(ride.distance)
      });

      logger.info(`Создана новая поездка: ${rideId} от клиента ${clientId}`);

      res.status(201).json({
        success: true,
        data: {
          id: ride.id,
          clientId: ride.client_id,
          pickup: ride.pickup,
          destination: ride.destination,
          fare: parseFloat(ride.fare),
          rideType: ride.ride_type,
          status: ride.status,
          estimatedDuration,
          distance
        }
      });
    } catch (error) {
      logger.error('Ошибка создания поездки:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Внутренняя ошибка сервера',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  // Принятие поездки водителем
  static async acceptRide(req: Request, res: Response) {
    try {
      const { rideId } = req.params;
      const driverId = req.user!.id;

      // Проверяем статус водителя
      const driver = await db('drivers').where('user_id', driverId).first();
      if (!driver || driver.state !== 'ONLINE') {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Водитель не может принять поездку',
            code: 'DRIVER_NOT_AVAILABLE'
          }
        });
      }

      // Проверяем поездку
      const ride = await db('rides').where({ id: rideId, status: 'PENDING' }).first();
      if (!ride) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Поездка не найдена или уже принята',
            code: 'RIDE_NOT_FOUND'
          }
        });
      }

      // Обновляем поездку и статус водителя в транзакции
      await db.transaction(async (trx) => {
        await trx('rides')
          .where('id', rideId)
          .update({
            driver_id: driverId,
            status: 'DRIVER_ASSIGNED'
          });

        await trx('drivers')
          .where('user_id', driverId)
          .update({ state: 'TO_PICKUP' });
      });

      const io = getSocketInstance();
      
      // Уведомляем клиента о назначении водителя
      io.to(`client_${ride.client_id}`).emit('driver_assigned', {
        rideId,
        driverId,
        driver: {
          id: driver.id,
          name: req.user!.name,
          rating: parseFloat(driver.rating),
          carModel: driver.car_model,
          licensePlate: driver.license_plate
        }
      });

      // Уведомляем других водителей, что поездка больше недоступна
      io.to('drivers').emit('ride_taken', { rideId });

      logger.info(`Водитель ${driverId} принял поездку ${rideId}`);

      res.json({
        success: true,
        data: { message: 'Поездка принята' }
      });
    } catch (error) {
      logger.error('Ошибка принятия поездки:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Внутренняя ошибка сервера',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  // Обновление статуса поездки
  static async updateRideStatus(req: Request, res: Response) {
    try {
      const { rideId } = req.params;
      const { status } = req.body;
      const userId = req.user!.id;

      const ride = await db('rides').where('id', rideId).first();
      if (!ride) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Поездка не найдена',
            code: 'RIDE_NOT_FOUND'
          }
        });
      }

      // Проверяем права доступа
      if (ride.client_id !== userId && ride.driver_id !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Нет доступа к этой поездке',
            code: 'ACCESS_DENIED'
          }
        });
      }

      const updateData: any = { status };

      // Устанавливаем временные метки
      if (status === 'IN_PROGRESS') {
        updateData.started_at = new Date();
      } else if (status === 'COMPLETED') {
        updateData.completed_at = new Date();
        
        // Рассчитываем фактическое время поездки
        if (ride.started_at) {
          const duration = Math.round((new Date().getTime() - new Date(ride.started_at).getTime()) / 60000);
          updateData.actual_duration = duration;
        }
      }

      await db('rides').where('id', rideId).update(updateData);

      // Обновляем статус водителя при завершении поездки
      if (status === 'COMPLETED' && ride.driver_id) {
        await db.transaction(async (trx) => {
          await trx('drivers')
            .where('user_id', ride.driver_id)
            .update({
              state: 'ONLINE',
              earnings_today: db.raw('earnings_today + ?', [ride.fare]),
              total_trips: db.raw('total_trips + 1')
            });
        });
      }

      const io = getSocketInstance();
      
      // Уведомляем участников поездки об обновлении статуса
      io.to(`client_${ride.client_id}`).emit('ride_status_updated', {
        rideId,
        status,
        timestamp: new Date()
      });

      if (ride.driver_id) {
        io.to(`driver_${ride.driver_id}`).emit('ride_status_updated', {
          rideId,
          status,
          timestamp: new Date()
        });
      }

      logger.info(`Статус поездки ${rideId} обновлен на ${status}`);

      res.json({
        success: true,
        data: { message: 'Статус поездки обновлен' }
      });
    } catch (error) {
      logger.error('Ошибка обновления статуса поездки:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Внутренняя ошибка сервера',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  // Отмена поездки
  static async cancelRide(req: Request, res: Response) {
    try {
      const { rideId } = req.params;
      const { reason } = req.body;
      const userId = req.user!.id;

      const ride = await db('rides').where('id', rideId).first();
      if (!ride) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Поездка не найдена',
            code: 'RIDE_NOT_FOUND'
          }
        });
      }

      // Проверяем права доступа
      if (ride.client_id !== userId && ride.driver_id !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Нет доступа к этой поездке',
            code: 'ACCESS_DENIED'
          }
        });
      }

      // Проверяем, можно ли отменить поездку
      if (!['PENDING', 'DRIVER_ASSIGNED', 'DRIVER_EN_ROUTE'].includes(ride.status)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Поездку нельзя отменить на данном этапе',
            code: 'CANNOT_CANCEL_RIDE'
          }
        });
      }

      await db.transaction(async (trx) => {
        await trx('rides')
          .where('id', rideId)
          .update({
            status: 'CANCELLED',
            cancelled_at: new Date(),
            cancel_reason: reason
          });

        // Если водитель был назначен, освобождаем его
        if (ride.driver_id) {
          await trx('drivers')
            .where('user_id', ride.driver_id)
            .update({ state: 'ONLINE' });
        }
      });

      const io = getSocketInstance();
      
      // Уведомляем участников об отмене
      io.to(`client_${ride.client_id}`).emit('ride_cancelled', {
        rideId,
        reason,
        cancelledBy: userId
      });

      if (ride.driver_id) {
        io.to(`driver_${ride.driver_id}`).emit('ride_cancelled', {
          rideId,
          reason,
          cancelledBy: userId
        });
      }

      logger.info(`Поездка ${rideId} отменена пользователем ${userId}`);

      res.json({
        success: true,
        data: { message: 'Поездка отменена' }
      });
    } catch (error) {
      logger.error('Ошибка отмены поездки:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Внутренняя ошибка сервера',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  // Получение текущей активной поездки пользователя
  static async getActiveRide(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;

      let query = db('rides')
        .leftJoin('users as clients', 'rides.client_id', 'clients.id')
        .leftJoin('users as drivers', 'rides.driver_id', 'drivers.id')
        .leftJoin('drivers as driver_profiles', 'rides.driver_id', 'driver_profiles.user_id')
        .select(
          'rides.*',
          'clients.name as client_name',
          'clients.phone as client_phone',
          'drivers.name as driver_name',
          'drivers.phone as driver_phone',
          'driver_profiles.car_model',
          'driver_profiles.license_plate',
          'driver_profiles.rating as driver_rating'
        )
        .whereIn('rides.status', ['PENDING', 'DRIVER_ASSIGNED', 'DRIVER_EN_ROUTE', 'IN_PROGRESS']);

      if (userRole === 'CLIENT') {
        query = query.where('rides.client_id', userId);
      } else if (userRole === 'DRIVER') {
        query = query.where('rides.driver_id', userId);
      }

      const ride = await query.first();

      if (!ride) {
        return res.json({
          success: true,
          data: null
        });
      }

      res.json({
        success: true,
        data: {
          id: ride.id,
          clientId: ride.client_id,
          driverId: ride.driver_id,
          pickup: ride.pickup,
          destination: ride.destination,
          pickupCoords: {
            lat: parseFloat(ride.pickup_lat),
            lng: parseFloat(ride.pickup_lng)
          },
          destinationCoords: {
            lat: parseFloat(ride.destination_lat),
            lng: parseFloat(ride.destination_lng)
          },
          fare: parseFloat(ride.fare),
          rideType: ride.ride_type,
          paymentMethod: ride.payment_method,
          status: ride.status,
          estimatedDuration: ride.estimated_duration,
          distance: parseFloat(ride.distance || 0),
          client: ride.client_name ? {
            name: ride.client_name,
            phone: ride.client_phone
          } : null,
          driver: ride.driver_name ? {
            name: ride.driver_name,
            phone: ride.driver_phone,
            carModel: ride.car_model,
            licensePlate: ride.license_plate,
            rating: parseFloat(ride.driver_rating || 0)
          } : null,
          createdAt: ride.created_at,
          startedAt: ride.started_at
        }
      });
    } catch (error) {
      logger.error('Ошибка получения активной поездки:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Внутренняя ошибка сервера',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  // Получение истории поездок
  static async getRideHistory(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;
      const { page = 1, limit = 20 } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      let query = db('rides')
        .leftJoin('users as clients', 'rides.client_id', 'clients.id')
        .leftJoin('users as drivers', 'rides.driver_id', 'drivers.id')
        .leftJoin('drivers as driver_profiles', 'rides.driver_id', 'driver_profiles.user_id')
        .select(
          'rides.*',
          'clients.name as client_name',
          'drivers.name as driver_name',
          'driver_profiles.car_model',
          'driver_profiles.license_plate',
          'driver_profiles.rating as driver_rating'
        )
        .whereIn('rides.status', ['COMPLETED', 'CANCELLED'])
        .orderBy('rides.created_at', 'desc')
        .limit(Number(limit))
        .offset(offset);

      if (userRole === 'CLIENT') {
        query = query.where('rides.client_id', userId);
      } else if (userRole === 'DRIVER') {
        query = query.where('rides.driver_id', userId);
      }

      const rides = await query;

      const formattedRides = rides.map(ride => ({
        id: ride.id,
        pickup: ride.pickup,
        destination: ride.destination,
        fare: parseFloat(ride.fare),
        rideType: ride.ride_type,
        status: ride.status,
        distance: parseFloat(ride.distance || 0),
        duration: ride.actual_duration || ride.estimated_duration,
        client: ride.client_name ? { name: ride.client_name } : null,
        driver: ride.driver_name ? {
          name: ride.driver_name,
          carModel: ride.car_model,
          licensePlate: ride.license_plate,
          rating: parseFloat(ride.driver_rating || 0)
        } : null,
        createdAt: ride.created_at,
        completedAt: ride.completed_at,
        cancelledAt: ride.cancelled_at,
        cancelReason: ride.cancel_reason
      }));

      res.json({
        success: true,
        data: formattedRides
      });
    } catch (error) {
      logger.error('Ошибка получения истории поездок:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Внутренняя ошибка сервера',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }
}