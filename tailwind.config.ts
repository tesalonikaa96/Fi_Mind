import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // 👈 INI HARUS ADA dan tidak boleh salah tulis
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Pastikan semua folder yang berisi kode kamu terdaftar di sini
  ],
  // ...
};
export default config;