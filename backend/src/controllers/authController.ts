import { Request, Response } from 'express';
import db from '../database/database';
import { hashPassword, comparePassword, generateToken, generateId } from '../utils/crypto';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';
import logger from '../utils/logger';

export class AuthController {
  // Регистрация нового пользователя
  static async register(req: Request, res: Response) {
    try {
      const { name, phone, email, password, userMode }: RegisterRequest = req.body;

      // Проверяем, существует ли пользователь с таким телефоном или email
      const existingUser = await db('users')
        .where('phone', phone)
        .orWhere('email', email)
        .first();

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Пользователь с таким телефоном или email уже существует',
            code: 'USER_ALREADY_EXISTS'
          }
        });
      }

      // Хэшируем пароль
      const passwordHash = await hashPassword(password);
      const userId = generateId();
      const profileId = generateId();

      // Создаем пользователя и профиль в транзакции
      await db.transaction(async (trx) => {
        // Создаем пользователя
        await trx('users').insert({
          id: userId,
          name,
          phone,
          email,
          password_hash: passwordHash,
          role: userMode,
          is_active: true,
          is_verified: false
        });

        // Создаем профиль
        await trx('user_profiles').insert({
          id: profileId,
          user_id: userId,
          wallet_balance: 0
        });

        // Если это водитель, создаем запись в таблице drivers
        if (userMode === 'DRIVER') {
          await trx('drivers').insert({
            id: generateId(),
            user_id: userId,
            car_model: '',
            license_plate: '',
            rating: 5.0,
            state: 'OFFLINE',
            is_approved: false,
            documents_verified: false,
            earnings_today: 0,
            total_trips: 0
          });
        }
      });

      // Получаем созданного пользователя с профилем
      const user = await db('users').where('id', userId).first();
      const profile = await db('user_profiles').where('user_id', userId).first();

      // Генерируем токен
      const token = generateToken(userId, userMode);

      const response: AuthResponse = {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          isActive: user.is_active,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        },
        profile: {
          id: profile.id,
          userId: profile.user_id,
          photoUrl: profile.photo_url,
          walletBalance: parseFloat(profile.wallet_balance),
          location: profile.latitude && profile.longitude ? {
            lat: parseFloat(profile.latitude),
            lng: parseFloat(profile.longitude)
          } : undefined,
          address: profile.address
        },
        token
      };

      logger.info(`Новый пользователь зарегистрирован: ${phone} (${userMode})`);

      res.status(201).json({
        success: true,
        data: response
      });
    } catch (error) {
      logger.error('Ошибка регистрации:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Внутренняя ошибка сервера',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  // Вход в систему
  static async login(req: Request, res: Response) {
    try {
      const { phone, password, userMode }: LoginRequest = req.body;

      // Находим пользователя
      const user = await db('users')
        .where({ phone, role: userMode, is_active: true })
        .first();

      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Неверный телефон или пароль',
            code: 'INVALID_CREDENTIALS'
          }
        });
      }

      // Проверяем пароль
      const isPasswordValid = await comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Неверный телефон или пароль',
            code: 'INVALID_CREDENTIALS'
          }
        });
      }

      // Получаем профиль
      const profile = await db('user_profiles').where('user_id', user.id).first();

      // Генерируем токен
      const token = generateToken(user.id, user.role);

      const response: AuthResponse = {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          isActive: user.is_active,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        },
        profile: {
          id: profile.id,
          userId: profile.user_id,
          photoUrl: profile.photo_url,
          walletBalance: parseFloat(profile.wallet_balance),
          location: profile.latitude && profile.longitude ? {
            lat: parseFloat(profile.latitude),
            lng: parseFloat(profile.longitude)
          } : undefined,
          address: profile.address
        },
        token
      };

      logger.info(`Пользователь вошел в систему: ${phone} (${userMode})`);

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      logger.error('Ошибка входа:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Внутренняя ошибка сервера',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  // Получение информации о текущем пользователе
  static async me(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        data: {
          user: req.user,
          profile: req.profile
        }
      });
    } catch (error) {
      logger.error('Ошибка получения профиля:', error);
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