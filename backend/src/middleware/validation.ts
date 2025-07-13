import { Request, Response, NextFunction } from 'express';
import { validationResult, body, ValidationChain } from 'express-validator';
import { UserMode, RideType, PaymentMethod } from '../types';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Ошибка валидации данных',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      }
    });
  }
  next();
};

// Валидация для регистрации
export const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Имя должно содержать от 2 до 100 символов'),
  
  body('phone')
    .isMobilePhone('ru-RU')
    .withMessage('Неверный формат номера телефона'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Неверный формат email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен содержать минимум 6 символов'),
  
  body('userMode')
    .isIn(Object.values(UserMode))
    .withMessage('Неверный тип пользователя'),
  
  handleValidationErrors
];

// Валидация для входа
export const validateLogin = [
  body('phone')
    .isMobilePhone('ru-RU')
    .withMessage('Неверный формат номера телефона'),
  
  body('password')
    .notEmpty()
    .withMessage('Пароль обязателен'),
  
  body('userMode')
    .isIn(Object.values(UserMode))
    .withMessage('Неверный тип пользователя'),
  
  handleValidationErrors
];

// Валидация для создания поездки
export const validateCreateRide = [
  body('pickup')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Адрес подачи должен содержать от 3 до 200 символов'),
  
  body('destination')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Адрес назначения должен содержать от 3 до 200 символов'),
  
  body('pickupCoords.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Неверная широта точки подачи'),
  
  body('pickupCoords.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Неверная долгота точки подачи'),
  
  body('destinationCoords.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Неверная широта точки назначения'),
  
  body('destinationCoords.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Неверная долгота точки назначения'),
  
  body('rideType')
    .isIn(Object.values(RideType))
    .withMessage('Неверный тип поездки'),
  
  body('paymentMethod')
    .isIn(Object.values(PaymentMethod))
    .withMessage('Неверный способ оплаты'),
  
  handleValidationErrors
];

// Валидация для обновления локации
export const validateUpdateLocation = [
  body('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Неверная широта'),
  
  body('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Неверная долгота'),
  
  handleValidationErrors
];

// Валидация для отправки сообщения
export const validateSendMessage = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Сообщение должно содержать от 1 до 1000 символов'),
  
  handleValidationErrors
];