'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

// UX Decision: Consistent button variants with proper touch targets (≥44px)
// and clear visual feedback for all states

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  children: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-blue-500 to-blue-600 
    hover:from-blue-600 hover:to-blue-700 
    active:from-blue-700 active:to-blue-800
    text-white font-semibold
    shadow-lg shadow-blue-500/25
    hover:shadow-xl hover:shadow-blue-500/30
    disabled:from-gray-600 disabled:to-gray-700 
    disabled:shadow-none disabled:cursor-not-allowed
  `,
  secondary: `
    bg-white/5 hover:bg-white/10 active:bg-white/15
    text-white font-medium
    border border-white/10 hover:border-white/20
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  ghost: `
    bg-transparent hover:bg-white/5 active:bg-white/10
    text-gray-400 hover:text-white
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm rounded-lg',
  md: 'h-11 px-5 text-base rounded-xl',  // 44px - touch friendly
  lg: 'h-14 px-6 text-lg rounded-xl',    // 56px - primary CTA
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, leftIcon, children, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2
          transition-all duration-200 ease-out
          transform active:scale-[0.98]
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {leftIcon}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Spinner component for loading states
function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
