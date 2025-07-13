
import React, { useState, useCallback, useMemo } from 'react';
import { AppState, DriverState, ModalType } from '../types';
import DriverDashboard from '../components/driver/DriverDashboard';
import RideRequestCard from '../components/driver/RideRequestCard';
import MapPlaceholder from '../components/MapPlaceholder';
import DriverHeader from '../components/driver/DriverHeader';
import Toast from '../components/Toast';
import ChatModal from '../components/ChatModal';
import DriverProfileModal from '../components/modals/DriverProfileModal';
import DriverRideHistoryModal from '../components/modals/DriverRideHistoryModal';
import { useAppContext } from '../contexts/AppContext';

interface DriverViewProps {
    driverId: string;
}

const mapDriverStateToAppState = (state: DriverState): AppState => {
    switch (state) {
        case DriverState.TO_PICKUP: return AppState.CONFIRMED;
        case DriverState.TRIP_IN_PROGRESS: return AppState.TRIP_IN_PROGRESS;
        default: return AppState.BOOKING;
    }
}

const DriverView: React.FC<DriverViewProps> = ({ driverId }) => {
    const {
        getDriverById, setDrivers, activeTrip, clientProfile, handleAcceptRide, handleDeclineRide,
        handleStartTrip, handleEndTrip, chatMessages, handleSendMessage, toasts, removeToast,
        addToast, isDarkMode, toggleDarkMode, rideHistory, logout
    } = useAppContext();

    const driver = getDriverById(driverId);
    
    const [activeModal, setActiveModal] = useState<ModalType>(ModalType.NONE);

    const closeModal = useCallback(() => setActiveModal(ModalType.NONE), []);
    const openChatModal = useCallback(() => setActiveModal(ModalType.CHAT), []);
    const openProfileModal = useCallback(() => setActiveModal(ModalType.DRIVER_PROFILE), []);
    const openRideHistoryModal = useCallback(() => setActiveModal(ModalType.DRIVER_RIDE_HISTORY), []);
    
    const handleToggleOnline = () => {
        if (!driver) return;
        const newStatus = driver.state === DriverState.OFFLINE ? DriverState.ONLINE : DriverState.OFFLINE;
        setDrivers(prev => prev.map(d => d.id === driver.id ? { ...d, state: newStatus } : d));
        addToast(newStatus === DriverState.ONLINE ? 'Вы на линии' : 'Вы ушли с линии', 'info');
    };

    if (!driver) {
        return <div>Водитель не найден</div>;
    }

    const incomingRide = activeTrip && driver.state === DriverState.INCOMING_RIDE;
    
    const memoizedModal = useMemo(() => {
        const chatPartner = clientProfile ? { name: clientProfile.name, photoUrl: clientProfile.photoUrl } : null;

        switch(activeModal) {
          case ModalType.CHAT:
            return chatPartner && <ChatModal partner={chatPartner} messages={chatMessages} onSendMessage={(text) => handleSendMessage(text, 'driver')} onClose={closeModal} />;
          case ModalType.DRIVER_PROFILE:
              return <DriverProfileModal driver={driver} onClose={closeModal} onLogout={logout} />;
          case ModalType.DRIVER_RIDE_HISTORY:
              return <DriverRideHistoryModal rideHistory={rideHistory.filter(r => r.driver.id === driver.id)} onClose={closeModal} />;
          default:
            return null;
        }
    }, [activeModal, driver, clientProfile, chatMessages, handleSendMessage, closeModal, rideHistory, logout]);

    return (
        <div className="h-full w-full flex flex-col">
            <MapPlaceholder appState={mapDriverStateToAppState(driver.state)} showIntermediateStop={false} />

            <DriverHeader 
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                earningsToday={driver.earningsToday}
                onOpenProfile={openProfileModal}
                onOpenRideHistory={openRideHistoryModal}
            />

            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-6 lg:p-8 flex justify-center items-end">
                <div className="w-full max-w-md space-y-4">
                     {incomingRide && activeTrip && (
                        <RideRequestCard
                            pickup={activeTrip.pickup}
                            destination={activeTrip.destination}
                            fare={activeTrip.fare.toString()}
                            onAccept={() => handleAcceptRide(driver.id)}
                            onDecline={() => handleDeclineRide(driver.id)}
                        />
                     )}

                    <DriverDashboard 
                        driver={driver} 
                        onToggleOnline={handleToggleOnline} 
                        activeTrip={activeTrip}
                        clientProfile={clientProfile}
                        onStartTrip={() => handleStartTrip(driver.id)}
                        onEndTrip={() => handleEndTrip(driver.id, activeTrip?.fare || 0)}
                        onChat={openChatModal}
                    />
                </div>
            </div>

            {memoizedModal}
      
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 space-y-3 z-30 w-full max-w-sm">
                <div className="flex flex-col-reverse items-end space-y-reverse space-y-3">
                    {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto w-full">
                        <Toast {...toast} onClose={removeToast} />
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DriverView;