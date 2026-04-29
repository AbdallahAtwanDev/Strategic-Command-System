import React from 'react';

type BrandingSize = 'xs' | 'sm' | 'lg';

const sizeClasses: Record<BrandingSize, string> = {
  xs: 'scale-[0.38]',
  sm: 'scale-75',
  lg: 'scale-100',
};

export const Branding: React.FC<{ size?: BrandingSize }> = ({ size = 'lg' }) => (
  <div
    className={`items-start w-max ${sizeClasses[size]} ${size === 'xs' ? 'grid text-left' : 'flex flex-col'}`}
    style={size === 'xs' ? { flexFlow: 'row' } : undefined}
  >
    <h1
      className="flex items-center gap-3 m-0 text-3xl font-extrabold tracking-tight text-yellow-300 leading-none"
      style={{ fontFamily: 'Orbitron, sans-serif' }}
    >
      <span className="drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]">ABDALLAH ATWAN</span>
      <span className="text-[12px] font-black bg-red-600 text-white px-2 py-0.5 rounded-sm skew-x-[-10deg] border-l-4 border-red-800 shadow-lg">
        GOV
      </span>
    </h1>
    <p className="m-0 mt-1 text-[10px] font-semibold tracking-[0.4em] text-zinc-300 uppercase opacity-80 leading-none">
      Strategic Command System
    </p>
  </div>
);