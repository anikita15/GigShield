/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#020617',
          800: '#0f172a',
        },
        emerald: {
          DEFAULT: '#10b981',
          soft: 'rgba(16, 185, 129, 0.1)',
        },
        danger: {
          DEFAULT: '#dc2626',
          dark: '#991b1b',
        },
        neutral: {
          page: '#f8fafc',
          card: '#ffffff',
        }
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(to bottom right, #020617, #0f172a)',
        'red-gradient': 'linear-gradient(to bottom right, #dc2626, #991b1b)',
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
