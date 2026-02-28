import type {Config} from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--primary-color)',
                    hover: 'var(--primary-color-hover)',
                    light: 'var(--primary-color-light)',
                    subtle: 'var(--primary-color-subtle)',
                },
                secondary: {
                    DEFAULT: 'var(--secondary-color)',
                    hover: 'var(--secondary-color-hover)',
                    light: 'var(--secondary-color-light)',
                    subtle: 'var(--secondary-color-subtle)',
                },
                error: {
                    DEFAULT: 'var(--error-color)',
                    hover: 'var(--error-color-hover)',
                },
                success: 'var(--success-color)',
                warning: 'var(--warning-color)',
                'text-dark': 'var(--text-color-dark)',
                'text-muted': 'var(--text-color-muted)',
                'text-light': 'var(--text-color-light)',
                background: {
                    DEFAULT: 'var(--background-color)',
                    white: 'var(--background-color-white)',
                    subtle: 'var(--background-color-subtle)',
                },
                'border-light': 'var(--border-color-light)',
                'border-medium': 'var(--border-color-medium)',
            },
            boxShadow: {
                'card': 'var(--box-shadow)',
                'card-hover': 'var(--box-shadow-hover)',
                'card-sm': 'var(--box-shadow-sm)',
                'card-lg': 'var(--box-shadow-lg)',
            },
            borderRadius: {
                'card': 'var(--card-border-radius)',
                'button': 'var(--button-border-radius)',
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 200ms ease-out',
                'slide-up': 'slideUp 200ms ease-out',
                'slide-in-right': 'slideInRight 200ms ease-out',
                'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};

export default config;
