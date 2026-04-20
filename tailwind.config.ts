import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b1727",
        mist: "#eef7f4",
        sea: "#0f766e",
        sand: "#f3efe5",
        coral: "#f97316"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(11, 23, 39, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
