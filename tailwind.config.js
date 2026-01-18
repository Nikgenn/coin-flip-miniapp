/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base брендовые цвета
        'base-blue': '#0052FF',
        'base-dark': '#0A0B0D',
        'base-gray': '#1E2025',
      },
      animation: {
        'flip': 'flip 1s ease-in-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(1800deg)' },
          '100%': { transform: 'rotateY(3600deg)' },
        },
      },
    },
  },
  plugins: [],
};
