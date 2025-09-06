/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#ff7c45",
        secondary: "#f34363",
        chomp: {
          orange: "#ff7c45",
          pink: "#f34363",
          gradient: "linear-gradient(135deg, #ff7c45 0%, #f34363 100%)",
        },
        white: {
          DEFAULT: "#ffffff",
          100: "#fafafa",
          200: "#f8f9fa",
        },
        gray: {
          100: "#6c757d",
          200: "#495057",
          300: "#343a40",
        },
        dark: {
          100: "#212529",
          200: "#1a1d20",
        },
        error: "#dc3545",
        success: "#28a745",
      },
      fontFamily: {
        quicksand: ["Quicksand-Regular", "sans-serif"],
        "quicksand-bold": ["Quicksand-Bold", "sans-serif"],
        "quicksand-semibold": ["Quicksand-SemiBold", "sans-serif"],
        "quicksand-light": ["Quicksand-Light", "sans-serif"],
        "quicksand-medium": ["Quicksand-Medium", "sans-serif"],
      },
    },
  },
  plugins: [],
};
