/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0b0d17",
        mars: "#C1440E",
        holo: "#4fd1ff"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      backgroundImage: {
        "mars-sunset":
          "radial-gradient(circle at 0% 0%, rgba(255,210,128,0.4), transparent 55%), radial-gradient(circle at 100% 100%, rgba(255,140,180,0.5), #2b0b16)"
      },
      boxShadow: {
        "glass-soft": "0 18px 60px rgba(0,0,0,0.55)"
      }
    }
  },
  plugins: []
};


