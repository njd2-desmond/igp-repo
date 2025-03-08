/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  
  // Previously --> ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        warning: "#F44336", // Red for health risk alerts
        primary: "#4CAF50", // Green for primary buttons
        secondary: "#2196F3", // Ocean blue for links
        notification: "#FF9800", // Warm orange for alerts
        textGray: "#3E3E3E", // Charcoal gray for readability
      },
    },
  },
  plugins: [],
};


