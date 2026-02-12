'use client';

import { type ReactNode } from 'react';

// UX Decision: Card provides consistent container styling
// with subtle glass-morphism effect for depth
// Supports light and dark themes via CSS variables

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className = '', noPadding = false }: CardProps) {
  return (
    <div
      className={`
        card-container
        backdrop-blur-xl
        rounded-2xl
        shadow-2xl
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
  valueColor = '' 
}: { 
  label: string; 
  value: string | number; 
  valueColor?: string;
}) {
  return (
    <div className="text-center p-3 rounded-xl stat-card">
      <p className={`text-2xl font-bold ${valueColor || 'text-inherit'}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
