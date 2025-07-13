import React from 'react';
import { Driver, DriverState } from '../../types';
import StatCard from './StatCard';
import { CarIcon } from '../icons/CarIcon';
import { UserIcon } from '../icons/UserIcon';
import { ShieldIcon } from '../icons/ShieldIcon';

interface AdminDashboardProps {
  drivers: Driver[];
  activeTrip: any; // Simplified for now
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ drivers, activeTrip }) => {
  const onlineDrivers = drivers.filter(d => d.state !== DriverState.OFFLINE).length;
  const busyDrivers = drivers.filter(d => d.state === DriverState.TO_PICKUP || d.state === DriverState.TRIP_IN_PROGRESS).length;

  return (
    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-6 lg:p-8 flex justify-center pb-20 z-20">
      <div className="w-full max-w-4xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6 space-y-4">
        <div className="flex justify-between items-center">
             <div className="flex items-center space-x-3">
                 <ShieldIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold">Панель администратора</h2>
            </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            icon={<UserIcon className="w-8 h-8 text-green-500" />}
            label="Водителей онлайн"
            value={onlineDrivers.toString()}
          />
          <StatCard
            icon={<CarIcon className="w-8 h-8 text-purple-500" />}
            label="Активных поездок"
            value={busyDrivers.toString()}
          />
           <StatCard
            icon={<CarIcon className="w-8 h-8 text-gray-500" />}
            label="Всего водителей"
            value={drivers.length.toString()}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
