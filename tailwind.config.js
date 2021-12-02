module.exports = {
  purge: {
    enabled: false,
    content: ['./dist/**/*.html'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primaryColor: {
          light2: '#DACBFF',
          light1: '#9D7FEA',
          DEFAULT: '#6A33F8',
          dark1: '#5434A7',
          dark2: '#301E5F'
        }
      },
      spacing: {
        '360px': '360px'
      }
    },
    maxWidth: {
      'screen-lg': '1110px',
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
