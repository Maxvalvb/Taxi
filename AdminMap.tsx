
import React from 'react';
import { Driver, DriverState } from '../../types';
import { DriverCarIcon } from '../icons/DriverCarIcon';

const getStatusColor = (state: DriverState) => {
    switch(state) {
        case DriverState.ONLINE: return 'text-green-500';
        case DriverState.OFFLINE: return 'text-gray-400';
        case DriverState.INCOMING_RIDE: return 'text-blue-500 animate-pulse';
        case DriverState.TO_PICKUP: return 'text-yellow-500';
        case DriverState.TRIP_IN_PROGRESS: return 'text-purple-500';
        default: return 'text-gray-400';
    }
}

const AdminMap: React.FC<{ drivers: Driver[] }> = ({ drivers }) => {
  // This is a placeholder map. In a real app, you'd use a library like Leaflet or Google Maps.
  return (
    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 overflow-hidden z-10">
      {/* Background elements */}
      <div className="absolute top-1/3 left-0 w-full h-8 bg-gray-300 dark:bg-gray-700 transform -skew-y-6"></div>
      <div className="absolute top-1/2 left-0 w-full h-12 bg-gray-300 dark:bg-gray-700"></div>
      <div className="absolute left-1/4 top-0 w-10 h-full bg-gray-300 dark:bg-gray-700"></div>

      {/* Render each driver */}
      {drivers.map(driver => (
        <div 
          key={driver.id} 
          className="absolute transition-all duration-3000 ease-linear" 
          style={{ 
            top: `${driver.location.lat}%`, 
            left: `${driver.location.lng}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <DriverCarIcon className={`w-8 h-8 drop-shadow-lg ${getStatusColor(driver.state)}`} />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-max bg-white/80 dark:bg-gray-900/80 px-2 py-1 rounded-md text-xs font-semibold shadow-md">
            {driver.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMap;