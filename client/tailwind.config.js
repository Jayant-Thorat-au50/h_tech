/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#F5F5F7',
          text: '#1D1D1F',
          secondary: '#86868B',
          blue: '#0071E3',
          blueHover: '#0077ED',
          dark: '#000000',
          darkCard: '#121214',
          border: 'rgba(0, 0, 0, 0.08)',
        },
        htech: {
          navy: '#1D1D1F',
          red: '#E11D48',
          blue: '#2F7BEA',
          green: '#1FA34A',
          pink: '#E0245E',
          orange: '#F28C0F',
          purple: '#6B3FD4',
          teal: '#0E9AA7',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Plus Jakarta Sans"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        mono: ['"SF Mono"', '"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glass: '0 4px 24px rgba(0, 0, 0, 0.04)',
        'glass-lg': '0 18px 42px rgba(0, 0, 0, 0.08)',
        'apple-card': '2px 4px 16px rgba(0, 0, 0, 0.05)',
        'apple-hover': '2px 12px 32px rgba(0, 0, 0, 0.10)',
        glow: '0 0 40px -8px rgba(0, 113, 227, 0.35)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        ticker: 'ticker 24s linear infinite',
      },
    },
  },
  plugins: [],
};
