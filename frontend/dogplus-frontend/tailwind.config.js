/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "purple-blue": {
          500: "#581EF5", // Button color
          600: "#5014f5", // Button hover color
          100: "#5016f0", // Focus ring color
        },
        "dark-grey": {
          900: "#1F2937", // Very dark grey for text
        },
        grey: {
          500: "#A0AEC0", // Mid-light grey, used for borders
          400: "#CBD5E0", // Light grey, used for input focus background
          200: "#EDF2F7", // Very light grey, used for input background
          600: "#4A5568", // Mid-dark grey, used for text
          700: "#2D3748", // Darker grey, used for link text
          900: "#171923", // Dark grey, used for paragraph text
        },
      },
    },
  },
  plugins: [],
};
