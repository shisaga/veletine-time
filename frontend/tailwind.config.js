/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        border: "#FECDD3",
        input: "#FFE4E6",
        ring: "#E11D48",
        background: "#FFF1F2",
        foreground: "#4C0519",
        primary: {
          DEFAULT: "#E11D48",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFE4E6",
          foreground: "#881337",
        },
        accent: {
          DEFAULT: "#F43F5E",
          foreground: "#4C0519",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#4C0519",
        },
        muted: {
          DEFAULT: "#FFE4E6",
          foreground: "#881337",
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Outfit', 'sans-serif'],
        accent: ['Caveat', 'cursive'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(225, 29, 72, 0.1)',
        floating: '0 10px 40px -10px rgba(225, 29, 72, 0.2)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
