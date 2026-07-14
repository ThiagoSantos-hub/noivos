/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './shared/**/*.{ts,tsx}',
    './mobile/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores base do design system
        primary: {
          dark: '#1E3A8A',
          DEFAULT: '#2563EB',
          light: '#EFF6FF',
        },
        success: {
          dark: '#16A34A',
          DEFAULT: '#22C55E',
        },
        warning: '#F59E0B',
        danger: '#EF4444',
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
        },
      },
      spacing: {
        // Grid base de 4px
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0,0,0,0.06)',
        'md': '0 4px 12px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
