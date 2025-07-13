import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import db from '../database/database';
import logger from '../utils/logger';

let io: SocketIOServer;

export function initializeSocket(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  // Middleware для аутентификации WebSocket соединений
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await db('users').where('id', decoded.userId).first();
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.data.userId = user.id;
      socket.data.userRole = user.role;
      socket.data.userName = user.name;
      
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    const userRole = socket.data.userRole;
    const userName = socket.data.userName;

    logger.info(`Пользователь ${userName} (${userRole}) подключился: ${socket.id}`);

    // Присоединяем к соответствующим комнатам
    socket.join(userId);
    socket.join(`${userRole.toLowerCase()}_${userId}`);
    
    if (userRole === 'DRIVER') {
      socket.join('drivers');
    } else if (userRole === 'CLIENT') {
      socket.join('clients');
    }

    // Обработка обновления локации
    socket.on('update_location', async (data) => {
      try {
        const { lat, lng } = data;
        
        if (userRole === 'DRIVER') {
          // Обновляем локацию водителя
          await db('drivers')
            .where('user_id', userId)
            .update({
              latitude: lat,
              longitude: lng
            });

          // Уведомляем клиентов о новой позиции водителя
          socket.to('clients').emit('driver_location_updated', {
            driverId: userId,
            location: { lat, lng }
          });
        } else if (userRole === 'CLIENT') {
          // Обновляем локацию клиента
          await db('user_profiles')
            .where('user_id', userId)
            .update({
              latitude: lat,
              longitude: lng
            });
        }

        logger.debug(`Локация обновлена для ${userRole} ${userId}: ${lat}, ${lng}`);
      } catch (error) {
        logger.error('Ошибка обновления локации:', error);
        socket.emit('error', { message: 'Ошибка обновления локации' });
      }
    });

    // Обработка изменения статуса водителя
    socket.on('driver_status_change', async (data) => {
      try {
        if (userRole !== 'DRIVER') return;

        const { status } = data;
        await db('drivers')
          .where('user_id', userId)
          .update({ state: status });

        // Уведомляем админов об изменении статуса
        socket.to('admin').emit('driver_status_updated', {
          driverId: userId,
          status
        });

        logger.info(`Водитель ${userId} изменил статус на ${status}`);
      } catch (error) {
        logger.error('Ошибка изменения статуса водителя:', error);
        socket.emit('error', { message: 'Ошибка изменения статуса' });
      }
    });

    // Обработка отправки сообщения в чат
    socket.on('send_message', async (data) => {
      try {
        const { rideId, message } = data;
        
        // Проверяем доступ к поездке
        const ride = await db('rides')
          .where('id', rideId)
          .where(function() {
            this.where('client_id', userId).orWhere('driver_id', userId);
          })
          .first();

        if (!ride) {
          socket.emit('error', { message: 'Нет доступа к этой поездке' });
          return;
        }

        // Сохраняем сообщение
        const messageId = require('uuid').v4();
        await db('chat_messages').insert({
          id: messageId,
          ride_id: rideId,
          sender_id: userId,
          sender_type: userRole === 'CLIENT' ? 'client' : 'driver',
          message
        });

        const newMessage = {
          id: messageId,
          rideId,
          senderId: userId,
          senderType: userRole === 'CLIENT' ? 'client' : 'driver',
          message,
          timestamp: new Date()
        };

        // Отправляем сообщение участникам поездки
        io.to(`client_${ride.client_id}`).emit('new_message', newMessage);
        if (ride.driver_id) {
          io.to(`driver_${ride.driver_id}`).emit('new_message', newMessage);
        }

        logger.debug(`Сообщение отправлено в поездке ${rideId} от ${userId}`);
      } catch (error) {
        logger.error('Ошибка отправки сообщения:', error);
        socket.emit('error', { message: 'Ошибка отправки сообщения' });
      }
    });

    // Обработка присоединения к поездке (для получения обновлений)
    socket.on('join_ride', (data) => {
      const { rideId } = data;
      socket.join(`ride_${rideId}`);
      logger.debug(`Пользователь ${userId} присоединился к поездке ${rideId}`);
    });

    // Обработка отключения от поездки
    socket.on('leave_ride', (data) => {
      const { rideId } = data;
      socket.leave(`ride_${rideId}`);
      logger.debug(`Пользователь ${userId} покинул поездку ${rideId}`);
    });

    // Обработка отключения
    socket.on('disconnect', () => {
      logger.info(`Пользователь ${userName} (${userRole}) отключился: ${socket.id}`);
      
      // Если водитель отключился, помечаем его как оффлайн
      if (userRole === 'DRIVER') {
        db('drivers')
          .where('user_id', userId)
          .update({ state: 'OFFLINE' })
          .catch(error => logger.error('Ошибка обновления статуса водителя при отключении:', error));
      }
    });
  });

  return io;
}

export function getSocketInstance(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.io не инициализирован');
  }
  return io;
}