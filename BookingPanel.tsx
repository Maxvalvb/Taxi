import React, { useEffect } from 'react';
import { AppState, RideType, Driver, PaymentMethod, RidePurpose, RideOptions } from '../types';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { CarIcon } from './icons/CarIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { HomeIcon } from './icons/HomeIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { ClockIcon } from './icons/ClockIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { WheelchairIcon } from './icons/WheelchairIcon';
import { TagIcon } from './icons/TagIcon';
import { ShareIcon } from './icons/ShareIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import PaymentSelector from './PaymentSelector';
import { ChatIcon } from './icons/ChatIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import Spinner from './Spinner';

// Prop Interfaces
interface BookingPanelProps {
  appState: AppState;
  pickup: string; setPickup: (v: string) => void;
  destination: string; setDestination: (v: string) => void;
  showIntermediateStop: boolean; setShowIntermediateStop: (v: boolean) => void;
  intermediateStop: string; setIntermediateStop: (v: string) => void;
  fare: string; setFare: (v: string) => void;
  rideType: RideType; setRideType: (t: RideType) => void;
  ridePurpose: RidePurpose; setRidePurpose: (p: RidePurpose) => void;
  rideOptions: RideOptions; setRideOptions: (o: RideOptions) => void;
  paymentMethod: PaymentMethod; setPaymentMethod: (m: PaymentMethod) => void;
  promoCode: string; setPromoCode: (c: string) => void;
  driver: Driver | null;
  eta: number | null;
  isListening: boolean;
  isFindingDriver: boolean;
  onFindDriver: () => void;
  onCancel: () => void;
  onNewRide: () => void;
  onChat: () => void;
  onSchedule: () => void;
  onVoiceCommand: () => void;
}
type BookingFormProps = Omit<BookingPanelProps, 'appState' | 'onCancel' | 'onNewRide' | 'driver' | 'eta' | 'onChat'>;

