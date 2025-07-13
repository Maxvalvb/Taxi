import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import logger from './utils/logger';
import { initializeSocket } from './services/socketService';
import { generalLimiter } from './middleware/rateLimit';
import apiRoutes from './routes';

// Загружаем переменные окружения
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Инициализируем Socket.IO
const io = initializeSocket(server);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Логирование запросов
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// API маршруты
app.use('/api', apiRoutes);

// Обработка 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint не найден',
      code: 'NOT_FOUND'
    }
  });
});

// Глобальный обработчик ошибок
app.use((error: any, req: any, res: any, next: any) => {
  logger.error('Необработанная ошибка:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Внутренняя ошибка сервера' 
        : error.message,
      code: 'INTERNAL_SERVER_ERROR'
    }
  });
});

// Запуск сервера
server.listen(PORT, () => {
  logger.info(`🚖 Taxi Backend сервер запущен на порту ${PORT}`);
  logger.info(`📡 WebSocket сервер готов к подключениям`);
  logger.info(`🌍 Разрешенный origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM получен, завершаем сервер...');
  server.close(() => {
    logger.info('Сервер завершен');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT получен, завершаем сервер...');
  server.close(() => {
    logger.info('Сервер завершен');
    process.exit(0);
  });
});

export default app;