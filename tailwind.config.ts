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
        gold: {
          DEFAULT: "#C9A96E",
          light: "#E8D5A8",
          dark: "#A8893F",
          50: "#FBF7EE",
        },
        ivory: "#FDFBF7",
        charcoal: "#1A1A1A",
        "warm-gray": {
          DEFAULT: "#8A8478",
          light: "#B8B0A4",
          dark: "#5C574E",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Noto Serif KR", "serif"],
        serif: ["Noto Serif KR", "Cormorant Garamond", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
