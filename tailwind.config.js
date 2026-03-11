/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter-tight': ['Inter Tight', 'Helvetica', 'sans-serif'],
        'roboto': ['Roboto', 'Helvetica', 'sans-serif'],
      },
      colors: {
        // You can extract custom colors here if needed. Right now, inline arbitrary values like #f0ebea are used.
      }
    },
  },
  plugins: [],
}
