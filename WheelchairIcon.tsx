
import React from 'react';

export const WheelchairIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <circle cx="6" cy="18" r="2"></circle>
    <path d="M8.5 18H18l-3.5-7.5-3.5 4-3-4-3 9"></path>
    <circle cx="17.5" cy="5.5" r="1.5"></circle>
    <path d="M2 13h6"></path>
  </svg>
);
