import { Router } from 'express';
import authRoutes from './authRoutes';
import rideRoutes from './rideRoutes';

const router = Router();

// API роуты
router.use('/auth', authRoutes);
router.use('/rides', rideRoutes);

// Базовый endpoint для проверки работоспособности API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Taxi API работает',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

export default router;