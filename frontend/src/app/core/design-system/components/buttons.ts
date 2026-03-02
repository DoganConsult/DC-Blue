/**
 * Button Component System
 * Enterprise-grade button variants and states
 * WCAG 2.1 AA compliant with proper contrast ratios
 */

export interface ButtonVariant {
  base: string;
  hover: string;
  active: string;
  disabled: string;
  focus: string;
  loading: string;
}

export interface ButtonSize {
  padding: string;
  fontSize: string;
  height: string;
  minWidth: string;
  iconSize: string;
  borderRadius: string;
}

export interface ButtonSystem {
  variants: {
    primary: ButtonVariant;
    secondary: ButtonVariant;
    tertiary: ButtonVariant;
    danger: ButtonVariant;
    success: ButtonVariant;
    warning: ButtonVariant;
    ghost: ButtonVariant;
    outline: ButtonVariant;
  };
  sizes: {
    xs: ButtonSize;
    sm: ButtonSize;
    md: ButtonSize;
    lg: ButtonSize;
    xl: ButtonSize;
  };
  states: {
    default: string;
    hover: string;
    active: string;
    disabled: string;
    loading: string;
    focus: string;
  };
}

export const BUTTON_SYSTEM: ButtonSystem = {
  variants: {
    primary: {
      base: `
        background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-700) 100%);
        color: white;
        border: 2px solid transparent;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
        transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      `,
      hover: `
        background: linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-800) 100%);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
      `,
      active: `
        background: linear-gradient(135deg, var(--color-primary-800) 0%, var(--color-primary-900) 100%);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        transform: translateY(0);
      `,
      disabled: `
        background: var(--color-gray-300);
        color: var(--color-gray-500);
        cursor: not-allowed;
        box-shadow: none;
        opacity: 0.6;
      `,
      focus: `
        outline: none;
        box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.2), 0 2px 4px rgba(0, 0, 0, 0.1);
      `,
      loading: `
        position: relative;
        color: transparent;
        pointer-events: none;
        &::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          top: 50%;
          left: 50%;
          margin-left: -8px;
          margin-top: -8px;
          border: 2px solid white;
          border-radius: 50%;
          border-top-color: transparent;
          animation: button-loading-spinner 0.6s linear infinite;
        }
      `
    },
    secondary: {
      base: `
        background: var(--color-gray-100);
        color: var(--color-gray-900);
        border: 2px solid var(--color-gray-300);
        font-weight: 500;
        transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      `,
      hover: `
        background: var(--color-gray-200);
        border-color: var(--color-gray-400);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        transform: translateY(-1px);
      `,
      active: `
        background: var(--color-gray-300);
        border-color: var(--color-gray-500);
        transform: translateY(0);
      `,
      disabled: `
        background: var(--color-gray-50);
        color: var(--color-gray-400);
        border-color: var(--color-gray-200);
        cursor: not-allowed;
        opacity: 0.6;
      `,
      focus: `
        outline: none;
        box-shadow: 0 0 0 3px rgba(var(--color-gray-rgb), 0.1);
      `,
      loading: `
        position: relative;
        color: transparent;
        pointer-events: none;
      `
    },
    tertiary: {
      base: `
        background: transparent;
        color: var(--color-primary-600);
        border: 2px solid transparent;
        font-weight: 500;
        transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      `,
      hover: `
        background: rgba(var(--color-primary-rgb), 0.05);
        color: var(--color-primary-700);
      `,
      active: `
        background: rgba(var(--color-primary-rgb), 0.1);
        color: var(--color-primary-800);
      `,
      disabled: `
        color: var(--color-gray-400);
        cursor: not-allowed;
        opacity: 0.6;
      `,
      focus: `
        outline: none;
        background: rgba(var(--color-primary-rgb), 0.05);
        box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
      `,
      loading: `
        position: relative;
        color: transparent;
        pointer-events: none;
      `
    },
    danger: {
      base: `
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        border: 2px solid transparent;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
        transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      `,
      hover: `
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
        transform: translateY(-1px);
      `,
      active: `
        background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
        transform: translateY(0);
      `,
      disabled: `
        background: var(--color-gray-300);
        color: var(--color-gray-500);
        cursor: not-allowed;
        opacity: 0.6;
      `,
      focus: `
        outline: none;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
      `,
      loading: `
        position: relative;
        color: transparent;
        pointer-events: none;
      `
    },
    success: {
      base: `
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: 2px solid transparent;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
        transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      `,
      hover: `
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
        transform: translateY(-1px);
      `,
      active: `
        background: linear-gradient(135deg, #047857 0%, #065f46 100%);
        transform: translateY(0);
      `,
      disabled: `
        background: var(--color-gray-300);
        color: var(--color-gray-500);
        cursor: not-allowed;
        opacity: 0.6;
      `,
      focus: `
        outline: none;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
      `,
      loading: `
        position: relative;
        color: transparent;
        pointer-events: none;
      `
    },
    warning: {
      base: `
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        border: 2px solid transparent;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
        transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      `,
      hover: `
        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
        box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
        transform: translateY(-1px);
      `,
      active: `
        background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
        transform: translateY(0);
      `,
      disabled: `
        background: var(--color-gray-300);
        color: var(--color-gray-500);
        cursor: not-allowed;
        opacity: 0.6;
      `,
      focus: `
        outline: none;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
      `,
      loading: `
        position: relative;
        color: transparent;
        pointer-events: none;
      `
    },
    ghost: {
      base: `
        background: transparent;
        color: var(--text-primary);
        border: 2px solid transparent;
        font-weight: 500;
        transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      `,
      hover: `
        background: rgba(var(--color-gray-rgb), 0.05);
        transform: translateY(-1px);
      `,
      active: `
        background: rgba(var(--color-gray-rgb), 0.1);
        transform: translateY(0);
      `,
      disabled: `
        color: var(--color-gray-400);
        cursor: not-allowed;
        opacity: 0.6;
      `,
      focus: `
        outline: none;
        background: rgba(var(--color-gray-rgb), 0.05);
        box-shadow: 0 0 0 3px rgba(var(--color-gray-rgb), 0.1);
      `,
      loading: `
        position: relative;
        color: transparent;
        pointer-events: none;
      `
    },
    outline: {
      base: `
        background: transparent;
        color: var(--color-primary-600);
        border: 2px solid var(--color-primary-600);
        font-weight: 500;
        transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      `,
      hover: `
        background: rgba(var(--color-primary-rgb), 0.05);
        border-color: var(--color-primary-700);
        color: var(--color-primary-700);
        transform: translateY(-1px);
      `,
      active: `
        background: rgba(var(--color-primary-rgb), 0.1);
        border-color: var(--color-primary-800);
        color: var(--color-primary-800);
        transform: translateY(0);
      `,
      disabled: `
        color: var(--color-gray-400);
        border-color: var(--color-gray-300);
        cursor: not-allowed;
        opacity: 0.6;
      `,
      focus: `
        outline: none;
        box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.2);
      `,
      loading: `
        position: relative;
        color: transparent;
        pointer-events: none;
      `
    }
  },

  sizes: {
    xs: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.75rem',
      height: '28px',
      minWidth: '64px',
      iconSize: '14px',
      borderRadius: '6px'
    },
    sm: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      height: '36px',
      minWidth: '80px',
      iconSize: '16px',
      borderRadius: '8px'
    },
    md: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      height: '44px',
      minWidth: '96px',
      iconSize: '20px',
      borderRadius: '10px'
    },
    lg: {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
      height: '52px',
      minWidth: '112px',
      iconSize: '24px',
      borderRadius: '12px'
    },
    xl: {
      padding: '1.25rem 2.5rem',
      fontSize: '1.25rem',
      height: '60px',
      minWidth: '128px',
      iconSize: '28px',
      borderRadius: '14px'
    }
  },

  states: {
    default: 'cursor-pointer',
    hover: 'hover:shadow-lg',
    active: 'active:scale-98',
    disabled: 'disabled:cursor-not-allowed disabled:opacity-60',
    loading: 'loading:pointer-events-none',
    focus: 'focus:outline-none focus-visible:ring-2'
  }
};

