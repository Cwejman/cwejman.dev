/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        strong: 'var(--strong)',
        light: 'var(--light)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        foreground: 'var(--foreground)',
        'foreground-relaxed': 'var(--foreground-relaxed)',
      },
      fontFamily: {
        sans: ['dm-sans'],
      },
      fontSize: {
        xl: '4rem',
        l: '2.5rem',
        m: '1.55rem',
        s: '1.1rem',
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
