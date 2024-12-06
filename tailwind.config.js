/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './src/**/*.{ts,tsx}',
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
    "./index.html",
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
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        display: ['Lexend', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(215, 25%, 27%)",
          50: "hsl(215, 25%, 97%)",
          100: "hsl(215, 25%, 90%)",
          200: "hsl(215, 25%, 80%)",
          300: "hsl(215, 25%, 70%)",
          400: "hsl(215, 25%, 60%)",
          500: "hsl(215, 25%, 50%)",
          600: "hsl(215, 25%, 40%)",
          700: "hsl(215, 25%, 30%)",
          800: "hsl(215, 25%, 20%)",
          900: "hsl(215, 25%, 10%)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(215, 15%, 40%)",
          50: "hsl(215, 15%, 97%)",
          100: "hsl(215, 15%, 90%)",
          200: "hsl(215, 15%, 80%)",
          300: "hsl(215, 15%, 70%)",
          400: "hsl(215, 15%, 60%)",
          500: "hsl(215, 15%, 50%)",
          600: "hsl(215, 15%, 40%)",
          700: "hsl(215, 15%, 30%)",
          800: "hsl(215, 15%, 20%)",
          900: "hsl(215, 15%, 10%)",
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
        }
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
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}