import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist Variable", "sans-serif"],
        serif: ["Instrument Serif", "serif"],
      },
      borderWidth: {
        '12': '12px',
      },
    },
  },
} satisfies Config;
