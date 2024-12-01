import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enable dark mode using the "class" strategy
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'light': '0 4px 6px rgba(0, 0, 0, 0.1)', // Default shadow for light mode
        'dark': '0 4px 6px rgba(0, 0, 0, 0.4)',  // Custom shadow for dark mode
        'dark-lg': '0 10px 15px rgba(0, 0, 0, 0.6)', // Stronger shadow for dark mode
      },
    },
  },
  plugins: [],
};

export default config;
