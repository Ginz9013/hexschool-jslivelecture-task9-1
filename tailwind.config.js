module.exports = {
  purge: {
    enabled: true,
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
      },
      gridTemplateColumns: {
        '27': 'repeat(27, minmax(0, 1fr))'
      }
    },
    maxWidth: {
      'screen-lg': '1110px',
      '350': '350px'
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
