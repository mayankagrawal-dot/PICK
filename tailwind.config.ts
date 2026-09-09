import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#f7f3ec",
        ink: "#14120f",
        lime: "#c8f169",
        pink: "#ff9ecb",
        lavender: "#cbb9f8",
        "lavender-deep": "#8f6ae4",
        cardline: "rgba(20,18,15,0.08)",
        muted: "#6b6660",
      },
      borderRadius: {
        card: "22px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(20,18,15,0.06)",
        btn: "0 6px 0 rgba(20,18,15,0.15)",
        "btn-active": "0 2px 0 rgba(20,18,15,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
