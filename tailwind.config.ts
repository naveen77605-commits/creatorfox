import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* Brand — single source of truth. Swap hexes here to re-skin the site. */
        gold: {
          DEFAULT: "#F3BC09",
          hot: "#FFD94A",
          deep: "#9A7100",
        },
        carbon: "#0B0A07", // warm near-black, tinted toward the brand
        coal: "#161309", // elevated dark surface
        bone: "#F7F4EC", // warm off-white for light sections
        mist: "#EDE9DD", // light borders / muted light surface
        smoke: {
          DEFAULT: "#8A8578", // muted text on dark
          dark: "#6B675C", // muted text on light
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Clash Display", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "Satoshi", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8.5vw, 8.25rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.5rem, 6vw, 5.5rem)", { lineHeight: "1", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(2rem, 4.5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-sm": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
      },
      maxWidth: {
        wrap: "90rem",
      },
      transitionTimingFunction: {
        swift: "cubic-bezier(0.65, 0.05, 0, 1)",
        out: "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