// Reusable Components
const RideTypeOption: React.FC<{type: RideType, icon: React.ReactNode, selected: boolean, onClick: () => void, price: number, isPremium?: boolean}> = ({ type, icon, selected, onClick, price, isPremium=false }) => (
    <button onClick={onClick} className={`flex-1 p-3 rounded-lg border-2 transition-all duration-300 flex flex-col items-center space-y-1 relative overflow-hidden ${selected ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-500 shadow-inner' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'}`}>
        {isPremium && <div className="absolute top-0 right-0 h-4 w-4 bg-yellow-400 dark:bg-yellow-500" style={{clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'}}></div>}
        {icon}
        <span className={`text-xs sm:text-sm font-semibold ${selected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}>{type}</span>
        <span className={`text-xs font-bold ${selected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{price} ₽</span>
    </button>
);

const FareSuggestion: React.FC<{amount: number, onClick: (amount: number) => void}> = ({ amount, onClick }) => (
    <button onClick={() => onClick(amount)} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
        {amount} ₽
    </button>
);

const BASE_FARES = {
    [RideType.ECONOMY]: 350,
    [RideType.COMFORT]: 500,
    [RideType.BUSINESS]: 800,
};
const SURGE_MULTIPLIER = 1.3;
const IS_SURGE_ACTIVE = true; // Let's assume surge is active for demo

// Main Views
const BookingFormView: React.FC<BookingFormProps> = (props) => {
    const { pickup, setPickup, destination, setDestination, showIntermediateStop, setShowIntermediateStop, intermediateStop, setIntermediateStop, fare, setFare, rideType, setRideType, ridePurpose, setRidePurpose, rideOptions, setRideOptions, paymentMethod, setPaymentMethod, promoCode, setPromoCode, onFindDriver, onSchedule, onVoiceCommand, isListening, isFindingDriver } = props;
    
    useEffect(() => {
        const baseFare = BASE_FARES[rideType];
        const finalFare = IS_SURGE_ACTIVE ? Math.round(baseFare * SURGE_MULTIPLIER) : baseFare;
        setFare(finalFare.toString());
    }, [rideType, setFare]);

    const getPriceForType = (type: RideType) => {
        const baseFare = BASE_FARES[type];
        return IS_SURGE_ACTIVE ? Math.round(baseFare * SURGE_MULTIPLIER) : baseFare;
    };
    
    const currentFare = parseInt(fare, 10) || getPriceForType(RideType.ECONOMY);
    const suggestions = [Math.round(currentFare * 0.9), currentFare, Math.round(currentFare * 1.1)].filter(f => f > 50);

    return (
    <>
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Заказ поездки</h2>
            <div className="flex items-center space-x-2">
                <button onClick={onSchedule} className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"><ClockIcon className="w-6 h-6"/></button>
                <button onClick={onVoiceCommand} className="relative p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  <MicrophoneIcon className="w-6 h-6"/>
                  {isListening && <span className="absolute inset-0 rounded-full bg-blue-500/50 animate-pulse-ring"></span>}
                </button>
            </div>
        </div>

        <div className="space-y-3">
            {/* Address Inputs */}
            <div className="flex space-x-2">
                <button onClick={() => setPickup('Кремль, Москва')} className="flex items-center space-x-2 text-sm bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full transition"><HomeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400"/><span>Дом</span></button>
                <button onClick={() => setDestination('Москва-Сити')} className="flex items-center space-x-2 text-sm bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full transition"><BriefcaseIcon className="w-4 h-4 text-gray-500 dark:text-gray-400"/><span>Работа</span></button>
            </div>
            <div className="relative">
                <LocationPinIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                <input type="text" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Место подачи" className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>
             {showIntermediateStop && (
                <div className="relative animate-toast-in">
                    <LocationPinIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-500" />
                    <input type="text" value={intermediateStop} onChange={(e) => setIntermediateStop(e.target.value)} placeholder="Промежуточная остановка" className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                    <button onClick={() => setShowIntermediateStop(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"><MinusIcon className="w-5 h-5"/></button>
                </div>
            )}
            <div className="relative">
                <LocationPinIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Пункт назначения" className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                 {!showIntermediateStop && <button onClick={() => setShowIntermediateStop(true)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"><PlusIcon className="w-5 h-5"/></button>}
            </div>

            {/* Ride Types */}
            <div className="flex space-x-2">
                 <RideTypeOption type={RideType.ECONOMY} price={getPriceForType(RideType.ECONOMY)} icon={<CarIcon className="w-7 h-7 text-gray-500 dark:text-gray-400" />} selected={rideType === RideType.ECONOMY} onClick={() => setRideType(RideType.ECONOMY)} />
                 <RideTypeOption type={RideType.COMFORT} price={getPriceForType(RideType.COMFORT)} icon={<CarIcon className="w-7 h-7 text-blue-500 dark:text-blue-400" />} selected={rideType === RideType.COMFORT} onClick={() => setRideType(RideType.COMFORT)} />
                 <RideTypeOption type={RideType.BUSINESS} price={getPriceForType(RideType.BUSINESS)} isPremium icon={<CarIcon className="w-7 h-7 text-black dark:text-white" />} selected={rideType === RideType.BUSINESS} onClick={() => setRideType(RideType.BUSINESS)} />
            </div>
            
            {/* Options and Fare */}
            <div className="flex items-center space-x-2 text-sm">
                <button onClick={() => setRideOptions({ ...rideOptions, wheelchairAccessible: !rideOptions.wheelchairAccessible })} className={`flex items-center space-x-2 p-2 rounded-lg transition ${rideOptions.wheelchairAccessible ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800'}`}><WheelchairIcon className="w-5 h-5"/><span>Доступность</span></button>
                <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-2 space-x-2">
                    <TagIcon className="w-5 h-5 text-gray-500"/>
                    <select value={ridePurpose} onChange={e => setRidePurpose(e.target.value as RidePurpose)} className="bg-transparent focus:outline-none w-full appearance-none">
                        <option value={RidePurpose.PERSONAL}>Личная</option>
                        <option value={RidePurpose.BUSINESS}>Бизнес</option>
                    </select>
                </div>
            </div>

            <div className="relative">
                <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input type="number" value={fare} onChange={(e) => setFare(e.target.value)} placeholder="Предложите свою цену" className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>
            <div className="flex justify-center items-center space-x-2">
                {suggestions.map(s => <FareSuggestion key={s} amount={s} onClick={(a) => setFare(a.toString())} />)}
                {IS_SURGE_ACTIVE && <div className="flex items-center space-x-1 text-orange-500 text-xs font-semibold animate-pulse"><div className="w-2 h-2 rounded-full bg-orange-500"></div><span>Повышенный спрос</span></div>}
            </div>
        </div>

        <div>
            <PaymentSelector selected={paymentMethod} onSelect={setPaymentMethod} />
            <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Промокод" className="mt-3 w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        </div>

        <button 
            onClick={onFindDriver}
            disabled={isFindingDriver}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2">
            {isFindingDriver && <Spinner />}
            <span>{isFindingDriver ? 'Ищем...' : 'Найти водителя'}</span>
        </button>
    </>
    )
};

const SearchingView: React.FC<{onCancel: () => void}> = ({onCancel}) => (
    <div className="flex flex-col items-center justify-center space-y-6 text-center py-8">
        <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
            <div className="absolute inset-0 w-24 h-24 rounded-full border-t-4 border-blue-600 dark:border-blue-400 animate-spin"></div>
            <CarIcon className="absolute inset-0 m-auto w-10 h-10 text-blue-600 dark:text-blue-400"/>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Поиск водителя...</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs">Это займет всего минуту. Мы ищем для вас водителей поблизости.</p>
        <button onClick={onCancel} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          Отменить
        </button>
    </div>
);

const formatEta = (seconds: number | null) => {
    if (seconds === null) return '...';
    if (seconds <= 0) return 'Прибыл';
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

const DriverInfoCard: React.FC<{driver: Driver; onChat: () => void}> = ({driver, onChat}) => (
    <div className="w-full bg-gray-50 dark:bg-gray-800/80 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
        <div className="flex items-center space-x-4">
        <img src={driver.photoUrl} alt={driver.name} className="w-16 h-16 rounded-full border-2 border-white dark:border-gray-600 shadow-md" />
        <div className="text-left flex-1">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{driver.name}</h3>
            <p className="font-semibold text-yellow-500 flex items-center">
            {driver.rating.toFixed(1)}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </p>
        </div>
        <div className="flex space-x-2">
            <button onClick={onChat} className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"><ChatIcon className="w-6 h-6 text-blue-600 dark:text-blue-400"/></button>
            <button className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"><PhoneIcon className="w-6 h-6 text-green-600 dark:text-green-400"/></button>
        </div>
        </div>
        <div className="text-left text-sm pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">{driver.carModel}</p>
        <p className="text-gray-800 dark:text-gray-200 font-mono bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-md inline-block mt-1">{driver.licensePlate}</p>
        </div>
    </div>
);

const ConfirmedView: React.FC<{onCancel: () => void; onChat: () => void; driver: Driver; eta: number | null}> = ({onCancel, onChat, driver, eta}) => (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Водитель найден!</h2>
        <p className="text-gray-500 dark:text-gray-400">Прибытие через <span className="font-bold text-blue-600 dark:text-blue-400 text-xl">{formatEta(eta)}</span></p>
        <DriverInfoCard driver={driver} onChat={onChat} />
        <button onClick={onCancel} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          Отменить
        </button>
    </div>
);

const TripInProgressView: React.FC<{ onChat: () => void; driver: Driver; eta: number | null, destination: string }> = ({ onChat, driver, eta, destination }) => (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Поездка в процессе</h2>
        <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Прибытие в <span className="font-semibold text-gray-700 dark:text-gray-200">{destination}</span> через</p>
            <p className="font-bold text-blue-600 dark:text-blue-400 text-3xl">{formatEta(eta)}</p>
        </div>
        <DriverInfoCard driver={driver} onChat={onChat} />
        <div className="w-full grid grid-cols-2 gap-3">
             <button className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold">
                <ShareIcon className="w-5 h-5" />
                <span>Поделиться</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors font-bold">
                <ShieldIcon className="w-5 h-5" />
                <span>SOS</span>
            </button>
        </div>
    </div>
);

const TripCompleteView: React.FC<{onNewRide: () => void}> = ({onNewRide}) => (
    <div className="flex flex-col items-center justify-center space-y-4 text-center py-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Поездка завершена!</h2>
        <p className="text-gray-500 dark:text-gray-400">Спасибо, что выбрали нас. Оцените вашу поездку.</p>
        <button onClick={onNewRide} className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-all shadow-lg">
          Заказать еще
        </button>
    </div>
);

const BookingPanel: React.FC<BookingPanelProps> = (props) => {
  const renderContent = () => {
    switch(props.appState) {
      case AppState.BOOKING:
        return <BookingFormView {...props} />;
      case AppState.SEARCHING:
        return <SearchingView onCancel={props.onCancel} />;
      case AppState.CONFIRMED:
        return props.driver && <ConfirmedView onCancel={props.onCancel} onChat={props.onChat} driver={props.driver} eta={props.eta} />;
      case AppState.TRIP_IN_PROGRESS:
        return props.driver && <TripInProgressView onChat={props.onChat} driver={props.driver} eta={props.eta} destination={props.destination}/>;
      case AppState.TRIP_COMPLETE:
        return <TripCompleteView onNewRide={props.onNewRide} />;
      default:
        return null;
    }
  }

  return (
    <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6 space-y-4 transform transition-all duration-500 ease-in-out">
        {renderContent()}
    </div>
  );
};

export default BookingPanel;