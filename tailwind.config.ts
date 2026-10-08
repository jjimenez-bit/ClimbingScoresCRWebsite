import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F8FAFC", // slate-50
          surface: "#FFFFFF",
          subtle: "#F1F5F9",  // slate-100
        },
        foreground: {
          DEFAULT: "#0F172A", // slate-900
          muted: "#475569",   // slate-600
          subtle: "#94A3B8",  // slate-400
        },
        border: {
          DEFAULT: "#E2E8F0", // slate-200
          strong: "#CBD5E1",  // slate-300
        },
        brand: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          DEFAULT: "#F97316", // Electric athletic orange
          600: "#EA580C",
          700: "#C2410C",
        },
        accent: {
          cyan: "#0284C7",    // Energetic cyan
          cyanLight: "#E0F2FE",
        },
      },
      borderRadius: {
        card: "0.75rem", // rounded-xl
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        hover: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
    },
  },
  plugins: [],
};

export default config;