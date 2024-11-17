/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        high: 'var(--high)',
        low: 'var(--low)',
        strong: 'var(--strong)',
        'muted-half': 'var(--muted-half)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        card: 'var(--card)',
        'card-relaxed': 'var(--card-relaxed)',
        'card-border': 'var(--card-border)',
        foreground: 'var(--foreground)',
        'foreground-relaxed': 'var(--foreground-relaxed)',
      },
      fontFamily: {
        sans: ['dm-sans'],
      },
      fontSize: {
        xl: '4rem',
        l: '2.3rem',
        m: '1.55rem',
        sm: '1.35rem',
        s: '1.05rem',
        xs: '0.95rem',
      },
      lineHeight: {
        snug: '1.35',
        normal: '1.6',
        relaxed: '1.75',
      },
      fontWeight: {
        normal: '300',
        bold: '600',
      },
    },
  },
  plugins: [],
};
