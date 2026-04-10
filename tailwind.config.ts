import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#f8fafc",
        panel: "#ffffff",
        panelSoft: "#f1f5f9",
        textMain: "#0f172a",
        textMuted: "#64748b",
        accent: "#2f81f7",
        accentGlow: "#47b8ff"
      },
      boxShadow: {
        panel: "0 10px 30px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
