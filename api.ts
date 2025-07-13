
import { 
    UserMode, UserProfile, Driver, DriverState, RideHistoryEntry, 
    PaymentCard, ActiveTrip, ChatMessage, RideType
} from './types';

// Настройки API
const API_BASE_URL = 'http://localhost:3001/api';
const WS_URL = 'ws://localhost:3001';

// Утилита для HTTP запросов
class ApiClient {
    private baseURL: string;
    private token: string | null = null;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('authToken');
    }

    private async request<T>(
        endpoint: string, 
        options: RequestInit = {}
    ): Promise<{ success: boolean; data?: T; error?: any }> {
        const url = `${this.baseURL}${endpoint}`;
        
        const headers: any = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error?.message || 'Network error');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            return {
                success: false,
                error: {
                    message: error instanceof Error ? error.message : 'Unknown error',
                    code: 'NETWORK_ERROR'
                }
            };
        }
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    get currentToken() {
        return this.token;
    }

    // GET запрос
    async get<T>(endpoint: string): Promise<{ success: boolean; data?: T; error?: any }> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    // POST запрос
    async post<T>(endpoint: string, data?: any): Promise<{ success: boolean; data?: T; error?: any }> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // PATCH запрос
    async patch<T>(endpoint: string, data?: any): Promise<{ success: boolean; data?: T; error?: any }> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }
}

const apiClient = new ApiClient(API_BASE_URL);

// WebSocket соединение
let socket: WebSocket | null = null;

const connectWebSocket = (token: string) => {
    if (socket) {
        socket.close();
    }
    
    socket = new WebSocket(`${WS_URL}?token=${token}`);
    
    socket.onopen = () => {
        console.log('WebSocket connected');
    };
    
    socket.onclose = () => {
        console.log('WebSocket disconnected');
        // Переподключение через 3 секунды
        setTimeout(() => {
            if (apiClient.currentToken) {
                connectWebSocket(apiClient.currentToken);
            }
        }, 3000);
    };
    
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    
    return socket;
};

