import type { Config } from "tailwindcss";
const config: Config={content:["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}"],theme:{extend:{colors:{gold:"#BB7C1D",charcoal:"#2B2B2B",ink:"#0A0A0A",paper:"#F7F7F5",muted:"#1E1E1E"},fontFamily:{sans:["Manrope","system-ui","sans-serif"]}}},plugins:[]};export default config;
