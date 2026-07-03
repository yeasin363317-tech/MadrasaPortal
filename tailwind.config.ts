import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // New Light Theme Colors
        "edu-green": {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#15803d",
          700: "#166534",
          800: "#14532d",
          900: "#052e16",
          DEFAULT: "#15803d",
        },
        "edu-gold": {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#d4af37",
          600: "#b45309",
          700: "#92400e",
          DEFAULT: "#d4af37",
        },
        "edu-slate": {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // Legacy (keep for admin panel compatibility)
        "islamic-green": {
          50: "#e8f5ee",
          100: "#c5e8d3",
          200: "#8fd2ad",
          300: "#57b885",
          400: "#2d9d64",
          500: "#0d4a2e",
          DEFAULT: "#0d4a2e",
        },
        "islamic-gold": {
          50: "#fdf8e8",
          100: "#f9edc2",
          200: "#f3d87d",
          300: "#ecc138",
          400: "#c9a227",
          500: "#a8841a",
          DEFAULT: "#c9a227",
        },
        "warm-white": "#f8f4e8",
        "madrasa-dark": "#071a0e",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        arabic: ["Amiri", "serif"],
        bangla: ["Hind Siliguri", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 2px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)",
        green: "0 4px 20px rgba(21,128,61,0.25)",
        gold: "0 4px 20px rgba(212,175,55,0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-green": "pulseGreen 2.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "bounce-soft": "bounceSoft 1.5s ease-in-out infinite",
        shimmer: "shimmer 1.8s linear infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideDown: { "0%": { opacity: "0", transform: "translateY(-20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        scaleIn: { "0%": { opacity: "0", transform: "scale(0.92)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        pulseGreen: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(21,128,61,0.35)" },
          "50%": { boxShadow: "0 0 0 10px rgba(21,128,61,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Legacy
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201,162,39,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(201,162,39,0)" },
        },
        slideInLeft: { "0%": { opacity: "0", transform: "translateX(-20px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
