import rateLimit from 'express-rate-limit';

// Общий лимит для API
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 минут
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 запросов
  message: {
    success: false,
    error: {
      message: 'Слишком много запросов, попробуйте позже',
      code: 'TOO_MANY_REQUESTS'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Строгий лимит для аутентификации
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // 5 попыток входа
  message: {
    success: false,
    error: {
      message: 'Слишком много попыток входа, попробуйте позже',
      code: 'TOO_MANY_AUTH_ATTEMPTS'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Лимит для создания поездок
export const rideLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 минут
  max: 10, // 10 поездок
  message: {
    success: false,
    error: {
      message: 'Слишком много запросов на поездки, попробуйте позже',
      code: 'TOO_MANY_RIDE_REQUESTS'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});