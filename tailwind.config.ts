import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'media',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep Arabian Emerald / Islamic Teal from Hasiba Logo (#073b2f / #0a4d3c)
        brand: {
          50: '#f0f8f4',
          100: '#d9ede3',
          200: '#b5ddc9',
          300: '#87c4a8',
          400: '#4e9c7c',
          500: '#237a59',
          600: '#146548',
          700: '#0d533b',
          800: '#0a4d3c', // Core Logo Emerald
          900: '#073b2f', // Deepest Logo Teal
          950: '#03211a',
        },
        // Warm Arabian Desert Gold from Hasiba Logo (#c59b4c / #aa8036)
        gold: {
          50: '#fbf8ee',
          100: '#f6eed0',
          200: '#eddc9f',
          300: '#e2c66c',
          400: '#d4af37',
          500: '#c59b4c', // Logo Primary Gold Accent
          600: '#aa8036', // Logo Deep Gold
          700: '#8a6428',
          800: '#704f24',
          900: '#5c4122',
          950: '#34220e',
        },
        // Warm surface neutrals
        surface: {
          50: '#fbfbf8',
          100: '#f5f5f0',
          200: '#eaeae2',
          300: '#dcdcd0',
          800: '#15241d',
          900: '#0c1c15',
          950: '#07150f',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
};
export default config;
