/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
  theme: {
      colors: {
        'background': '#eff3f4',
        'foreground': '#ecf3f3',
        'accent': '#e89152',
        'white': '#ecf3f3',
        'skincolor': '#ecb485',
        'orange': '#e89152',
        'brown': '#874815',
        'blue': '#8bafb4',
        'yellow': '#fda43e',
      },
      extend: {
        colors: {
          'brown': {
            0: '#874815',
            100: '#8a4d1b',
            200: '#8b5221',
            300: '#8b5627',
            400: '#8c5a2d',
            500: '#8d5e33',
            600: '#8e6239',
            700: '#8f6640',
            800: '#8f6a46',
            900: '#906e4c',
          },
        },
    },
  },
  plugins: [flowbite.plugin()],
};
