/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}","./public/*.html"],
  theme: {
    extend: {
      fontSize: {
        xs: '0.7rem',
        xm: '0.85rem',
        zs: '0px',
      },
      letterSpacing: {
        'confirm': '0.75rem',
        'reset': '0.25rem'
      },
      transitionProperty: {
        'width': 'width',
      }
    },
  },
  plugins: [],
}

