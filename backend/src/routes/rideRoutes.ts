import { Router } from 'express';
import { RideController } from '../controllers/rideController';
import { validateCreateRide } from '../middleware/validation';
import { rideLimiter } from '../middleware/rateLimit';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Все маршруты требуют аутентификации
router.use(authenticateToken);

// Создание поездки (только клиенты)
router.post('/', requireRole(['CLIENT']), rideLimiter, validateCreateRide, RideController.createRide);

// Принятие поездки (только водители)
router.post('/:rideId/accept', requireRole(['DRIVER']), RideController.acceptRide);

// Обновление статуса поездки
router.patch('/:rideId/status', RideController.updateRideStatus);

// Отмена поездки
router.patch('/:rideId/cancel', RideController.cancelRide);

// Получение активной поездки
router.get('/active', RideController.getActiveRide);

// История поездок
router.get('/history', RideController.getRideHistory);

export default router;