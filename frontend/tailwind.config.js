/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Core theme colors
        primary: 'var(--color-primary, #2454E6)',
        'primary-dark': 'var(--color-primary-dark, #1f49c7)',
        'primary-light': 'var(--color-primary-light, #2f6df3)',
        secondary: 'var(--color-secondary, #009d9a)',
        accent: 'var(--color-accent, #F4B223)',
        'brand-dark': 'var(--color-foundation-dark, #061224)',
        'brand-darker': 'var(--color-gray-900, #061224)',

        // Page-level dark background
        'page-dark': 'var(--color-page-dark, #0B1220)',

        // Gold accent system
        'gold-accent': '#F4B223',
        'gold-soft': '#FFF1CC',
        'section-gray': '#F6F7FB',
        'navy-footer': '#061224',

        // Semantic colors
        success: 'var(--color-success, #24a148)',
        warning: 'var(--color-warning, #f1c21b)',
        error: 'var(--color-error, #da1e28)',
        info: 'var(--color-info, #0043ce)',

        // Theme-aware surfaces (backgrounds)
        'th-bg': 'var(--bg-primary, #ffffff)',
        'th-bg-alt': 'var(--bg-secondary, #F6F7FB)',
        'th-bg-tert': 'var(--bg-tertiary, #e0e0e0)',
        'th-bg-inv': 'var(--bg-inverse, #061224)',
        'th-bg-accent': 'var(--bg-accent, #FFF1CC)',
        'th-card': 'var(--card-bg, #ffffff)',
        'th-nav': 'var(--nav-bg, #ffffff)',
        'th-input': 'var(--input-bg, #f4f4f4)',

        // Theme-aware text
        'th-text': 'var(--text-primary, #1D2433)',
        'th-text-2': 'var(--text-secondary, #525252)',
        'th-text-3': 'var(--text-muted, #7A8090)',
        'th-text-inv': 'var(--text-inverse, #ffffff)',
        'th-text-accent': 'var(--text-accent, #2454E6)',

        // Theme-aware borders
        'th-border': 'var(--border-default, #e0e0e0)',
        'th-border-lt': 'var(--border-light, #f4f4f4)',
        'th-border-dk': 'var(--border-dark, #8d8d8d)',
        'th-border-pri': 'var(--border-primary, #2454E6)',

        // Theme-aware buttons
        'th-btn': 'var(--button-primary-bg, #F4B223)',
        'th-btn-hover': 'var(--button-primary-hover, #d99e1f)',
        'th-btn-text': 'var(--button-primary-text, #1D2433)',
        'th-btn-sec': 'var(--button-secondary-bg, #393939)',
        'th-btn-sec-hover': 'var(--button-secondary-hover, #474747)',
        'th-btn-danger': 'var(--button-danger-bg, #da1e28)',

        // Legacy aliases
        'surface-dark': 'var(--bg-inverse, #061224)',
        'surface-primary': 'var(--bg-primary, #ffffff)',
        'surface-secondary': 'var(--bg-secondary, #F6F7FB)',
        'on-dark': 'var(--text-inverse, #ffffff)',
        gold: 'var(--color-accent, #F4B223)',
        'saudi-green': 'var(--color-primary, #006C35)',

        // AGRC-OS Surface tokens
        'surface': 'var(--surface, #ffffff)',
        'surface-ice': 'var(--surface-ice, #f2f4f8)',
        'surface-sunken': 'var(--surface-sunken, #f4f4f4)',
        'surface-elevated': 'var(--surface-elevated, #ffffff)',
        'surface-lavender': 'var(--surface-lavender, #f0f0ff)',
        'surface-mint': 'var(--surface-mint, #f0fdf4)',
        'surface-amber': 'var(--surface-amber, #fffbeb)',

        // AGRC-OS Text aliases
        'th-heading': 'var(--text-heading, #161616)',
        'th-body': 'var(--text-body, #525252)',

        // GRC semantic colors
        'risk-low': 'var(--risk-low, #24a148)',
        'risk-medium': 'var(--risk-medium, #f1c21b)',
        'risk-high': 'var(--risk-high, #ff832b)',
        'risk-critical': 'var(--risk-critical, #750e13)',
        'control-pass': 'var(--control-pass, #24a148)',
        'control-fail': 'var(--control-fail, #da1e28)',
        'evidence-fresh': 'var(--evidence-fresh, #24a148)',
        'evidence-stale': 'var(--evidence-stale, #f1c21b)',
        'evidence-missing': 'var(--evidence-missing, #da1e28)',

        // Carbon v11 direct access
        'carbon-blue-10': 'var(--blue-10, #edf5ff)',
        'carbon-blue-60': 'var(--blue-60, #0f62fe)',
        'carbon-blue-70': 'var(--blue-70, #0043ce)',
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
        'card-soft': '0 10px 30px rgba(18, 38, 63, 0.06)',
        'agrc-xs': 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.04))',
        'agrc-sm': 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
        'agrc-md': 'var(--shadow-md, 0 4px 8px rgba(0,0,0,0.06))',
        'agrc-lg': 'var(--shadow-lg, 0 12px 24px rgba(0,0,0,0.08))',
        'agrc-xl': 'var(--shadow-xl, 0 20px 40px rgba(0,0,0,0.10))',
        'glow': 'var(--shadow-glow, 0 0 20px rgba(15,98,254,0.15))',
        'blue-glow': 'var(--shadow-blue-glow, 0 0 30px rgba(15,98,254,0.25))',
      },
      backdropBlur: {
        'glass-sm': '8px',
        'glass-md': '16px',
        'glass-lg': '24px',
        'glass-xl': '40px',
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
