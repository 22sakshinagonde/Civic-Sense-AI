import React, { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackIcon = 'image',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-high text-primary/70 p-2 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="material-symbols-outlined text-[24px] text-secondary">{fallbackIcon}</span>
        <span className="text-[10px] font-medium mt-1 line-clamp-2 opacity-80">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
};
