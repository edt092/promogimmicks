'use client';

import { useState, useEffect } from 'react';

export default function GoldenShimmerText() {
  const [shimmerPosition, setShimmerPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShimmerPosition((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative pt-4 pb-8 flex justify-center">
      {/* Efecto de brillo de fondo */}
      <div
        className="absolute inset-0 rounded-2xl opacity-40 blur-2xl"
        style={{
          background: `radial-gradient(ellipse at ${shimmerPosition}% 50%, #FFD700 0%, transparent 60%)`,
        }}
      />

      <div className="relative text-center">
        <span
          className="text-6xl md:text-7xl lg:text-8xl font-black bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(90deg, #B8860B ${shimmerPosition - 40}%, #FFD700 ${shimmerPosition - 20}%, #FFFFFF ${shimmerPosition}%, #FFD700 ${shimmerPosition + 20}%, #B8860B ${shimmerPosition + 40}%)`,
            backgroundSize: '200% 100%',
            textShadow: '0 0 40px rgba(255, 215, 0, 0.3)',
          }}
        >
          100%
        </span>
        <p
          className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(90deg, #CD853F ${shimmerPosition - 50}%, #FFD700 ${shimmerPosition - 15}%, #FFFFFF ${shimmerPosition}%, #FFD700 ${shimmerPosition + 15}%, #CD853F ${shimmerPosition + 50}%)`,
            backgroundSize: '200% 100%',
          }}
        >
          Personalizable
        </p>
      </div>
    </div>
  );
}
