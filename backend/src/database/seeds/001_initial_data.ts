import { Knex } from "knex";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
    // Очищаем существующие данные
    await knex('chat_messages').del();
    await knex('rides').del();
    await knex('payment_cards').del();
    await knex('drivers').del();
    await knex('user_profiles').del();
    await knex('users').del();

    const adminId = uuidv4();
    const clientId = uuidv4();
    const driverId1 = uuidv4();
    const driverId2 = uuidv4();
    const driverId3 = uuidv4();

    // Создаем хэши паролей
    const passwordHash = await bcrypt.hash('123456', 10);

    // Создаем пользователей
    await knex('users').insert([
        {
            id: adminId,
            name: 'Администратор',
            phone: '+79991234567',
            email: 'admin@taxi.ru',
            password_hash: passwordHash,
            role: 'ADMIN',
            is_active: true,
            is_verified: true
        },
        {
            id: clientId,
            name: 'Иван Петров',
            phone: '+79991234568',
            email: 'ivan@email.com',
            password_hash: passwordHash,
            role: 'CLIENT',
            is_active: true,
            is_verified: true
        },
        {
            id: driverId1,
            name: 'Алексей Водитель',
            phone: '+79991234569',
            email: 'alexey@taxi.ru',
            password_hash: passwordHash,
            role: 'DRIVER',
            is_active: true,
            is_verified: true
        },
        {
            id: driverId2,
            name: 'Сергей Водитель',
            phone: '+79991234570',
            email: 'sergey@taxi.ru',
            password_hash: passwordHash,
            role: 'DRIVER',
            is_active: true,
            is_verified: true
        },
        {
            id: driverId3,
            name: 'Дмитрий Водитель',
            phone: '+79991234571',
            email: 'dmitry@taxi.ru',
            password_hash: passwordHash,
            role: 'DRIVER',
            is_active: true,
            is_verified: true
        }
    ]);

    // Создаем профили пользователей
    await knex('user_profiles').insert([
        {
            id: uuidv4(),
            user_id: adminId,
            wallet_balance: 0,
            photo_url: 'https://i.pravatar.cc/150?u=admin'
        },
        {
            id: uuidv4(),
            user_id: clientId,
            wallet_balance: 1250.00,
            latitude: 55.755,
            longitude: 37.617,
            address: 'Москва, Красная площадь',
            photo_url: 'https://i.pravatar.cc/150?u=user1'
        },
        {
            id: uuidv4(),
            user_id: driverId1,
            wallet_balance: 0,
            latitude: 55.76,
            longitude: 37.64,
            photo_url: 'https://i.pravatar.cc/150?u=driver42'
        },
        {
            id: uuidv4(),
            user_id: driverId2,
            wallet_balance: 0,
            latitude: 55.75,
            longitude: 37.61,
            photo_url: 'https://i.pravatar.cc/150?u=driver16'
        },
        {
            id: uuidv4(),
            user_id: driverId3,
            wallet_balance: 0,
            latitude: 55.74,
            longitude: 37.62,
            photo_url: 'https://i.pravatar.cc/150?u=driver8'
        }
    ]);

    // Создаем водителей
    await knex('drivers').insert([
        {
            id: uuidv4(),
            user_id: driverId1,
            car_model: 'Toyota Camry',
            license_plate: 'А123ВС777',
            rating: 4.9,
            state: 'ONLINE',
            is_approved: true,
            documents_verified: true,
            latitude: 55.76,
            longitude: 37.64,
            earnings_today: 4200.00,
            total_trips: 150
        },
        {
            id: uuidv4(),
            user_id: driverId2,
            car_model: 'Hyundai Solaris',
            license_plate: 'В456УЕ777',
            rating: 4.8,
            state: 'OFFLINE',
            is_approved: true,
            documents_verified: true,
            latitude: 55.75,
            longitude: 37.61,
            earnings_today: 0,
            total_trips: 95
        },
        {
            id: uuidv4(),
            user_id: driverId3,
            car_model: 'Kia Rio',
            license_plate: 'Е789КХ777',
            rating: 5.0,
            state: 'ONLINE',
            is_approved: true,
            documents_verified: true,
            latitude: 55.74,
            longitude: 37.62,
            earnings_today: 3500.00,
            total_trips: 200
        }
    ]);

    // Создаем платежные карты
    await knex('payment_cards').insert([
        {
            id: uuidv4(),
            user_id: clientId,
            last4: '4242',
            brand: 'mastercard',
            is_default: true
        }
    ]);
}