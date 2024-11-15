/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'custom-light-gray': 'rgb(249, 249, 249)',
      },
    },
  },
  plugins: [],
};