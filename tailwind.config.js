/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        breath: "breath 4s ease-in-out infinite",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100ch", // add required value here
          },
        },
      },
      colors: {
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
        base: {
          DEFAULT: "hsl(var(--base))",
          100: "hsl(var(--base-100))",
          200: "hsl(var(--base-200))",
          300: "hsl(var(--base-300))",
        },
        text: {
          DEFAULT: "hsl(var(--text))",
          50: "hsl(var(--text-50))",
          100: "hsl(var(--text-100))",
          200: "hsl(var(--text-200))",
          300: "hsl(var(--text-300))",
          400: "hsl(var(--text-400))",
          500: "hsl(var(--text-500))",
          600: "hsl(var(--text-600))",
          700: "hsl(var(--text-700))",
          800: "hsl(var(--text-800))",
          900: "hsl(var(--text-900))",
          950: "hsl(var(--text-950))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        breath: {
          "0%, 100%": { transform: "scale(0.8)" },
          "50%": { transform: "scale(1.1)" },
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          // TODO add more shades of colors
          primary: "#34d399",
          "primary-focus": "#047857",
          "primary-content": "#0f172a",

          secondary: "#f0abfc",
          "secondary-focus": "#a21caf",
          "secondary-content": "#0f172a",

          accent: "#fde047",
          // "accent-focus": "",
          // "accent-content": "",

          neutral: "#d1d5db",
          // "neutral-focus": "",
          // "neutral-content": "",

          "base-100": "#1e293b",
          "base-200": "#0f172a",
          "base-300": "#020617",
          "base-content": "#e2e8f0",

          info: "#7dd3fc",
          // "info-content": "",

          success: "#a3e635",
          // "success-content": "",

          warning: "#fdba74",
          // "warning-content": "",

          error: "#f87171",
          // "error-content": "",
        },
      },
    ],
  },
  plugins: [
    require("tailwindcss-animate"),
    require("daisyui"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
