/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bodywise: {
          darkest: '#060B0E',
          darker: '#0A1217',
          card: '#0F1A22',
          cardHover: '#14232E',
          cardBorder: '#1A2F3D',
          muted: '#8A9BA8',
          teal: {
            DEFAULT: '#00C2A8',
            hover: '#00E2C5',
            dark: '#009480',
            glow: '#00C2A840',
            light: '#61F4DE',
            bg: 'rgba(0, 194, 168, 0.08)'
          },
          cyan: '#06B6D4',
          emerald: '#10B981',
          coral: '#FF6B6B',
          amber: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'teal-glow': '0 0 25px -3px rgba(0, 194, 168, 0.35)',
        'teal-glow-lg': '0 0 45px -5px rgba(0, 194, 168, 0.45)',
        'danger-glow': '0 0 25px -3px rgba(239, 68, 68, 0.35)',
        'amber-glow': '0 0 25px -3px rgba(245, 158, 11, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

