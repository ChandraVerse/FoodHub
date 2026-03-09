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
        primary: {
          DEFAULT: '#FF6B6B',
          hover: '#FA5252',
          light: '#FF8787',
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          hover: '#45B7AF',
        },
        dark: {
          bg: '#121212',
          card: '#1E1E1E',
          text: '#E0E0E0',
          border: '#333333',
          hover: '#2C2C2C'
        },
        light: {
          bg: '#F9FAFB',
          card: '#FFFFFF',
          text: '#1F2937',
          border: '#E5E7EB',
          hover: '#F3F4F6'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
