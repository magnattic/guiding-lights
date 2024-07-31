/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        13: 'repeat(13, minmax(0, 1fr))',
      },
      scale: {
        130: '1.40',
      },
    },
  },
  plugins: [],
};
