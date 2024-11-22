import tailwindScrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          scrollbarTrack: '#f1f1f1',
          scrollbarThumb: '#888',
        },
        dark: {
          scrollbarTrack: '#2d3748',
          scrollbarThumb: '#4a5568',
        },
      },
    },
  },
  plugins: [
    tailwindScrollbar({ nocompatible: true }),
  ],
  darkMode: "class", // Enables class-based dark mode
};

export default config;
