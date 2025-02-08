module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)'],
        lora: ['var(--font-lora)'],
        spectral: ['var(--font-spectral)'],
        'geist-sans': ['var(--font-geist-sans)'],
        'geist-mono': ['var(--font-geist-mono)'],
        'roboto-condensed': ['var(--font-roboto-condensed)'],
        'playfair-display': ['var(--font-playfair-display)'],
      },

      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#4CB6D4",
        primaryLight: "#C0C0C0",
        secondary: "#616A76",
      },
    },
  },
  plugins: [],
};
