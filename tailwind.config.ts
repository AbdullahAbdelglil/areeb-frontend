/** @type {import('tailwindcss').Config} */
module.exports = {  
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        areeb: {
          primary: '#297EFF',     
          dark: '#0A0A23',         
          light: '#FFFFFF',      
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
