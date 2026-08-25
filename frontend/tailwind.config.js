/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                night: {
                    900: '#05060f',
                    800: '#0a0d1f',
                    700: '#11142b',
                    600: '#1a1e3d',
                },
                neon: {
                    blue: '#4f7cff',
                    cyan: '#22d3ee',
                    violet: '#8b5cf6',
                    pink: '#ec4899',
                },
            },
            fontFamily: {
                display: ['"Sora"', 'system-ui', 'sans-serif'],
            },
            animation: {
                'float-slow': 'float 9s ease-in-out infinite',
                'float-slower': 'float 14s ease-in-out infinite',
                'gradient-x': 'gradientX 12s ease infinite',
                'grid-pan': 'gridPan 20s linear infinite',
                'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
                'fade-up': 'fadeUp 0.6s ease both',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0) translateX(0) scale(1)' },
                    '50%': { transform: 'translateY(-40px) translateX(20px) scale(1.08)' },
                },
                gradientX: {
                    '0%, 100%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                },
                gridPan: {
                    '0%': { transform: 'perspective(600px) rotateX(60deg) translateY(0)' },
                    '100%': { transform: 'perspective(600px) rotateX(60deg) translateY(60px)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '0.6' },
                    '50%': { opacity: '1' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};