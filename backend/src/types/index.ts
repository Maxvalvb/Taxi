// Базовые enum и типы
export enum AppState {
  BOOKING = 'BOOKING',
  SEARCHING = 'SEARCHING',
  CONFIRMED = 'CONFIRMED',
  TRIP_IN_PROGRESS = 'TRIP_IN_PROGRESS',
  TRIP_COMPLETE = 'TRIP_COMPLETE',
}

export enum UserMode {
  CLIENT = 'CLIENT',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

export enum DriverState {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  INCOMING_RIDE = 'INCOMING_RIDE',
  TO_PICKUP = 'TO_PICKUP',
  TRIP_IN_PROGRESS = 'TRIP_IN_PROGRESS',
}

export enum RideType {
  ECONOMY = 'Эконом',
  COMFORT = 'Комфорт',
  BUSINESS = 'Бизнес',
}

export enum PaymentMethod {
  CARD = 'CARD',
  CASH = 'CASH',
}

export enum RidePurpose {
  PERSONAL = 'Личная',
  BUSINESS = 'Бизнес',
}

export enum RideStatus {
  PENDING = 'PENDING',
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
  DRIVER_EN_ROUTE = 'DRIVER_EN_ROUTE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Интерфейсы пользователей
export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserMode;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  photoUrl?: string;
  walletBalance: number;
  location?: {
    lat: number;
    lng: number;
  };
  address?: string;
}

export interface PaymentCard {
  id: string;
  userId: string;
  last4: string;
  brand: 'mastercard' | 'visa' | 'unknown';
  isDefault: boolean;
  createdAt: Date;
}

// Интерфейсы водителей
export interface Driver {
  id: string;
  userId: string;
  carModel: string;
  licensePlate: string;
  rating: number;
  state: DriverState;
  isApproved: boolean;
  documentsVerified: boolean;
  location?: {
    lat: number;
    lng: number;
  };
  earningsToday: number;
  totalTrips: number;
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейсы поездок
export interface Ride {
  id: string;
  clientId: string;
  driverId?: string;
  pickup: string;
  destination: string;
  pickupCoords: {
    lat: number;
    lng: number;
  };
  destinationCoords: {
    lat: number;
    lng: number;
  };
  fare: number;
  rideType: RideType;
  paymentMethod: PaymentMethod;
  status: RideStatus;
  estimatedDuration?: number;
  actualDuration?: number;
  distance?: number;
  scheduledFor?: Date;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
}

export interface ChatMessage {
  id: string;
  rideId: string;
  senderId: string;
  senderType: 'client' | 'driver';
  message: string;
  createdAt: Date;
}

// API типы
export interface AuthResponse {
  user: User;
  profile: UserProfile;
  token: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
  userMode: UserMode;
}

export interface RegisterRequest {
  name: string;
  phone: string;
  email: string;
  password: string;
  userMode: UserMode;
}

export interface CreateRideRequest {
  pickup: string;
  destination: string;
  pickupCoords: {
    lat: number;
    lng: number;
  };
  destinationCoords: {
    lat: number;
    lng: number;
  };
  rideType: RideType;
  paymentMethod: PaymentMethod;
  scheduledFor?: Date;
}

export interface UpdateLocationRequest {
  lat: number;
  lng: number;
}

export interface AcceptRideRequest {
  rideId: string;
}

export interface UpdateRideStatusRequest {
  rideId: string;
  status: RideStatus;
}

// WebSocket события
export interface SocketEvent {
  type: string;
  data: any;
  userId?: string;
  rideId?: string;
}

export interface RideStatusUpdate {
  rideId: string;
  status: RideStatus;
  driverId?: string;
  estimatedArrival?: number;
}

export interface LocationUpdate {
  userId: string;
  userType: 'client' | 'driver';
  location: {
    lat: number;
    lng: number;
  };
  rideId?: string;
}

// Статистика для админки
export interface AdminStats {
  totalRides: number;
  activeRides: number;
  totalDrivers: number;
  onlineDrivers: number;
  totalClients: number;
  todayRevenue: number;
  averageRating: number;
}

// Ошибки API
export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// Express расширения
declare global {
  namespace Express {
    interface Request {
      user?: User;
      profile?: UserProfile;
    }
  }
}