
import { 
    UserMode, UserProfile, Driver, DriverState, RideHistoryEntry, 
    PaymentCard, ActiveTrip, ChatMessage, RideType
} from '../types';
import { getDistance } from '../utils/helpers';

// --- MOCK DATABASE ---
let mockDrivers: Driver[] = [
    { id: 'd1', name: 'Алексей', rating: 4.9, photoUrl: 'https://i.pravatar.cc/150?u=driver42', carModel: 'Toyota Camry', licensePlate: 'А123ВС777', state: DriverState.ONLINE, location: { lat: 55.76, lng: 37.64 }, earningsToday: 4200, pastTrips: [] },
    { id: 'd2', name: 'Сергей', rating: 4.8, photoUrl: 'https://i.pravatar.cc/150?u=driver16', carModel: 'Hyundai Solaris', licensePlate: 'В456УЕ777', state: DriverState.OFFLINE, location: { lat: 55.75, lng: 37.61 }, earningsToday: 0, pastTrips: [] },
    { id: 'd3', name: 'Дмитрий', rating: 5.0, photoUrl: 'https://i.pravatar.cc/150?u=driver8', carModel: 'Kia Rio', licensePlate: 'Е789КХ777', state: DriverState.ONLINE, location: { lat: 55.74, lng: 37.62 }, earningsToday: 3500, pastTrips: [] },
];

let mockClientProfile: UserProfile = {
  name: 'Иван Петров',
  phone: '+7 (999) 123-45-67',
  email: 'ivan.petrov@email.com',
  walletBalance: 1250,
  photoUrl: 'https://i.pravatar.cc/150?u=user1',
  paymentMethods: [{ id: 'card1', last4: '4242', brand: 'mastercard' }],
  location: { lat: 55.755, lng: 37.617 }
};

let mockRideHistory: RideHistoryEntry[] = [];
let mockActiveRides: (ActiveTrip & { status: DriverState | 'cancelled' })[] = [];

// --- API Service Simulation ---
const simulateRequest = <T>(data: T, delay: number = 500): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
}

export const apiService = {
    async login(mode: UserMode): Promise<UserProfile> {
        // In a real app, this would hit /api/login and return user data
        return simulateRequest(mockClientProfile, 1000);
    },

    async fetchDrivers(): Promise<Driver[]> {
        return simulateRequest([...mockDrivers]);
    },

    async fetchRideHistory(): Promise<RideHistoryEntry[]> {
        return simulateRequest([...mockRideHistory]);
    },
    
    async createRide(details: { pickup: string, destination: string, fare: number, rideType: RideType, clientProfile: UserProfile }): Promise<ActiveTrip> {
        const newRide: ActiveTrip & { status: DriverState } = {
            id: `ride_${Date.now()}`,
            clientId: 'user1',
            driverId: null,
            status: DriverState.ONLINE, // Initial status, means "searching"
            ...details
        };
        mockActiveRides.push(newRide);
        return simulateRequest(newRide, 1000);
    },

    async getRideStatus(rideId: string, userMode: UserMode): Promise<{ status: string, driver: Driver | null }> {
        const ride = mockActiveRides.find(r => r.id === rideId);
        if (!ride) throw new Error("Ride not found");

        // If a driver is already assigned, return it.
        if (ride.driverId) {
            const driver = mockDrivers.find(d => d.id === ride.driverId);
            return simulateRequest({ status: ride.status, driver: driver || null });
        }

        // --- Find Driver Logic ---
        let driverToAssign: Driver | undefined;
        
        // Simulation override for predictable testing in Admin/Driver views
        if (userMode === UserMode.ADMIN || userMode === UserMode.DRIVER) {
             const d1 = mockDrivers.find(d => d.id === 'd1');
             if (d1?.state === DriverState.ONLINE) {
                 driverToAssign = d1;
             }
        }
        
        // Default logic if override doesn't apply
        if (!driverToAssign) {
            const availableDrivers = mockDrivers.filter(d => d.state === DriverState.ONLINE);
            if (availableDrivers.length > 0) {
                let closestDriver = availableDrivers[0];
                let minDistance = getDistance(ride.clientProfile.location.lat, ride.clientProfile.location.lng, closestDriver.location.lat, closestDriver.location.lng);
                for (let i = 1; i < availableDrivers.length; i++) {
                    const driver = availableDrivers[i];
                    const distance = getDistance(ride.clientProfile.location.lat, ride.clientProfile.location.lng, driver.location.lat, driver.location.lng);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestDriver = driver;
                    }
                }
                driverToAssign = closestDriver;
            }
        }
        
        if (driverToAssign) {
            // Assign driver to ride
            ride.driverId = driverToAssign.id;
            ride.status = DriverState.TO_PICKUP;
            // Update driver's state
            mockDrivers = mockDrivers.map(d => d.id === driverToAssign!.id ? { ...d, state: DriverState.TO_PICKUP } : d);
            return simulateRequest({ status: ride.status, driver: driverToAssign });
        }
        
        return simulateRequest({ status: 'searching', driver: null });
    },

    async cancelRide(rideId: string): Promise<{ success: boolean }> {
        mockActiveRides = mockActiveRides.filter(r => r.id !== rideId);
        mockDrivers = mockDrivers.map(d => (d.state === DriverState.INCOMING_RIDE || d.state === DriverState.TO_PICKUP) ? {...d, state: DriverState.ONLINE } : d);
        return simulateRequest({ success: true });
    },
    
    async updateRideStatus(rideId: string, newStatus: 'TRIP_IN_PROGRESS' | 'TRIP_COMPLETE'): Promise<{ success: boolean }> {
        const ride = mockActiveRides.find(r => r.id === rideId);
        if (ride) {
            mockDrivers = mockDrivers.map(d => d.id === ride.driverId ? { ...d, state: DriverState[newStatus] } : d);
            if (newStatus === 'TRIP_COMPLETE') {
                 mockActiveRides = mockActiveRides.filter(r => r.id !== rideId);
            }
        }
        return simulateRequest({ success: true });
    },

    async updateDriverEarnings(driverId: string, fare: number): Promise<{ earningsToday: number }> {
        let earnings = 0;
        mockDrivers = mockDrivers.map(d => {
            if (d.id === driverId) {
                earnings = d.earningsToday + fare;
                return { ...d, earningsToday: earnings, state: DriverState.ONLINE };
            }
            return d;
        });
        return simulateRequest({ earningsToday: earnings });
    },

    async sendMessage(text: string, sender: 'user' | 'driver'): Promise<ChatMessage> {
        const newMessage: ChatMessage = { 
            id: Date.now(), 
            sender, 
            text, 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        return simulateRequest(newMessage, 200);
    },

    async updateProfile(profile: UserProfile): Promise<UserProfile> {
        mockClientProfile = profile;
        return simulateRequest(mockClientProfile, 800);
    },

    async addPaymentCard(profile: UserProfile, card: PaymentCard): Promise<UserProfile> {
        const newProfile = { ...profile, paymentMethods: [...profile.paymentMethods, card]};
        mockClientProfile = newProfile;
        return simulateRequest(newProfile, 600);
    }
};