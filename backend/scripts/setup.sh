#!/bin/bash

echo "🚖 Настройка Taxi Backend..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    log_error "package.json не найден. Убедитесь, что вы в директории backend/"
    exit 1
fi

# 1. Установка зависимостей
log_info "Установка зависимостей..."
npm install

if [ $? -ne 0 ]; then
    log_error "Ошибка установки зависимостей"
    exit 1
fi

# 2. Проверка файла .env
if [ ! -f ".env" ]; then
    log_warn "Файл .env не найден. Копируем из .env.example..."
    cp .env.example .env
    log_info "Файл .env создан. Проверьте настройки при необходимости."
else
    log_info "Файл .env уже существует"
fi

# 3. Сборка TypeScript
log_info "Сборка TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    log_error "Ошибка сборки TypeScript"
    exit 1
fi

# 4. Запуск миграций базы данных
log_info "Запуск миграций базы данных..."
npm run db:migrate

if [ $? -ne 0 ]; then
    log_error "Ошибка выполнения миграций"
    exit 1
fi

# 5. Заполнение тестовыми данными
log_info "Заполнение базы тестовыми данными..."
npm run db:seed

if [ $? -ne 0 ]; then
    log_error "Ошибка заполнения тестовыми данными"
    exit 1
fi

# 6. Создание необходимых директорий
log_info "Создание директорий..."
mkdir -p uploads
mkdir -p logs

log_info "✅ Настройка завершена!"
echo ""
log_info "Для запуска сервера используйте:"
echo "  npm run dev    # Режим разработки"
echo "  npm start      # Продакшн режим"
echo ""
log_info "Тестовые пользователи:"
echo "  Админ:    +79991234567 / 123456"
echo "  Клиент:   +79991234568 / 123456"  
echo "  Водители: +79991234569-571 / 123456"
echo ""
log_info "API будет доступно по адресу: http://localhost:3001"
log_info "Документация API: см. README.md"