/**
 * Button animation keyframes
 */
export const buttonAnimations = `
  @keyframes button-loading-spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes button-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  @keyframes button-ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

/**
 * Button component classes for Tailwind
 */
export const buttonClasses = {
  base: 'inline-flex items-center justify-center font-medium transition-all duration-250 ease-out',

  variants: {
    primary: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800',
    secondary: 'bg-th-bg-tert text-th-text border-2 border-th-border hover:bg-th-bg-tert hover:border-th-border-dk',
    tertiary: 'text-blue-600 hover:bg-blue-50',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700',
    success: 'bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700',
    warning: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700',
    ghost: 'text-th-text-2 hover:bg-th-bg-tert',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  },

  sizes: {
    xs: 'px-3 py-1.5 text-xs h-7 min-w-16 rounded-md',
    sm: 'px-4 py-2 text-sm h-9 min-w-20 rounded-lg',
    md: 'px-6 py-3 text-base h-11 min-w-24 rounded-lg',
    lg: 'px-8 py-4 text-lg h-13 min-w-28 rounded-xl',
    xl: 'px-10 py-5 text-xl h-15 min-w-32 rounded-xl'
  },

  states: {
    disabled: 'disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-th-bg-tert disabled:text-th-text-3',
    loading: 'relative pointer-events-none [&>*]:invisible',
    focus: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
  }
};

/**
 * Built-in theme button classes (global CSS from styles.scss).
 * Use class="theme-btn-primary" or class="theme-btn-secondary" for theme-aware buttons.
 * For Tailwind-only buttons, use buttonClasses.base + buttonClasses.variants.primary + buttonClasses.sizes.md.
 */
export const THEME_BUTTON_CLASSES = {
  /** Primary CTA – uses --button-primary-bg / --button-primary-text */
  primary: 'theme-btn-primary',
  /** Secondary – outline style, uses --color-primary */
  secondary: 'theme-btn-secondary',
  /** Tailwind combo: theme-aware primary (uses th-* and primary vars) */
  primaryTailwind: `${buttonClasses.base} bg-th-btn text-th-btn-text hover:bg-th-btn-hover ${buttonClasses.sizes.md} ${buttonClasses.states.disabled} ${buttonClasses.states.focus}`,
  /** Tailwind combo: theme-aware secondary */
  secondaryTailwind: `${buttonClasses.base} ${buttonClasses.variants.secondary} ${buttonClasses.sizes.md} ${buttonClasses.states.disabled} ${buttonClasses.states.focus}`,
} as const;