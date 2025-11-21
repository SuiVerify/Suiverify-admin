import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          dark: '#5B21B6',
          light: '#BC9AF5',
        },
        secondary: {
          DEFAULT: '#14B8A6',
          dark: '#0D9488',
          light: '#5EEAD4',
        },
        'ghost-white': '#F8FAFC',
        'charcoal-text': '#212529',
        'light-gray': '#DEE2E6',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
