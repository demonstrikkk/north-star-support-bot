/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'aurora': '0 0 0 1px rgba(99, 255, 210, 0.25), 0 0 30px rgba(99, 255, 210, 0.12), 0 0 56px rgba(164, 93, 255, 0.10)',
        'panel': '0 28px 80px rgba(0, 0, 0, 0.38)',
      },
    },
  },
  plugins: [],
}
