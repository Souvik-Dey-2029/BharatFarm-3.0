/**
 * BharatFarm Regenerative Intelligence Design Tokens
 * Agricultural color palette, responsive breakpoints, surfaces, typography
 */

export const tokens = {
  colors: {
    // Primary Agricultural Palette
    primaryDeep: '#14532D',      // Deep field green
    primaryLeaf: '#2F7D46',      // Leaf green
    primaryLight: '#DCFCE7',     // Soft sprout green
    primaryBg: '#F0FDF4',        // Field tint

    // Earth & Soil
    earth: '#6B5140',            // Earth brown
    clay: '#B45F43',             // Terracotta / clay
    soilSoft: '#D8C5A8',         // Soft soil tone
    soilWarm: '#EFEAE2',         // Natural soil border tone

    // Canvas & Neutral Surfaces
    canvas: '#F7F3E9',           // Warm cream canvas
    surfaceLight: '#FFFFFF',     // Clean card / surface
    surfaceAlt: '#FDFBF7',       // Soft warm cream surface
    textPrimary: '#0F172A',      // High-contrast slate
    textSecondary: '#475569',    // Secondary slate
    textMuted: '#64748B',        // Muted label
    borderDefault: '#EFEAE2',    // Subtle earth border
    borderSubtle: '#F1F5F9',

    // Status Colors (Farmer-First)
    statusGood: '#15803D',
    statusGoodBg: '#DCFCE7',
    statusGoodBorder: '#BBF7D0',

    statusWatch: '#B45309',
    statusWatchBg: '#FEF3C7',
    statusWatchBorder: '#FDE68A',

    statusAlert: '#B91C1C',
    statusAlertBg: '#FEE2E2',
    statusAlertBorder: '#FECACA',

    // Climate & Moisture
    sky: '#0284C7',
    skyBg: '#E0F2FE',
    sunYellow: '#E3C56F'
  },

  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    display: 'clamp(26px, 4vw, 36px)',
    h1: 'clamp(20px, 3vw, 28px)',
    h2: 'clamp(16px, 2.5vw, 22px)',
    h3: 'clamp(14px, 2vw, 18px)',
    body: '14px',
    small: '12px',
    micro: '11px',
    kpi: 'clamp(24px, 3.5vw, 34px)'
  },

  radii: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '9999px'
  },

  shadows: {
    subtle: '0 1px 3px rgba(0, 0, 0, 0.02)',
    elevated: '0 4px 12px rgba(20, 83, 45, 0.08)',
    modal: '0 12px 36px rgba(15, 23, 42, 0.16)'
  },

  breakpoints: {
    mobileMax: '767px',
    tabletMin: '768px',
    desktopMin: '1024px',
    desktopWide: '1440px'
  }
} as const;
