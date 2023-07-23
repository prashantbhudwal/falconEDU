/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        breath: "breath 4s ease-in-out infinite",
      },
      keyframes: {
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
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
