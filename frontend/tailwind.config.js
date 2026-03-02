/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Core theme colors
        primary: 'var(--color-primary, #0f62fe)',
        'primary-dark': 'var(--color-primary-dark, #0043ce)',
        'primary-light': 'var(--color-primary-light, #4589ff)',
        secondary: 'var(--color-secondary, #009d9a)',
        accent: 'var(--color-accent, #8a3ffc)',
        'brand-dark': 'var(--color-foundation-dark, #161616)',
        'brand-darker': 'var(--color-gray-900, #0f0f0f)',

        // Semantic colors
        success: 'var(--color-success, #24a148)',
        warning: 'var(--color-warning, #f1c21b)',
        error: 'var(--color-error, #da1e28)',
        info: 'var(--color-info, #0043ce)',

        // Theme-aware surfaces (backgrounds)
        'th-bg': 'var(--bg-primary, #ffffff)',
        'th-bg-alt': 'var(--bg-secondary, #f4f4f4)',
        'th-bg-tert': 'var(--bg-tertiary, #e0e0e0)',
        'th-bg-inv': 'var(--bg-inverse, #161616)',
        'th-bg-accent': 'var(--bg-accent, #d0e2ff)',
        'th-card': 'var(--card-bg, #ffffff)',
        'th-nav': 'var(--nav-bg, #ffffff)',
        'th-input': 'var(--input-bg, #f4f4f4)',

        // Theme-aware text
        'th-text': 'var(--text-primary, #161616)',
        'th-text-2': 'var(--text-secondary, #525252)',
        'th-text-3': 'var(--text-muted, #8d8d8d)',
        'th-text-inv': 'var(--text-inverse, #ffffff)',
        'th-text-accent': 'var(--text-accent, #0f62fe)',

        // Theme-aware borders
        'th-border': 'var(--border-default, #e0e0e0)',
        'th-border-lt': 'var(--border-light, #f4f4f4)',
        'th-border-dk': 'var(--border-dark, #8d8d8d)',
        'th-border-pri': 'var(--border-primary, #0f62fe)',

        // Theme-aware buttons
        'th-btn': 'var(--button-primary-bg, #0f62fe)',
        'th-btn-hover': 'var(--button-primary-hover, #0043ce)',
        'th-btn-text': 'var(--button-primary-text, #ffffff)',
        'th-btn-sec': 'var(--button-secondary-bg, #393939)',
        'th-btn-sec-hover': 'var(--button-secondary-hover, #474747)',
        'th-btn-danger': 'var(--button-danger-bg, #da1e28)',

        // Legacy aliases
        'surface-dark': 'var(--bg-inverse, #161616)',
        'surface-primary': 'var(--bg-primary, #ffffff)',
        'surface-secondary': 'var(--bg-secondary, #f4f4f4)',
        'on-dark': 'var(--text-inverse, #ffffff)',
        gold: 'var(--color-accent, #E3B76B)',
        'saudi-green': 'var(--color-primary, #006C35)',
      },
      fontFamily: {
        sans: ['var(--font-primary)', 'IBM Plex Sans', 'Inter', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'IBM Plex Arabic', 'Noto Kufi Arabic', 'sans-serif'],
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius-md, 0.375rem)',
        sm: 'var(--radius-sm, 0.25rem)',
        md: 'var(--radius-md, 0.375rem)',
        lg: 'var(--radius-lg, 0.5rem)',
        xl: 'var(--radius-xl, 0.75rem)',
        '2xl': 'var(--radius-2xl, 1rem)',
      },
      boxShadow: {
        'th-sm': 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))',
        'th-md': 'var(--shadow-md, 0 4px 6px rgba(0,0,0,0.07))',
        'th-lg': 'var(--shadow-lg, 0 10px 15px rgba(0,0,0,0.1))',
      },
      zIndex: {
        dropdown: 'var(--z-dropdown, 1000)',
        sticky: 'var(--z-sticky, 1100)',
        overlay: 'var(--z-overlay, 1200)',
        modal: 'var(--z-modal, 1300)',
        popover: 'var(--z-popover, 1400)',
        tooltip: 'var(--z-tooltip, 1500)',
        toast: 'var(--z-toast, 1600)',
      },
    },
  },
  plugins: [],
};
