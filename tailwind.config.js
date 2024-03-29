/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./public/**/*.{html,js,css}",
  "./src/**/*.{html,js}",
  "./src/views/**/*.{handlebars, hbs}" // Add your Handlebars file paths
],
  
  theme: {
    colors: {
      'blue': '#1fb6ff',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
      'gray-font': "#f8f8f8",
      'dark-background': "#515151"
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      title: {
        'h2': 'text-xl text-gray-light text-center mt-2',
      } 
    }
  },
}