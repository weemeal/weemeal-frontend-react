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
                primary: 'var(--primary-color)',
                'primary-hover': 'var(--primary-color-hover)',
                secondary: 'var(--secondary-color)',
                'secondary-hover': 'var(--secondary-color-hover)',
                error: 'var(--error-color)',
                'error-hover': 'var(--error-color-hover)',
                'text-dark': 'var(--text-color-dark)',
                'text-light': 'var(--text-color-light)',
                background: 'var(--background-color)',
                'background-white': 'var(--background-color-white)',
                'border-light': 'var(--border-color-light)',
            },
            boxShadow: {
                card: 'var(--box-shadow)',
                'card-hover': 'var(--box-shadow-hover)',
            },
            borderRadius: {
                card: 'var(--card-border-radius)',
            },
        },
    },
    plugins: [],
};

export default config;
