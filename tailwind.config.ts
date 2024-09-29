import type { Config } from 'tailwindcss'

/* Export, as the default, a JS object containing Tailwind configuration settings. (See: https://tailwindcss.com/docs/configuration) */
export default {
  /* Define the file paths where the compiler will look for Tailwind utility classes being used. */
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    /* Extends the default Tailwind theme settings. (See: https://tailwindcss.com/docs/theme#extending-the-default-theme) In this case the extended settings were generated when `npx create-remix@2` was run to create a new Remix app. */
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config