export const apiService = {
    // Аутентификация
    async login(mode: UserMode, phone: string = '', password: string = ''): Promise<UserProfile> {
        // Если передали параметры, используем их для реального входа
        if (phone && password) {
            const result = await apiClient.post('/auth/login', {
                phone,
                password,
                userMode: mode
            });

            if (result.success && result.data?.token) {
                apiClient.setToken(result.data.token);
                connectWebSocket(result.data.token);
                return result.data.profile;
            } else {
                throw new Error(result.error?.message || 'Login failed');
            }
        }

        // Для обратной совместимости со старым кодом
        // Используем тестовые данные для демо
        const testUsers = {
            CLIENT: { phone: '+79991234568', password: '123456' },
            DRIVER: { phone: '+79991234569', password: '123456' },
            ADMIN: { phone: '+79991234567', password: '123456' }
        };

        const testUser = testUsers[mode];
        return this.login(mode, testUser.phone, testUser.password);
    },

    // Регистрация
    async register(userData: {
        name: string;
        phone: string;
        email: string;
        password: string;
        userMode: UserMode;
    }): Promise<UserProfile> {
        const result = await apiClient.post('/auth/register', userData);

        if (result.success && result.data?.token) {
            apiClient.setToken(result.data.token);
            connectWebSocket(result.data.token);
            return result.data.profile;
        } else {
            throw new Error(result.error?.message || 'Registration failed');
        }
    },

    // Получение информации о пользователе
    async getCurrentUser(): Promise<{ user: any; profile: UserProfile }> {
        const result = await apiClient.get<{ user: any; profile: UserProfile }>('/auth/me');
        
        if (result.success && result.data) {
            return result.data;
        } else {
            throw new Error(result.error?.message || 'Failed to get user info');
        }
    },

    // Водители
    async fetchDrivers(): Promise<Driver[]> {
        // Для демо возвращаем тестовых водителей
        // В реальном приложении здесь был бы endpoint для получения доступных водителей
        return [
            { 
                id: 'd1', 
                name: 'Алексей', 
                rating: 4.9, 
                photoUrl: 'https://i.pravatar.cc/150?u=driver42', 
                carModel: 'Toyota Camry', 
                licensePlate: 'А123ВС777', 
                state: DriverState.ONLINE, 
                location: { lat: 55.76, lng: 37.64 }, 
                earningsToday: 4200, 
                pastTrips: [] 
            },
        ];
    },

    // История поездок
    async fetchRideHistory(): Promise<RideHistoryEntry[]> {
        const result = await apiClient.get<RideHistoryEntry[]>('/rides/history');
        
        if (result.success && result.data) {
            return result.data;
        } else {
            return [];
        }
    },
    
    // Создание поездки
    async createRide(details: { 
        pickup: string; 
        destination: string; 
        fare: number; 
        rideType: RideType; 
        clientProfile: UserProfile;
        pickupCoords?: { lat: number; lng: number };
        destinationCoords?: { lat: number; lng: number };
    }): Promise<ActiveTrip> {
        const rideData = {
            pickup: details.pickup,
            destination: details.destination,
            pickupCoords: details.pickupCoords || { lat: 55.755, lng: 37.617 },
            destinationCoords: details.destinationCoords || { lat: 55.751, lng: 37.618 },
            rideType: details.rideType,
            paymentMethod: 'CARD' // По умолчанию карта
        };

        const result = await apiClient.post<any>('/rides', rideData);
        
        if (result.success && result.data) {
            return {
                id: result.data.id || 'temp-ride-id',
                clientId: result.data.clientId || 'temp-client-id',
                clientProfile: details.clientProfile,
                driverId: result.data.driverId || null,
                pickup: result.data.pickup || details.pickup,
                destination: result.data.destination || details.destination,
                fare: result.data.fare || details.fare,
                rideType: result.data.rideType || details.rideType
            };
        } else {
            throw new Error(result.error?.message || 'Failed to create ride');
        }
    },

    // Получение активной поездки
    async getActiveRide(): Promise<ActiveTrip | null> {
        const result = await apiClient.get('/rides/active');
        
        if (result.success) {
            return result.data || null;
        } else {
            throw new Error(result.error?.message || 'Failed to get active ride');
        }
    },

    // Принятие поездки водителем
    async acceptRide(rideId: string): Promise<{ success: boolean }> {
        const result = await apiClient.post(`/rides/${rideId}/accept`);
        return { success: result.success };
    },

    // Отмена поездки
    async cancelRide(rideId: string, reason?: string): Promise<{ success: boolean }> {
        const result = await apiClient.patch(`/rides/${rideId}/cancel`, { reason });
        return { success: result.success };
    },

    // Обновление статуса поездки
    async updateRideStatus(rideId: string, newStatus: 'TRIP_IN_PROGRESS' | 'TRIP_COMPLETE'): Promise<{ success: boolean }> {
        const statusMap = {
            'TRIP_IN_PROGRESS': 'IN_PROGRESS',
            'TRIP_COMPLETE': 'COMPLETED'
        };

        const result = await apiClient.patch(`/rides/${rideId}/status`, { 
            status: statusMap[newStatus] 
        });
        return { success: result.success };
    },

    // Отправка сообщения в чат
    async sendMessage(text: string, sender: 'user' | 'driver'): Promise<ChatMessage> {
        // Отправляем через WebSocket
        if (socket && socket.readyState === WebSocket.OPEN) {
            const activeRide = await this.getActiveRide();
            if (activeRide) {
                socket.send(JSON.stringify({
                    type: 'send_message',
                    data: {
                        rideId: activeRide.id,
                        message: text
                    }
                }));
            }
        }

        // Возвращаем сообщение для локального отображения
        return {
            id: Date.now(),
            sender,
            text,
            timestamp: new Date().toISOString()
        };
    },

    // Обновление профиля
    async updateProfile(profile: UserProfile): Promise<UserProfile> {
        // Пока заглушка - в реальном API здесь был бы PATCH /profile
        return profile;
    },

    // Добавление карты
    async addPaymentCard(profile: UserProfile, card: PaymentCard): Promise<UserProfile> {
        // Пока заглушка - в реальном API здесь был бы POST /cards
        return {
            ...profile,
            paymentMethods: [...profile.paymentMethods, card]
        };
    },

    // WebSocket подписки
    onMessage(callback: (message: any) => void) {
        if (socket) {
            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    callback(data);
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };
        }
    },

    // Обновление геолокации
    updateLocation(lat: number, lng: number) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'update_location',
                data: { lat, lng }
            }));
        }
    },

    // Изменение статуса водителя
    updateDriverStatus(status: DriverState) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'driver_status_change',
                data: { status }
            }));
        }
    },

    // Отключение
    disconnect() {
        if (socket) {
            socket.close();
            socket = null;
        }
        apiClient.clearToken();
    }
};