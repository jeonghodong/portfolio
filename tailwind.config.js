/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: { min: '0px', max: '1079px' },
      lg: { min: '1080px', max: '1900px' },
    },

    // screens: {
    //   sm: { min: '390px', max: '819px' },
    //   md: { min: '820px', max: '1023px' },
    //   lg: { min: '1080px' },
    // },

    fontFamily: {
      NotoSansKR: ['NotoSansKR'],
    },

    extend: {},
  },
  plugins: [],
};
