/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: "#0B0F19",
        glasscard: "rgba(17, 24, 39, 0.75)",
        glassborder: "rgba(255, 255, 255, 0.08)",
        aqigood: "#10B981",
        aqisatisfactory: "#84CC16",
        aqimoderate: "#F59E0B",
        aqipoor: "#EF4444",
        aqiverypoor: "#A855F7",
        aqisevere: "#881337",
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
