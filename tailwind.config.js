/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{html,js}", "./js/**/*.{js}", "./*.{html}"],
  theme: {
    extend: {
      colors: {
        'obt-blue': '#294490',
        'obt-orange': '#F97316',
      },
      fontFamily: {
        sans: ['Prompt', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
