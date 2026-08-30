import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        theme: {
          bg: "var(--theme-bg)",
          card: "var(--theme-card)",
          subtle: "var(--theme-card-subtle)",
          sidebar: "var(--theme-sidebar)",
          text: "var(--theme-text)",
          muted: "var(--theme-text-muted)",
          border: "var(--theme-border)",
          accent: "var(--theme-accent)",
          accentbg: "var(--theme-accent-bg)",
          header: "var(--theme-header-bg)",
        },
        warmbg: "var(--theme-bg)",
        warmtext: "var(--theme-text)",
        warmborder: "var(--theme-border)",
        darkbg: "var(--theme-bg)",
        darktext: "var(--theme-text)",
      },
    },
  },
  plugins: [],
};
export default config;
