import React from 'react';

export const MastercardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 38 24"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-labelledby="pi-mastercard"
    {...props}
  >
    <title id="pi-mastercard">Mastercard</title>
    <g fill="none">
      <path
        d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
        fill="#212121"
      ></path>
      <circle fill="#EB001B" cx="15" cy="12" r="7"></circle>
      <circle fill="#F79E1B" cx="23" cy="12" r="7"></circle>
      <path
        d="M22 12c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"
        fill="#FF5F00"
      ></path>
    </g>
  </svg>
);
