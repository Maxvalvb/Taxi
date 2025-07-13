import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Хэширование пароля
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Проверка пароля
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Генерация JWT токена
export function generateToken(userId: string, role: string): string {
  const payload = { userId, role };
  const secret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

// Генерация UUID
export function generateId(): string {
  return uuidv4();
}

// Генерация случайного кода (для верификации)
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}