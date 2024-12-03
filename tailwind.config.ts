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
      colors:{
        sidebarBgDark: "#1f2937",
        sidebarBgLight: "#ffffff",
        sidebarTextDark: "#d1d5db",
        sidebarTextLight: "#1f2937",
        sidebarHoverDark: "#374151",
        sidebarHoverLight: "#f3f4f6",
        activeIndicatorDark: "#3b82f6",
        activeIndicatorLight: "#2563eb",
        overlayDark: "rgba(0, 0, 0, 0.7)",
        overlayLight: "rgba(0, 0, 0, 0.5)",
      },
      gradientColorStops: {
        pinkish: {
          from: "#ffe4e6",
          via: "#fbcfe8",
          to: "#ffffff",
        },
        bluish: {
          from: "#bfdbfe",
          via: "#93c5fd",
          to: "#e0f2fe",
        },
        greenish: {
          from: "#bbf7d0",
          via: "#86efac",
          to: "#e7f4ea",
        },
      },
    },
  },
  plugins: [],
};

export default config;
