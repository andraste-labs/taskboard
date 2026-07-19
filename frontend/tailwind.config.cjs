/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'color-primary': '#4f46e5',
        'color-primary-hover': '#4338ca',
        'color-todo': '#f59e0b',
        'color-progress': '#3b82f6',
        'color-done': '#10b981',
        'color-danger': '#ef4444',
        'color-danger-hover': '#dc2626',
        'color-surface': '#ffffff',
        'color-bg': '#f3f4f6',
        'color-border': '#e5e7eb',
        'color-text': '#111827',
        'color-text-muted': '#6b7280',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      borderRadius: {
        card: '8px',
        modal: '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        modal: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};