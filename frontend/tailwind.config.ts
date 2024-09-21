import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: "#171C28",
          800: "#1D2433",
          700: "#2F3B54",
          600: "#6679A4",
          500: "#8695B7",
          400: "#A2AABC",
          300: "#D7DCE2"
        },
        secondary: "#FFCC66",
        red: "#EF6B73",
        
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
};
export default config;
