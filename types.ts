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

export interface Auth {
    isAuthenticated: boolean;
    userMode: UserMode | null;
}

export enum DriverState {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE', // waiting for ride
  INCOMING_RIDE = 'INCOMING_RIDE', // new ride request
  TO_PICKUP = 'TO_PICKUP', // accepted, on the way to client
  TRIP_IN_PROGRESS = 'TRIP_IN_PROGRESS', // client is in the car
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

export enum ModalType {
    NONE,
    CHAT,
    SCHEDULE,
    CANCEL_RIDE,
    RATING,
    PROFILE, // Client Profile
    RIDE_HISTORY,
    HELP,
    DRIVER_PROFILE, // Driver Profile
    ADD_CARD, // New modal for adding a payment card
    DRIVER_RIDE_HISTORY, // New modal for driver's ride history
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'driver';
  text: string;
  timestamp: string;
}

export interface PaymentCard {
    id: string;
    last4: string;
    brand: 'mastercard' | 'visa' | 'unknown';
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  photoUrl: string;
  carModel: string;
  licensePlate: string;
  state: DriverState;
  earningsToday: number;
  pastTrips: RideHistoryEntry[];
  location: {
    lat: number;
    lng: number;
  };
}

export interface RideOptions {
  wheelchairAccessible: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  walletBalance: number;
  photoUrl: string;
  paymentMethods: PaymentCard[];
  location: {
    lat: number;
    lng: number;
  }
}

export interface RideHistoryEntry {
  id: string;
  date: string;
  pickup: string;
  destination: string;
  fare: number;
  driver: Driver;
}

export interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface ActiveTrip {
    id: string; // Unique ride ID from backend
    clientId: string;
    clientProfile: UserProfile;
    driverId: string | null;
    pickup: string;
    destination: string;
    fare: number;
    rideType: RideType;
}

export interface AppContextType {
    auth: Auth;
    login: (mode: UserMode) => Promise<void>;
    logout: () => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;

    // --- State for Backend Interaction ---
    isInitializing: boolean; // For initial auth check
    isLoading: boolean; // For general loading like profile save
    isFindingDriver: boolean; // Specific for find driver button
    error: string | null;
    
    // Global State
    appState: AppState;
    drivers: Driver[];
    activeTrip: ActiveTrip | null;
    assignedDriver: Driver | null;
    chatMessages: ChatMessage[];
    eta: number | null;
    clientProfile: UserProfile | null;
    toasts: ToastData[];
    rideHistory: RideHistoryEntry[];
    
    // Actions
    addToast: (message: string, type?: ToastData['type']) => void;
    removeToast: (id: number) => void;
    handleFindDriver: (pickup: string, destination: string, fare: string, rideType: RideType) => Promise<void>;
    handleAcceptRide: (driverId: string) => Promise<void>;
    handleDeclineRide: (driverId: string) => Promise<void>;
    handleStartTrip: (driverId: string) => Promise<void>;
    handleEndTrip: (driverId: string, fare: number) => Promise<void>;
    handleCancelClient: () => Promise<void>;
    handleNewRide: () => void;
    handleSendMessage: (text: string, sender: 'user' | 'driver') => Promise<void>;
    handleProfileSave: (p: UserProfile) => Promise<void>;
    handleAddCard: (card: PaymentCard) => Promise<void>;
    setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
    
    // Direct access for Admin/Driver views if needed
    getDriverById: (id: string) => Driver | undefined;
}