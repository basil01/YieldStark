import { useEffect, useState } from 'react';

interface CheckmarkAnimationProps {
  show: boolean;
}

export const CheckmarkAnimation = ({ show }: CheckmarkAnimationProps) => {
  if (!show) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <svg 
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'block',
          strokeWidth: '2',
          stroke: '#7ac142',
          strokeMiterlimit: '10',
          margin: '10% auto',
          boxShadow: 'inset 0px 0px 0px',
          animation: 'fill 0.4s ease-in-out 0.4s forwards, scaleOne 0.3s ease-in-out 0.9s both',
          background: '#f8f8f8'
        }}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 52 52"
      >
        <circle 
          style={{
            strokeDasharray: '166',
            strokeDashoffset: '166',
            strokeWidth: '2',
            strokeMiterlimit: '10',
            stroke: '#7ac142',
            fill: 'none',
            animation: 'stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards'
          }}
          cx="26" 
          cy="26" 
          r="25" 
          fill="none" 
        />
        <path 
          style={{
            transformOrigin: '50% 50%',
            strokeDasharray: '48',
            strokeDashoffset: '48',
            stroke: '#7ac142',
            animation: 'stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards'
          }}
          fill="none" 
          d="M14.1 27.2l7.1 7.2 16.7-16.8" 
        />
      </svg>

      <style jsx global>{`
        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes scaleOne {
          0%, 100% {
            transform: none;
          }
          50% {
            transform: scale3d(1.1, 1.1, 1);
          }
        }

        @keyframes fill {
          100% {
            box-shadow: inset 0px 0px 0px 30px #f8f8f8;
          }
        }
      `}</style>
    </div>
  );
}; 