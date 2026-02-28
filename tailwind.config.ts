import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#000000",
          hover: "#333333",
        },
        "brand-accent": "#FF5722",
        "brand-dark": "#000000",
        "surface-light": "#F3F4F6",
        background: "#FFFFFF",
        "background-secondary": "#FAFAFA",
        text: {
          DEFAULT: "#000000",
          secondary: "#525252",
          inverted: "#FFFFFF",
          "inverted-secondary": "#D4D4D4",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "bujo-dot": "radial-gradient(#e5e7eb 1px, transparent 1px)",
      },
      backgroundSize: {
        "bujo-dot": "20px 20px",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
