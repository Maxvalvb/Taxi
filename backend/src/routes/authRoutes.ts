import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimit';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Регистрация
router.post('/register', authLimiter, validateRegister, AuthController.register);

// Вход
router.post('/login', authLimiter, validateLogin, AuthController.login);

// Получение информации о текущем пользователе
router.get('/me', authenticateToken, AuthController.me);

export default router;