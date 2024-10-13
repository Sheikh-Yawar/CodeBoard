/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tabbar: "#18181a",
        primary: "#36AEE5",
        secondary: "#3d404a",
        background: "#1e1e1e",
      },

      fontFamily: {
        Workbench: ["Workbench", "sans-serif"],
        Montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
