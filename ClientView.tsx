import React, { useState, useCallback, useMemo } from 'react';
import Header from '../components/Header';
import MapPlaceholder from '../components/MapPlaceholder';
import BookingPanel from '../components/BookingPanel';
import ChatModal from '../components/ChatModal';
import ScheduleModal from '../components/modals/ScheduleModal';
import CancelRideModal from '../components/modals/CancelRideModal';
import RatingModal from '../components/modals/RatingModal';
import ProfileModal from '../components/modals/ProfileModal';
import RideHistoryModal from '../components/modals/RideHistoryModal';
import HelpModal from '../components/modals/HelpModal';
import Toast from '../components/Toast';
import { AppState, RideType, PaymentMethod, ModalType, RidePurpose, RideOptions, UserProfile, PaymentCard } from '../types';
import AddCardModal from '../components/modals/AddCardModal';
import { useAppContext } from '../contexts/AppContext';
import LoadingOverlay from '../components/LoadingOverlay';

const ClientView: React.FC = () => {
  const {
    appState, assignedDriver, handleFindDriver, handleCancelClient, handleNewRide,
    chatMessages, handleSendMessage, eta, toasts, removeToast, addToast, clientProfile,
    isDarkMode, toggleDarkMode, handleProfileSave, handleAddCard, rideHistory, logout,
    isFindingDriver
  } = useAppContext();

  const [pickup, setPickup] = useState<string>('ул. Ленина, 1, Москва');
  const [destination, setDestination] = useState<string>('ул. Тверская, 10, Москва');
  const [showIntermediateStop, setShowIntermediateStop] = useState(false);
  const [intermediateStop, setIntermediateStop] = useState('');
  const [fare, setFare] = useState<string>('350');
  const [rideType, setRideType] = useState<RideType>(RideType.ECONOMY);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CARD);
  const [promoCode, setPromoCode] = useState('');
  const [ridePurpose, setRidePurpose] = useState<RidePurpose>(RidePurpose.PERSONAL);
  const [rideOptions, setRideOptions] = useState<RideOptions>({ wheelchairAccessible: false });

  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.NONE);
  const [isListening, setIsListening] = useState(false);
  
  React.useEffect(() => {
    if (appState === AppState.TRIP_COMPLETE && activeModal !== ModalType.RATING) {
        const timer = setTimeout(() => setActiveModal(ModalType.RATING), 1000);
        return () => clearTimeout(timer);
    }
  }, [appState, activeModal]);
  
  const closeModal = useCallback(() => setActiveModal(ModalType.NONE), []);
  
  const openCancelModal = useCallback(() => setActiveModal(ModalType.CANCEL_RIDE), []);
  const openChatModal = useCallback(() => setActiveModal(ModalType.CHAT), []);
  const openScheduleModal = useCallback(() => setActiveModal(ModalType.SCHEDULE), []);
  const openProfileModal = useCallback(() => setActiveModal(ModalType.PROFILE), []);
  const openRideHistoryModal = useCallback(() => setActiveModal(ModalType.RIDE_HISTORY), []);
  const openHelpModal = useCallback(() => setActiveModal(ModalType.HELP), []);
  const openAddCardModal = useCallback(() => setActiveModal(ModalType.ADD_CARD), []);

  const handleNewRideAndCloseModal = useCallback(() => {
    handleNewRide();
    closeModal();
  }, [handleNewRide, closeModal]);

  const handleFindDriverClick = useCallback(async () => {
      await handleFindDriver(pickup, destination, fare, rideType);
  }, [handleFindDriver, pickup, destination, fare, rideType]);
  
  const handleVoiceCommand = useCallback(() => {
    setIsListening(true);
    addToast('Слушаю вас... скажите пункт назначения');
    setTimeout(() => {
        setIsListening(false);
        setDestination('Парк Горького, Москва');
        addToast('Маршрут до "Парк Горького" построен', 'success');
    }, 5000);
  }, [addToast]);

  const handleScheduleConfirm = useCallback(() => {
    addToast('Поездка запланирована!', 'success');
    closeModal();
  }, [addToast, closeModal]);

  const handleCancelConfirm = useCallback(async () => {
    await handleCancelClient();
    closeModal();
  }, [handleCancelClient, closeModal]);
  
  const handleProfileSaveConfirm = useCallback(async (p: UserProfile) => {
    await handleProfileSave(p);
    closeModal();
  }, [handleProfileSave, closeModal]);

  const handleAddCardConfirm = useCallback(async (card: PaymentCard) => {
    await handleAddCard(card);
    closeModal();
  }, [handleAddCard, closeModal]);

  const memoizedModal = useMemo(() => {
    if (!clientProfile) return null; // Ensure profile is loaded

    const chatPartner = assignedDriver ? {
        ...assignedDriver,
        name: assignedDriver.name,
        photoUrl: assignedDriver.photoUrl
    } : null;

    switch(activeModal) {
      case ModalType.CHAT:
        return chatPartner && <ChatModal partner={chatPartner} messages={chatMessages} onSendMessage={(text) => handleSendMessage(text, 'user')} onClose={closeModal} />;
      case ModalType.SCHEDULE:
        return <ScheduleModal onClose={closeModal} onSchedule={handleScheduleConfirm} />;
      case ModalType.CANCEL_RIDE:
          return <CancelRideModal onClose={closeModal} onConfirm={handleCancelConfirm} />;
      case ModalType.RATING:
          return assignedDriver && <RatingModal driver={assignedDriver} onClose={handleNewRideAndCloseModal} />;
      case ModalType.PROFILE:
          return <ProfileModal profile={clientProfile} onSave={handleProfileSaveConfirm} onClose={closeModal} onOpenAddCard={openAddCardModal} onLogout={logout} />;
      case ModalType.RIDE_HISTORY:
          return <RideHistoryModal rideHistory={rideHistory} onClose={closeModal} />;
      case ModalType.HELP:
          return <HelpModal onClose={closeModal} />;
      case ModalType.ADD_CARD:
        return <AddCardModal onAddCard={handleAddCardConfirm} onClose={closeModal} />;
      default:
        return null;
    }
  }, [activeModal, assignedDriver, chatMessages, handleSendMessage, closeModal, handleScheduleConfirm, handleCancelConfirm, clientProfile, handleProfileSaveConfirm, rideHistory, openAddCardModal, handleAddCardConfirm, handleNewRideAndCloseModal, logout]);

  if (!clientProfile) {
    return <LoadingOverlay />;
  }

  return (
    <div className="h-full w-full">
      <MapPlaceholder appState={appState} showIntermediateStop={showIntermediateStop} />
      
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        walletBalance={clientProfile.walletBalance}
        onOpenProfile={openProfileModal}
        onOpenMenu={openRideHistoryModal}
        onOpenHelp={openHelpModal}
      />

      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-6 lg:p-8 flex justify-center items-end">
        <BookingPanel
          appState={appState}
          pickup={pickup} setPickup={setPickup}
          destination={destination} setDestination={setDestination}
          showIntermediateStop={showIntermediateStop} setShowIntermediateStop={setShowIntermediateStop}
          intermediateStop={intermediateStop} setIntermediateStop={setIntermediateStop}
          fare={fare} setFare={setFare}
          rideType={rideType} setRideType={setRideType}
          ridePurpose={ridePurpose} setRidePurpose={setRidePurpose}
          rideOptions={rideOptions} setRideOptions={setRideOptions}
          paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
          promoCode={promoCode} setPromoCode={setPromoCode}
          driver={assignedDriver}
          eta={eta}
          isListening={isListening}
          isFindingDriver={isFindingDriver}
          onFindDriver={handleFindDriverClick}
          onCancel={openCancelModal}
          onNewRide={handleNewRide}
          onChat={openChatModal}
          onSchedule={openScheduleModal}
          onVoiceCommand={handleVoiceCommand}
        />
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

export default ClientView;