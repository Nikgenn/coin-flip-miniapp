'use client';

import { useEffect, useState } from 'react';

// UX Decision: Lightweight CSS-only confetti for celebration moments
// No external dependencies, performant, auto-cleanup

interface ConfettiProps {
  isActive: boolean;
  duration?: number; // ms
}

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  rotation: number;
}

const COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96E6A1', // Green
  '#DDA0DD', // Plum
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
];

export function Confetti({ isActive, duration = 3000 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      // Generate particles
      const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // % position
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 500, // stagger start
        size: Math.random() * 8 + 6, // 6-14px
        rotation: Math.random() * 360,
      }));
      
      setParticles(newParticles);

      // Cleanup after animation
      const timer = setTimeout(() => {
        setParticles([]);
      }, duration + 500);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration]);

  if (particles.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute top-0 animate-confetti"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}ms`,
            animationDuration: `${duration}ms`,
          }}
        >
          <div
            style={{
              width: particle.size,
              height: particle.size * 0.6,
              backgroundColor: particle.color,
              transform: `rotate(${particle.rotation}deg)`,
              borderRadius: '2px',
            }}
          />
        </div>
      ))}
    </div>
  );
}
