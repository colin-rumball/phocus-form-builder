import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

const config = {
  darkMode: ["class"],
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    fontSize: {
      headline: "3.3rem",
      heading: "2.5rem",
      xl: "1.5rem",
      lg: "1.1rem",
      default: "1rem",
    },
    lineHeight: {
      headline: "4.2rem",
      heading: "3.3rem",
      lg: "1.3rem",
      default: "1.8rem",
      tight: "1.1rem",
    },
    letterSpacing: {
      default: "0.04em",
    },
    fontFamily: {
      headline: "var(--font-family-headline)",
      body: "var(--font-body)",
    },
    container: {
      center: true,
      // screens: {
      //   lg: "1024px",
      //   "2xl": "1600px",
      // },
    },
    extend: {
      colors: {
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        DEFAULT: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "4rem",
        header: "var(--header-height)",
        main: "calc(100svh - var(--header-height))",
      },
      minHeight: {
        "half-hero": "calc(36rem - var(--header-height))",
        hero: "calc(56rem - var(--header-height))",
      },
      zIndex: {
        header: "39",
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
} satisfies Config;

export default withUt(config);
