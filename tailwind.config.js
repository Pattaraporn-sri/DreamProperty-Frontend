/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: 
      {
        Calistoga : ["Calistoga", "serif"],
        DM: ["DM Serif Text", "serif"],
        Prompt: ["Prompt","serif"]
      }
    },
  },
  plugins: [
    // require('tailwind-scrollbar-hide')
  ],
};
