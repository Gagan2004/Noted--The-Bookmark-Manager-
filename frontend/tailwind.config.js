/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1E1E2F',
        accent: '#8AB4F8',
        muted: '#A1A1AA',
        bg: '#121212',
      },
    },
  },
  plugins: [],
};
