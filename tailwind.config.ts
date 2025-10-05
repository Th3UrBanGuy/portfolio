import type {Config} from 'tailwindcss';

function plugin({addUtilities, addVariant}: {addUtilities: any, addVariant: any}) {
  addUtilities({
    '.backface-hidden': {
      'backface-visibility': 'hidden',
    },
    '.bg-grid-cyan-500': {
       backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'rgb(107 114 128 / 0.1)\'%3e%3cpath d=\'M0 .5H31.5V32\'/%3e%3c/svg%3e")',
    },
  });
}

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Merriweather', 'serif'],
        headline: ['Merriweather', 'serif'],
        handwriting: ['Kalam', 'cursive'],
        code: ['monospace'],
        mono: ['"SF Mono"', '"Fira Code"', '"Fira Mono"', '"Roboto Mono"', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        page: {
          background: 'hsl(var(--page-background))',
          foreground: 'hsl(var(--page-foreground))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 15px 0 rgb(0 0 0 / 0.5)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'flip-out-next': {
          '0%': { transform: 'rotateY(0deg) translateZ(0)' },
          '20%': { transform: 'rotateY(0) translateZ(20px)' },
          '100%': { transform: 'rotateY(-180deg) translateZ(0)' },
        },
        'flip-in-next': {
            '0%': { transform: 'rotateY(180deg) translateZ(0)' },
            '80%': { transform: 'rotateY(0) translateZ(20px)' },
            '100%': { transform: 'rotateY(0deg) translateZ(0)' },
        },
        'flip-out-prev': {
            '0%': { transform: 'rotateY(0deg) translateZ(0)' },
            '20%': { transform: 'rotateY(0) translateZ(20px)' },
            '100%': { transform: 'rotateY(180deg) translateZ(0)' },
        },
        'flip-in-prev': {
            '0%': { transform: 'rotateY(-180deg) translateZ(0)' },
            '80%': { transform: 'rotateY(0) translateZ(20px)' },
            '100%': { transform: 'rotateY(0deg) translateZ(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.8', boxShadow: '0 0 10px 4px hsl(var(--primary) / 0.7)' },
          '50%': { opacity: '1', boxShadow: '0 0 25px 10px hsl(var(--primary) / 0.9)' },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'flip-out-next': 'flip-out-next 0.6s ease-in-out forwards',
        'flip-in-next': 'flip-in-next 0.6s ease-in-out forwards',
        'flip-out-prev': 'flip-out-prev 0.6s ease-in-out forwards',
        'flip-in-prev': 'flip-in-prev 0.6s ease-in-out forwards',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'spin-reverse': 'spin-reverse 10s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), plugin],
} satisfies Config;
