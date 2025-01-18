/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      white: "#dbdbdb",
      gray: "#464646",
      black: "#242424",
      green: "#a5ffc9",
      blue: "#a5c9ff"
    },
    fontFamily: {
      'sans': ['Oswald',],
      'serif': ['ui-serif', 'Georgia',],
      'mono': ['"Open Sans"',],
    }
  },
  plugins: [],
}