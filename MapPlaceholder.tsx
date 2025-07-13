
import React, { useState, useEffect, useRef } from 'react';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { DriverCarIcon } from './icons/DriverCarIcon';
import { AppState } from '../types';

interface MapPlaceholderProps {
  appState: AppState;
  showIntermediateStop: boolean;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ appState, showIntermediateStop }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const tripPathRef = useRef<SVGPathElement>(null);
  const [driverTransform, setDriverTransform] = useState({ x: 0, y: 0, rotation: 0 });

  useEffect(() => {
    let animationFrameId: number;
    let path: SVGPathElement | null = null;
    let duration = 15000; // default 15s for arrival

    if (appState === AppState.CONFIRMED && pathRef.current) {
        path = pathRef.current;
    } else if (appState === AppState.TRIP_IN_PROGRESS && tripPathRef.current) {
        path = tripPathRef.current;
        duration = 25000; // 25s for the trip itself
    }

    if (path && path.getTotalLength() > 0) {
      const pathLength = path.getTotalLength();
      let startTime: number | null = null;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // For arrival path, driver moves from end to start
        // For trip path, driver moves from start to end
        const distance = appState === AppState.CONFIRMED 
            ? pathLength * (1 - progress) 
            : pathLength * progress;
        
        const point = path.getPointAtLength(distance);
        const nextPoint = path.getPointAtLength(appState === AppState.CONFIRMED ? Math.max(0, distance - 1) : Math.min(pathLength, distance + 1));
        
        const angle = Math.atan2(point.y - nextPoint.y, point.x - nextPoint.x) * (180 / Math.PI);
        const finalAngle = appState === AppState.CONFIRMED ? angle : angle + 180; // Flip car direction for trip

        setDriverTransform({ x: point.x, y: point.y, rotation: finalAngle });

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };
      
      animationFrameId = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(animationFrameId);
    } else {
      setDriverTransform({ x: 0, y: 0, rotation: 0 });
    }
  }, [appState]);

  return (
    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 overflow-hidden">
      {/* Roads */}
      <div className="absolute top-1/3 left-0 w-full h-8 bg-gray-300 dark:bg-gray-700 transform -skew-y-6"></div>
      <div className="absolute top-1/2 left-0 w-full h-12 bg-gray-300 dark:bg-gray-700"></div>
      <div className="absolute top-2/3 left-0 w-full h-6 bg-gray-300 dark:bg-gray-700 transform skew-y-3"></div>
      <div className="absolute left-1/4 top-0 w-10 h-full bg-gray-300 dark:bg-gray-700"></div>
      <div className="absolute left-3/4 top-0 w-8 h-full bg-gray-300 dark:bg-gray-700 transform skew-x-12"></div>
      <div className="absolute left-1/2 top-0 w-6 h-full bg-gray-300 dark:bg-gray-700"></div>
      
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path ref={pathRef} d="M 65 60 C 60 45, 40 45, 35 30" stroke="#9ca3af" strokeOpacity="0.5" fill="none" strokeWidth="0.5" strokeDasharray="1 1" />
        <path ref={tripPathRef} d="M 35 30 C 40 45, 60 45, 65 60" stroke="#3B82F6" strokeOpacity="0.8" fill="none" strokeWidth="0.5" strokeDasharray="1 1" />
      </svg>
      
      {/* Parks & Water */}
      <div className="absolute top-1/4 left-1/2 w-48 h-24 bg-emerald-200 dark:bg-emerald-800 rounded-lg transform -skew-x-12 opacity-80"></div>
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-cyan-200 dark:bg-cyan-800 rounded-full opacity-70"></div>

      {/* Animated Cars */}
      <div className="absolute w-4 h-2 bg-red-500 rounded-sm animate-drive-horizontal" style={{ top: '49%', animationDuration: '10s' }}></div>
      <div className="absolute w-4 h-2 bg-yellow-500 rounded-sm animate-drive-horizontal-reverse" style={{ top: '52%', animationDuration: '12s' }}></div>
      <div className="absolute w-2 h-4 bg-blue-500 rounded-sm animate-drive-vertical" style={{ left: '25.5%', animationDuration: '15s' }}></div>

      {/* Location Pins */}
      <div className="absolute" style={{ top: '30%', left: '35%', transform: 'translate(-50%, -100%)' }}>
        <LocationPinIcon className="w-10 h-10 text-green-500 drop-shadow-lg" />
        <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-green-600 dark:text-green-300 text-xs font-bold px-2 py-1 rounded-full shadow-md">Подача</span>
      </div>
      
      {showIntermediateStop && (
        <div className="absolute" style={{ top: '45%', left: '50%', transform: 'translate(-50%, -100%)' }}>
          <LocationPinIcon className="w-8 h-8 text-yellow-500 drop-shadow-lg" />
          <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-yellow-600 dark:text-yellow-300 text-xs font-bold px-2 py-1 rounded-full shadow-md">Остановка</span>
        </div>
      )}

      <div className="absolute" style={{ top: '60%', left: '65%', transform: 'translate(-50%, -100%)' }}>
        <LocationPinIcon className="w-10 h-10 text-red-500 drop-shadow-lg" />
        <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-red-600 dark:text-red-300 text-xs font-bold px-2 py-1 rounded-full shadow-md">Прибытие</span>
      </div>

      {/* Driver Car */}
      {(appState === AppState.CONFIRMED || appState === AppState.TRIP_IN_PROGRESS) && (
        <div className="absolute transition-all duration-100 ease-linear" style={{ top: `${driverTransform.y}%`, left: `${driverTransform.x}%`, transform: `translate(-50%, -50%) rotate(${driverTransform.rotation}deg)` }}>
            <DriverCarIcon className="w-8 h-8 text-blue-700 dark:text-blue-400 drop-shadow-lg" />
        </div>
      )}

      <style>{`
        @keyframes drive-horizontal { from { left: -5%; } to { left: 105%; } }
        @keyframes drive-horizontal-reverse { from { left: 105%; } to { left: -5%; } }
        @keyframes drive-vertical { from { top: -5%; } to { top: 105%; } }
      `}</style>
    </div>
  );
};

export default MapPlaceholder;
