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
        border: "#FFB5C0",
        input: "#FFF0F3",
        ring: "#FF6B9D",
        background: "#FFF5F7",
        foreground: "#2D1B4E",
        primary: {
          DEFAULT: "#FF6B9D",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFE5EC",
          foreground: "#8B3A62",
        },
        accent: {
          DEFAULT: "#FFC2D1",
          foreground: "#2D1B4E",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#2D1B4E",
        },
        muted: {
          DEFAULT: "#FFE5EC",
          foreground: "#8B3A62",
        },
      },
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
        accent: ['Caveat', 'cursive'],
      },
      borderRadius: {
        lg: '2rem',
        md: '1.5rem',
        sm: '1rem',
      },
      boxShadow: {
        soft: '0 8px 30px -2px rgba(255, 107, 157, 0.15)',
        floating: '0 15px 50px -10px rgba(255, 107, 157, 0.25)',
        cartoon: '4px 4px 0px rgba(45, 27, 78, 0.3)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
