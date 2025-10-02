module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        en: ["Inter", "sans-serif"],
        km: ["Kantumruy Pro", "sans-serif"],
      },
      keyframes: {
        zoom: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' }, // zoom in
        },
      },
      animation: {
        'zoom-in-out': 'zoom 3s ease-in-out infinite',
      },
    },
  },
};
