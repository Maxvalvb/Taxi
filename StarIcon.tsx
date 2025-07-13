
import React from 'react';

interface StarIconProps extends React.SVGProps<SVGSVGElement> {
    filled?: boolean;
}

export const StarIcon: React.FC<StarIconProps> = ({ filled = false, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={`w-6 h-6 ${filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} ${props.className || ''}`}
    fill={filled ? 'currentColor' : 'none'}
    stroke={filled ? 'currentColor' : 'currentColor'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
