import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "222.2 84% 4.9%",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "210 40% 98%",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "222.2 47.4% 11.2%",
        },
        destructive: {
          DEFAULT: "0 84.2% 60.2%",
          foreground: "210 40% 98%",
        },
        muted: {
          DEFAULT: "210 40% 96.1%",
          foreground: "215.4 16.3% 46.9%",
        },
        accent: {
          DEFAULT: "210 40% 96.1%",
          foreground: "222.2 47.4% 11.2%",
        },
        popover: {
          DEFAULT: "0 0% 100%",
          foreground: "222.2 84% 4.9%",
        },
        card: {
          DEFAULT: "0 0% 100%",
          foreground: "222.2 84% 4.9%",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
