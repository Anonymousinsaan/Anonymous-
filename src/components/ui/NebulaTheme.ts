/**
 * NebulaTheme - Futuristic UI Theme for NebulaForge X
 * Ultra-modern sci-fi control panel aesthetic with neon-blur glass effects
 */

export const NebulaTheme = {
  colors: {
    // Primary palette - Cyberpunk inspired
    primary: {
      main: '#00d4ff',      // Electric blue
      light: '#4de6ff',     // Lighter blue
      dark: '#0099cc',      // Darker blue
      glow: 'rgba(0, 212, 255, 0.6)',
    },
    secondary: {
      main: '#00ff9d',      // Neon green
      light: '#4dffc4',     // Lighter green
      dark: '#00cc7a',      // Darker green
      glow: 'rgba(0, 255, 157, 0.6)',
    },
    accent: {
      main: '#ff0096',      // Hot pink
      light: '#ff4db8',     // Lighter pink
      dark: '#cc0075',      // Darker pink
      glow: 'rgba(255, 0, 150, 0.6)',
    },
    warning: {
      main: '#ffb400',      // Orange
      light: '#ffc947',     // Lighter orange
      dark: '#cc9000',      // Darker orange
      glow: 'rgba(255, 180, 0, 0.6)',
    },
    error: {
      main: '#ff4757',      // Red
      light: '#ff7b8a',     // Lighter red
      dark: '#cc3945',      // Darker red
      glow: 'rgba(255, 71, 87, 0.6)',
    },
    success: {
      main: '#00ff9d',      // Same as secondary for consistency
      light: '#4dffc4',
      dark: '#00cc7a',
      glow: 'rgba(0, 255, 157, 0.6)',
    },
    
    // Backgrounds - Dark with transparency
    background: {
      primary: '#000000',
      secondary: '#0a0a0a',
      tertiary: '#1a1a1a',
      panel: 'rgba(10, 10, 10, 0.8)',
      glass: 'rgba(255, 255, 255, 0.05)',
      glassHover: 'rgba(255, 255, 255, 0.1)',
      gradient: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)',
    },
    
    // Text colors
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      tertiary: '#666666',
      disabled: '#333333',
      inverse: '#000000',
    },
    
    // Borders and dividers
    border: {
      primary: 'rgba(0, 212, 255, 0.3)',
      secondary: 'rgba(255, 255, 255, 0.1)',
      accent: 'rgba(0, 255, 157, 0.3)',
      error: 'rgba(255, 71, 87, 0.3)',
    },
  },
  
  typography: {
    fontFamily: {
      primary: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", Consolas, Monaco, monospace',
      display: '"Orbitron", "Inter", sans-serif', // For sci-fi headers
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    base: '0.5rem',   // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    full: '9999px',
  },
  
  shadows: {
    none: 'none',
    sm: '0 2px 4px rgba(0, 212, 255, 0.1)',
    base: '0 4px 8px rgba(0, 212, 255, 0.15)',
    md: '0 8px 16px rgba(0, 212, 255, 0.2)',
    lg: '0 16px 32px rgba(0, 212, 255, 0.25)',
    xl: '0 32px 64px rgba(0, 212, 255, 0.3)',
    glow: '0 0 20px rgba(0, 212, 255, 0.5)',
    glowLarge: '0 0 40px rgba(0, 212, 255, 0.4)',
    inner: 'inset 0 2px 4px rgba(0, 212, 255, 0.1)',
  },
  
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '750ms',
      slowest: '1000ms',
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      linear: 'linear',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  effects: {
    blur: {
      none: 'blur(0)',
      sm: 'blur(4px)',
      base: 'blur(8px)',
      md: 'blur(12px)',
      lg: 'blur(16px)',
      xl: 'blur(24px)',
      '2xl': 'blur(40px)',
      '3xl': 'blur(64px)',
    },
    backdrop: {
      blur: 'blur(10px)',
      saturate: 'saturate(180%)',
    },
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
    secondary: 'linear-gradient(135deg, #00ff9d 0%, #00cc7a 100%)',
    accent: 'linear-gradient(135deg, #ff0096 0%, #cc0075 100%)',
    rainbow: 'linear-gradient(90deg, #00d4ff 0%, #00ff9d 25%, #ff0096 50%, #ffb400 75%, #00d4ff 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    dark: 'linear-gradient(135deg, #0a0a0a 0%, #000000 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.2) 0%, transparent 70%)',
  },
  
  components: {
    button: {
      height: {
        sm: '2rem',      // 32px
        base: '2.5rem',  // 40px
        lg: '3rem',      // 48px
        xl: '3.5rem',    // 56px
      },
      padding: {
        sm: '0.5rem 1rem',
        base: '0.75rem 1.5rem',
        lg: '1rem 2rem',
        xl: '1.25rem 2.5rem',
      },
    },
    input: {
      height: {
        sm: '2rem',
        base: '2.5rem',
        lg: '3rem',
      },
      padding: {
        sm: '0.5rem',
        base: '0.75rem',
        lg: '1rem',
      },
    },
    panel: {
      padding: {
        sm: '1rem',
        base: '1.5rem',
        lg: '2rem',
        xl: '3rem',
      },
      border: '1px solid rgba(0, 212, 255, 0.3)',
      borderRadius: '1rem',
      background: 'rgba(10, 10, 10, 0.8)',
      backdropFilter: 'blur(10px)',
    },
    card: {
      padding: '1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '0.75rem',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      hover: {
        border: '1px solid rgba(0, 212, 255, 0.3)',
        background: 'rgba(255, 255, 255, 0.1)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)',
      },
    },
  },
}

export type Theme = typeof NebulaTheme

// Utility functions for theme usage
export const getGradient = (name: keyof typeof NebulaTheme.gradients) => {
  return NebulaTheme.gradients[name]
}

export const getColor = (path: string) => {
  const keys = path.split('.')
  let value: any = NebulaTheme.colors
  
  for (const key of keys) {
    value = value[key]
    if (value === undefined) return undefined
  }
  
  return value
}

export const getShadow = (name: keyof typeof NebulaTheme.shadows) => {
  return NebulaTheme.shadows[name]
}

export const getSpacing = (name: keyof typeof NebulaTheme.spacing) => {
  return NebulaTheme.spacing[name]
}