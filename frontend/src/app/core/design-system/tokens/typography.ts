/**
 * Typography Design Tokens
 * IBM-inspired font scales with enhanced hierarchy
 */

export interface TypographyScale {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing: string;
  textTransform?: string;
}

export interface TypographySystem {
  fontFamily: {
    sans: string;
    mono: string;
    arabic: string;
  };
  scale: {
    // Display scales for hero sections
    display1: TypographyScale;
    display2: TypographyScale;
    display3: TypographyScale;

    // Heading scales
    h1: TypographyScale;
    h2: TypographyScale;
    h3: TypographyScale;
    h4: TypographyScale;
    h5: TypographyScale;
    h6: TypographyScale;

    // Body scales
    bodyLarge: TypographyScale;
    bodyMedium: TypographyScale;
    bodySmall: TypographyScale;

    // Utility scales
    label: TypographyScale;
    caption: TypographyScale;
    overline: TypographyScale;
    code: TypographyScale;
  };
  weights: {
    thin: number;
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
    black: number;
  };
}

export const TYPOGRAPHY: TypographySystem = {
  fontFamily: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", monospace',
    arabic: '"IBM Plex Arabic", "Noto Kufi Arabic", "Segoe UI", sans-serif'
  },

  scale: {
    // Display - For hero sections and major headings
    display1: {
      fontSize: 'clamp(3rem, 5vw, 5rem)',
      lineHeight: '1.1',
      fontWeight: 900,
      letterSpacing: '-0.04em'
    },
    display2: {
      fontSize: 'clamp(2.5rem, 4vw, 4rem)',
      lineHeight: '1.15',
      fontWeight: 800,
      letterSpacing: '-0.03em'
    },
    display3: {
      fontSize: 'clamp(2rem, 3vw, 3rem)',
      lineHeight: '1.2',
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },

    // Headings - For section titles and content hierarchy
    h1: {
      fontSize: 'clamp(2rem, 2.5vw, 2.5rem)',
      lineHeight: '1.25',
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: 'clamp(1.75rem, 2vw, 2rem)',
      lineHeight: '1.3',
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontSize: 'clamp(1.5rem, 1.75vw, 1.75rem)',
      lineHeight: '1.35',
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h4: {
      fontSize: 'clamp(1.25rem, 1.5vw, 1.5rem)',
      lineHeight: '1.4',
      fontWeight: 500,
      letterSpacing: '0'
    },
    h5: {
      fontSize: 'clamp(1.125rem, 1.25vw, 1.25rem)',
      lineHeight: '1.45',
      fontWeight: 500,
      letterSpacing: '0'
    },
    h6: {
      fontSize: 'clamp(1rem, 1.125vw, 1.125rem)',
      lineHeight: '1.5',
      fontWeight: 500,
      letterSpacing: '0'
    },

    // Body text
    bodyLarge: {
      fontSize: '1.125rem',
      lineHeight: '1.75',
      fontWeight: 400,
      letterSpacing: '0'
    },
    bodyMedium: {
      fontSize: '1rem',
      lineHeight: '1.65',
      fontWeight: 400,
      letterSpacing: '0'
    },
    bodySmall: {
      fontSize: '0.875rem',
      lineHeight: '1.6',
      fontWeight: 400,
      letterSpacing: '0'
    },

    // Utility text
    label: {
      fontSize: '0.875rem',
      lineHeight: '1.4',
      fontWeight: 500,
      letterSpacing: '0.025em'
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: '1.4',
      fontWeight: 400,
      letterSpacing: '0.025em'
    },
    overline: {
      fontSize: '0.75rem',
      lineHeight: '1.4',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    },
    code: {
      fontSize: '0.875rem',
      lineHeight: '1.5',
      fontWeight: 400,
      letterSpacing: '0'
    }
  },

  weights: {
    thin: 100,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900
  }
};

/**
 * CSS-in-JS utility for applying typography scales
 */
export const applyTypography = (scale: keyof TypographySystem['scale']): string => {
  const styles = TYPOGRAPHY.scale[scale];
  return `
    font-size: ${styles.fontSize};
    line-height: ${styles.lineHeight};
    font-weight: ${styles.fontWeight};
    letter-spacing: ${styles.letterSpacing};
    ${styles.textTransform ? `text-transform: ${styles.textTransform};` : ''}
  `;
};

/**
 * Tailwind-compatible typography classes
 */
export const typographyClasses = {
  display1: 'text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter',
  display2: 'text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter',
  display3: 'text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight',
  h1: 'text-3xl md:text-4xl font-bold leading-tight tracking-tight',
  h2: 'text-2xl md:text-3xl font-semibold leading-snug tracking-tight',
  h3: 'text-xl md:text-2xl font-semibold leading-snug tracking-tight',
  h4: 'text-lg md:text-xl font-medium leading-normal',
  h5: 'text-base md:text-lg font-medium leading-normal',
  h6: 'text-sm md:text-base font-medium leading-normal',
  bodyLarge: 'text-lg leading-relaxed',
  bodyMedium: 'text-base leading-relaxed',
  bodySmall: 'text-sm leading-relaxed',
  label: 'text-sm font-medium tracking-wide',
  caption: 'text-xs tracking-wide',
  overline: 'text-xs font-semibold tracking-widest uppercase',
  code: 'font-mono text-sm'
};