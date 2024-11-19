/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#213A58', // Primary color
          light: '#0C6478',  // Light shade
          medium: '#15919B', // Medium shade
          accent: '#09D1C7', // Accent color
          secondary: '#46DFB1', // Secondary color
          tertiary: '#80EE98', // Tertiary color
        },
      },
    },
  },
  plugins: [],
}

