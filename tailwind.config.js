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
        dark: {
          950: '#0e0f12', // deep base background
          900: '#141519', // main screen background
          850: '#1b1c22', // card & panel background
          800: '#23242c', // interactive elements & buttons
          750: '#2b2c36', // button hover
          700: '#343642', // borders
          600: '#464856', // subtle borders
          500: '#696b7b', // muted text
          400: '#8e90a0', // secondary text
          300: '#b8b9c6', // readable text
          200: '#d9dae3', // soft white text
          100: '#f1f2f7', // prominent headings
        }
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-5px)' },
          '40%, 80%': { transform: 'translateX(5px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        shake: 'shake 0.25s ease-in-out both',
        fadeIn: 'fadeIn 0.15s ease-out forwards',
      }
    },
  },
  plugins: [],
}
