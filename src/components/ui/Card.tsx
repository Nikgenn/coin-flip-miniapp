'use client';

import { type ReactNode } from 'react';

// UX Decision: Card provides consistent container styling
// with subtle glass-morphism effect for depth

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className = '', noPadding = false }: CardProps) {
  return (
    <div
      className={`
        bg-gradient-to-b from-white/[0.08] to-white/[0.02]
        backdrop-blur-xl
        border border-white/[0.08]
        rounded-2xl
        shadow-2xl shadow-black/20
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Smaller stat card variant
export function StatCard({ 
  label, 
  value, 
  valueColor = 'text-white' 
}: { 
  label: string; 
  value: string | number; 
  valueColor?: string;
}) {
  return (
    <div className="text-center p-3 rounded-xl bg-white/[0.03]">
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
