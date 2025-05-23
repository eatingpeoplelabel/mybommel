/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      rotate: {
        '0': '0deg',
        '6': '6deg',
        '12': '12deg',
        '18': '18deg',
        '24': '24deg',
        '30': '30deg',
        '-6': '-6deg',
        '-12': '-12deg',
        '-18': '-18deg',
        '-24': '-24deg',
        '-30': '-30deg',
      },
      backgroundImage: {
        memphis: "url('/memphis-background.png')",
        zodiac: "url('/zodiac-bg.png')",
        howToBommel: "url('/how-to-bommel-bg.png')",
        godbg: "url('/god-bg.png')",
        register: "url('/register-bg.png')",
      },
      keyframes: {
        magicpulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        fadeRipple: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '50%': { opacity: '0.8', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.5)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        orbit: {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
        glitter: {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '0.35' },
        },
        wobble: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-2px) rotate(-1deg)' },
          '50%': { transform: 'translateY(1px) rotate(1.5deg)' },
          '75%': { transform: 'translateY(-1px) rotate(-1deg)' },
        },
        'bounce-real-a': {
          '0%': {
            transform: 'translateY(0) scale(1) rotate(0deg)',
            animationTimingFunction: 'ease-in',
          },
          '30%': {
            transform: 'translateY(calc(100vh - 20rem)) scale(1) rotate(0deg)',
            animationTimingFunction: 'ease-out',
          },
          '40%': {
            transform: 'translateY(calc(100vh - 20rem)) scale(0.9) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(0) scale(1) rotate(12deg)',
            animationTimingFunction: 'ease-in',
          },
          '60%': {
            transform: 'translateY(0) scale(1) rotate(-6deg)',
          },
          '100%': {
            transform: 'translateY(0) scale(1) rotate(0deg)',
            animationTimingFunction: 'ease-out',
          },
        },
        'bounce-real-b': {
          '0%': {
            transform: 'translateY(0) scale(1) rotate(0deg)',
            animationTimingFunction: 'ease-in',
          },
          '30%': {
            transform: 'translateY(calc(100vh - 20rem)) scale(1) rotate(0deg)',
            animationTimingFunction: 'ease-out',
          },
          '40%': {
            transform: 'translateY(calc(100vh - 20rem)) scale(0.9) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(0) scale(1) rotate(-12deg)',
            animationTimingFunction: 'ease-in',
          },
          '60%': {
            transform: 'translateY(0) scale(1) rotate(6deg)',
          },
          '100%': {
            transform: 'translateY(0) scale(1) rotate(0deg)',
            animationTimingFunction: 'ease-out',
          },
        },
        snitch: {
          '0%':   { transform: 'translate(0, 0)' },
          '20%':  { transform: 'translate(-20px, -10px) rotate(-10deg)' },
          '40%':  { transform: 'translate(10px, -20px) rotate(10deg)' },
          '60%':  { transform: 'translate(20px, 10px) rotate(-5deg)' },
          '80%':  { transform: 'translate(-10px, 20px) rotate(5deg)' },
          '100%': { transform: 'translate(0, 0) rotate(0)' },
        },
      },
      animation: {
        magicpulse: 'magicpulse 4s ease-in-out infinite',
        fadeRipple: 'fadeRipple 3s ease-in-out forwards',
        'fade-in': 'fadeIn 2s ease-in-out forwards',
        orbit: 'orbit 10s linear infinite',
        'wiggle-slow': 'wiggle 4s ease-in-out infinite',
        glitter: 'glitter 1.8s ease-in-out infinite',
        'bounce-real-a': 'bounce-real-a 3.2s infinite',
        'bounce-real-b': 'bounce-real-b 3.4s infinite',
        wobble: 'wobble 3.5s ease-in-out infinite',
        snitch: 'snitch 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
