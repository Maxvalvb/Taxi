# 🚖 Полнофункциональный Сервис Такси

Этот проект представляет собой полноценную систему заказа такси с фронтендом на React/TypeScript и бэкендом на Node.js/Express. Система поддерживает три типа пользователей: клиенты, водители и администраторы.

## 🌟 Основные возможности

### Для клиентов:
- 📱 Удобный интерфейс для заказа поездок
- 📍 Указание точек подачи и назначения
- 💰 Выбор класса поездки (Эконом, Комфорт, Бизнес)
- 💳 Управление способами оплаты (карты, наличные)
- 💬 Чат с водителем в реальном времени
- 📊 История поездок
- ⭐ Система рейтингов и отзывов
- 🕐 Возможность заказа поездки на определенное время

### Для водителей:
- 🎯 Получение заказов в реальном времени
- 📍 Отслеживание своей геолокации
- 💼 Управление статусом (онлайн/оффлайн)
- 📈 Статистика заработка
- 🚗 Управление информацией об автомобиле
- 💬 Чат с клиентами
- 📊 История выполненных поездок

### Для администраторов:
- 📊 Полная аналитика сервиса
- 👥 Управление пользователями и водителями
- 🗺️ Мониторинг всех активных поездок
- 📈 Отчеты по доходам и статистике
- ⚙️ Настройки тарифов и параметров системы

## 🏗️ Архитектура

### Фронтенд (React/TypeScript)
- **Framework**: React 19 с TypeScript
- **Состояние**: Context API для глобального состояния
- **UI/UX**: Современный responsive дизайн
- **Real-time**: WebSocket для мгновенных обновлений
- **Маршрутизация**: Встроенная система переключения между видами

### Бэкенд (Node.js/Express)
- **Framework**: Express.js с TypeScript
- **База данных**: SQLite с Knex.js ORM
- **Аутентификация**: JWT токены
- **Real-time**: Socket.io для WebSocket соединений
- **Безопасность**: Rate limiting, валидация, CORS
- **Логирование**: Winston для структурированных логов

### База данных
```sql
users              -- Пользователи (клиенты, водители, админы)
user_profiles       -- Профили пользователей
drivers            -- Дополнительная информация о водителях
rides              -- Поездки
chat_messages      -- Сообщения чата
payment_cards      -- Платежные карты
```

## 🚀 Быстрый старт

### Запуск бэкенда
```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Бэкенд будет доступен по адресу: `http://localhost:3001`

### Запуск фронтенда
```bash
npm install
npm run dev
```

Фронтенд будет доступен по адресу: `http://localhost:5173`

## 🔐 Тестовые аккаунты

После инициализации базы данных доступны следующие тестовые аккаунты:

| Роль | Телефон | Пароль | Описание |
|------|---------|--------|----------|
| Администратор | +79991234567 | 123456 | Полный доступ к админ панели |
| Клиент | +79991234568 | 123456 | Заказ поездок |
| Водитель 1 | +79991234569 | 123456 | Алексей, Toyota Camry |
| Водитель 2 | +79991234570 | 123456 | Сергей, Hyundai Solaris |
| Водитель 3 | +79991234571 | 123456 | Дмитрий, Kia Rio |

## 🔄 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/me` - Информация о пользователе

### Поездки
- `POST /api/rides` - Создание поездки
- `GET /api/rides/active` - Активная поездка
- `GET /api/rides/history` - История поездок
- `POST /api/rides/:id/accept` - Принятие поездки водителем
- `PATCH /api/rides/:id/status` - Обновление статуса
- `PATCH /api/rides/:id/cancel` - Отмена поездки

### WebSocket события
- `new_ride_request` - Новый заказ
- `driver_assigned` - Водитель назначен
- `ride_status_updated` - Изменение статуса поездки
- `new_message` - Сообщение в чате
- `update_location` - Обновление геолокации

## 💰 Система тарифов

| Класс | Базовая ставка | За километр |
|-------|----------------|-------------|
| Эконом | 150₽ | 25₽ |
| Комфорт | 200₽ | 35₽ |
| Бизнес | 300₽ | 50₽ |

## 📱 Функциональность в деталях

### Процесс заказа поездки
1. **Выбор маршрута**: Клиент указывает точки подачи и назначения
2. **Настройка поездки**: Выбор класса, способа оплаты, времени
3. **Поиск водителя**: Система находит ближайшего доступного водителя
4. **Подтверждение**: Водитель принимает заказ
5. **Выполнение**: Отслеживание поездки в реальном времени
6. **Завершение**: Оплата и оценка поездки

### Real-time функции
- 📍 Отслеживание местоположения водителя
- 💬 Мгновенный чат между клиентом и водителем
- 🔄 Обновления статуса поездки
- 📊 Live-статистика для админов

### Безопасность
- 🔒 JWT аутентификация с истечением токенов
- 🛡️ Rate limiting для предотвращения спама
- ✅ Валидация всех входящих данных
- 🔐 Хэширование паролей с bcrypt
- 🌐 CORS защита
- 📝 Логирование всех операций

## 🔧 Технические детали

### Расчет стоимости
Стоимость рассчитывается по формуле:
```
Итоговая стоимость = Базовая ставка + (Расстояние в км × Ставка за км)
```

### Геолокация
- Использование Haversine формулы для расчета расстояний
- Поиск ближайших водителей в радиусе 10 км
- Обновление координат в реальном времени

### Производительность
- Индексы в базе данных для быстрого поиска
- Оптимизированные SQL запросы
- Кэширование часто используемых данных
- Минимизация WebSocket трафика

## 📈 Мониторинг и аналитика

### Для водителей
- Заработок за день/неделю/месяц
- Количество выполненных поездок
- Средний рейтинг
- Статистика по времени работы

### Для администраторов
- Общее количество поездок
- Активные поездки в реальном времени
- Доходы сервиса
- Количество активных водителей
- Аналитика по регионам

## 🛠️ Возможности расширения

### Планируемые функции
- 🗺️ Интеграция с картами (Google Maps/Yandex Maps)
- 💳 Интеграция с платежными системами
- 📧 Email/SMS уведомления
- 🏪 Корпоративные аккаунты
- 🎯 Программа лояльности
- 📱 Мобильные приложения (React Native)
- 🚁 Интеграция с дополнительными видами транспорта

### Технические улучшения
- 🐳 Docker контейнеризация
- ☁️ Развертывание в облаке
- 📊 Prometheus метрики
- 🔍 Elasticsearch для поиска
- 🗄️ PostgreSQL для production
- 🔄 Redis для кэширования

## 📚 Документация API

Полная документация API доступна после запуска сервера по адресу:
`http://localhost:3001/api/health`

### Примеры запросов

#### Регистрация пользователя
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Иванов",
    "phone": "+79991234999",
    "email": "ivan@example.com",
    "password": "123456",
    "userMode": "CLIENT"
  }'
```

#### Создание поездки
```bash
curl -X POST http://localhost:3001/api/rides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "pickup": "Красная площадь",
    "destination": "Парк Горького",
    "pickupCoords": {"lat": 55.755, "lng": 37.617},
    "destinationCoords": {"lat": 55.731, "lng": 37.601},
    "rideType": "Комфорт",
    "paymentMethod": "CARD"
  }'
```

## 🤝 Участие в разработке

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Создайте Pull Request

## 📞 Поддержка

При возникновении вопросов или проблем:
1. Проверьте логи в `backend/error.log`
2. Убедитесь, что все сервисы запущены
3. Проверьте переменные окружения в `.env`
4. Создайте issue в репозитории

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

---

**Разработано с ❤️ для современного мира мобильности**