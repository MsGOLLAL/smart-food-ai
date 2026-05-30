/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          bg: "#FAFDFB",
          card: "rgba(255, 255, 255, 0.75)",
          border: "rgba(16, 185, 129, 0.08)",
          sage: "#065F46",
          emerald: "#059669",
          mint: "#10B981",
          teal: "#0D9488",
          rose: "#EF4444",
          orange: "#F97316",
        }
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(16, 185, 129, 0.04)',
        'soft-card': '0 10px 30px -10px rgba(0, 0, 0, 0.04)',
        'neon-green-glow': '0 0 15px rgba(16, 185, 129, 0.1)',
        'neon-cyan-glow': '0 0 15px rgba(6, 182, 212, 0.1)',
        'neon-orange-glow': '0 0 15px rgba(249, 115, 22, 0.1)',
        'neon-rose-glow': '0 0 15px rgba(239, 68, 68, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
