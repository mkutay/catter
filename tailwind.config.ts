import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rosewater: "hsl(var(--rosewater))",
        flamingo: "hsl(var(--flamingo))",
        pink: "hsl(var(--pink))",
        mauve: "hsl(var(--mauve))",
        red: "hsl(var(--red))",
        maroon: "hsl(var(--maroon))",
        peach: "hsl(var(--peach))",
        yellow: "hsl(var(--yellow))",
        green: "hsl(var(--green))",
        teal: "hsl(var(--teal))",
        sky: "hsl(var(--sky))",
        sapphire: "hsl(var(--sapphire))",
        blue: "hsl(var(--blue))",
        lavender: "hsl(var(--lavender))",
        text: "hsl(var(--text))",
        "subtext-1": "hsl(var(--subtext-1))",
        "subtext-0": "hsl(var(--subtext-0))",
        "overlay-2": "hsl(var(--overlay-2))",
        "overlay-1": "hsl(var(--overlay-1))",
        "overlay-0": "hsl(var(--overlay-0))",
        "surface-2": "hsl(var(--surface-2))",
        "surface-1": "hsl(var(--surface-1))",
        "surface-0": "hsl(var(--surface-0))",
        base: "hsl(var(--base))",
        mantle: "hsl(var(--mantle))",
        crust: "hsl(var(--crust))",

        border: "hsl(var(--overlay-0))",
        input: "hsl(var(--overlay-0))",
        ring: "hsl(var(--mauve))",
        background: "hsl(var(--base))",
        "background-dark": "hsl(var(--crust))",
        foreground: "hsl(var(--text))",
        description: "hsl(var(--subtext-0))",
        link: "hsl(var(--blue))",
        primary: {
          DEFAULT: "hsl(var(--text))",
          foreground: "hsl(var(--base))",
        },
        secondary: {
          DEFAULT: "hsl(var(--mauve))",
          foreground: "hsl(var(--base))",
        },
        destructive: {
          DEFAULT: "hsl(var(--red))",
          foreground: "hsl(var(--base))",
        },
        muted: {
          DEFAULT: "hsl(var(--surface-0))",
          foreground: "hsl(var(--text))",
        },
        accent: {
          DEFAULT: "hsl(var(--mauve))",
          foreground: "hsl(var(--base))",
        },
        popover: {
          DEFAULT: "hsl(var(--mantle))",
          foreground: "hsl(var(--text))",
        },
        card: {
          DEFAULT: "hsl(var(--mantle))",
          foreground: "hsl(var(--text))",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            'blockquote p:first-of-type::before': false,
            'blockquote p:first-of-type::after': false,
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
