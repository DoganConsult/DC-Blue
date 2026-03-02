/**
 * Spacing Design Tokens
 * 8px grid system for consistent spacing across the platform
 * Based on IBM Carbon and Material Design principles
 */

export interface SpacingSystem {
  base: number;
  scale: {
    px: string;
    '0': string;
    '1': string;
    '2': string;
    '3': string;
    '4': string;
    '5': string;
    '6': string;
    '7': string;
    '8': string;
    '9': string;
    '10': string;
    '11': string;
    '12': string;
    '14': string;
    '16': string;
    '20': string;
    '24': string;
    '28': string;
    '32': string;
    '36': string;
    '40': string;
    '44': string;
    '48': string;
    '52': string;
    '56': string;
    '60': string;
    '64': string;
    '72': string;
    '80': string;
    '96': string;
  };
  layout: {
    containerPadding: {
      mobile: string;
      tablet: string;
      desktop: string;
      wide: string;
    };
    sectionSpacing: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    componentSpacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    gridGutter: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
  };
  density: {
    compact: {
      padding: string;
      gap: string;
      margin: string;
    };
    comfortable: {
      padding: string;
      gap: string;
      margin: string;
    };
    spacious: {
      padding: string;
      gap: string;
      margin: string;
    };
  };
}

export const SPACING: SpacingSystem = {
  base: 8, // 8px base unit

  scale: {
    px: '1px',
    '0': '0',
    '1': '0.25rem',   // 4px
    '2': '0.5rem',    // 8px - base unit
    '3': '0.75rem',   // 12px
    '4': '1rem',      // 16px - 2x base
    '5': '1.25rem',   // 20px
    '6': '1.5rem',    // 24px - 3x base
    '7': '1.75rem',   // 28px
    '8': '2rem',      // 32px - 4x base
    '9': '2.25rem',   // 36px
    '10': '2.5rem',   // 40px - 5x base
    '11': '2.75rem',  // 44px
    '12': '3rem',     // 48px - 6x base
    '14': '3.5rem',   // 56px - 7x base
    '16': '4rem',     // 64px - 8x base
    '20': '5rem',     // 80px - 10x base
    '24': '6rem',     // 96px - 12x base
    '28': '7rem',     // 112px
    '32': '8rem',     // 128px - 16x base
    '36': '9rem',     // 144px
    '40': '10rem',    // 160px - 20x base
    '44': '11rem',    // 176px
    '48': '12rem',    // 192px - 24x base
    '52': '13rem',    // 208px
    '56': '14rem',    // 224px - 28x base
    '60': '15rem',    // 240px
    '64': '16rem',    // 256px - 32x base
    '72': '18rem',    // 288px
    '80': '20rem',    // 320px - 40x base
    '96': '24rem'     // 384px - 48x base
  },

  layout: {
    containerPadding: {
      mobile: '1rem',      // 16px
      tablet: '1.5rem',    // 24px
      desktop: '2rem',     // 32px
      wide: '3rem'         // 48px
    },
    sectionSpacing: {
      mobile: '3rem',      // 48px
      tablet: '4rem',      // 64px
      desktop: '6rem'      // 96px
    },
    componentSpacing: {
      xs: '0.5rem',        // 8px
      sm: '1rem',          // 16px
      md: '1.5rem',        // 24px
      lg: '2rem',          // 32px
      xl: '3rem'           // 48px
    },
    gridGutter: {
      mobile: '1rem',      // 16px
      tablet: '1.5rem',    // 24px
      desktop: '2rem'      // 32px
    }
  },

  density: {
    compact: {
      padding: '0.5rem',   // 8px
      gap: '0.5rem',       // 8px
      margin: '0.75rem'    // 12px
    },
    comfortable: {
      padding: '1rem',     // 16px
      gap: '1rem',         // 16px
      margin: '1.5rem'     // 24px
    },
    spacious: {
      padding: '1.5rem',   // 24px
      gap: '1.5rem',       // 24px
      margin: '2rem'       // 32px
    }
  }
};

/**
 * Spacing utilities for consistent application
 */
export const spacingUtilities = {
  // Padding utilities
  p: (value: keyof typeof SPACING.scale) => `padding: ${SPACING.scale[value]};`,
  px: (value: keyof typeof SPACING.scale) => `padding-left: ${SPACING.scale[value]}; padding-right: ${SPACING.scale[value]};`,
  py: (value: keyof typeof SPACING.scale) => `padding-top: ${SPACING.scale[value]}; padding-bottom: ${SPACING.scale[value]};`,
  pt: (value: keyof typeof SPACING.scale) => `padding-top: ${SPACING.scale[value]};`,
  pr: (value: keyof typeof SPACING.scale) => `padding-right: ${SPACING.scale[value]};`,
  pb: (value: keyof typeof SPACING.scale) => `padding-bottom: ${SPACING.scale[value]};`,
  pl: (value: keyof typeof SPACING.scale) => `padding-left: ${SPACING.scale[value]};`,

  // Margin utilities
  m: (value: keyof typeof SPACING.scale) => `margin: ${SPACING.scale[value]};`,
  mx: (value: keyof typeof SPACING.scale) => `margin-left: ${SPACING.scale[value]}; margin-right: ${SPACING.scale[value]};`,
  my: (value: keyof typeof SPACING.scale) => `margin-top: ${SPACING.scale[value]}; margin-bottom: ${SPACING.scale[value]};`,
  mt: (value: keyof typeof SPACING.scale) => `margin-top: ${SPACING.scale[value]};`,
  mr: (value: keyof typeof SPACING.scale) => `margin-right: ${SPACING.scale[value]};`,
  mb: (value: keyof typeof SPACING.scale) => `margin-bottom: ${SPACING.scale[value]};`,
  ml: (value: keyof typeof SPACING.scale) => `margin-left: ${SPACING.scale[value]};`,

  // Gap utilities
  gap: (value: keyof typeof SPACING.scale) => `gap: ${SPACING.scale[value]};`,
  gapX: (value: keyof typeof SPACING.scale) => `column-gap: ${SPACING.scale[value]};`,
  gapY: (value: keyof typeof SPACING.scale) => `row-gap: ${SPACING.scale[value]};`
};

/**
 * Responsive spacing helper
 */
export const responsiveSpacing = (
  mobile: keyof typeof SPACING.scale,
  tablet?: keyof typeof SPACING.scale,
  desktop?: keyof typeof SPACING.scale
): string => {
  return `
    ${SPACING.scale[mobile]};
    ${tablet ? `@media (min-width: 768px) { ${SPACING.scale[tablet]}; }` : ''}
    ${desktop ? `@media (min-width: 1024px) { ${SPACING.scale[desktop]}; }` : ''}
  `;
};