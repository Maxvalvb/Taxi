
import React from 'react';

export const DoorOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M13 4h3a2 2 0 0 1 2 2v14"></path>
    <path d="M2 20h3"></path>
    <path d="M13 20h9"></path>
    <path d="M10 12v.01"></path>
    <path d="M13 4.00001L5 4.00001C3.89543 4.00001 3 4.89544 3 6.00001L3 20"></path>
  </svg>
);