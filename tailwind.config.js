module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
};
