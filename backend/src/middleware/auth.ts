import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/database';
import { User, UserProfile } from '../types';

interface JwtPayload {
  userId: string;
  role: string;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Токен доступа не предоставлен', code: 'NO_TOKEN' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // Получаем пользователя и его профиль
    const user = await db('users')
      .where({ id: decoded.userId, is_active: true })
      .first();

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Пользователь не найден', code: 'USER_NOT_FOUND' }
      });
    }

    const profile = await db('user_profiles')
      .where({ user_id: user.id })
      .first();

    req.user = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };

    if (profile) {
      req.profile = {
        id: profile.id,
        userId: profile.user_id,
        photoUrl: profile.photo_url,
        walletBalance: parseFloat(profile.wallet_balance),
        location: profile.latitude && profile.longitude ? {
          lat: parseFloat(profile.latitude),
          lng: parseFloat(profile.longitude)
        } : undefined,
        address: profile.address
      };
    }

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: { message: 'Недействительный токен', code: 'INVALID_TOKEN' }
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Пользователь не аутентифицирован', code: 'NOT_AUTHENTICATED' }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Недостаточно прав доступа', code: 'INSUFFICIENT_PERMISSIONS' }
      });
    }

    next();
  };
};