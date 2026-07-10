import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#E5E5E5",
        background: "#F7F7F4",
        surface: "#FFFFFF",
        primary: "#014539",
        secondary: "#4FA8A0",
        accent: "#DAA751",
        text: "#1F2933",
        muted: "#6B7280",
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
        info: "#2563EB"
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "Arial", "sans-serif"]
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px"
      }
    }
  },
  plugins: [animate]
};

export default config;
