// Transit Blue — the theme selected from the droppd design exploration canvas.
// Ported 1:1 from the design artboards (T1-Home, T1-Wallet, T1-Profile, T1-Tracking).

export const transitBlueColors = {
  background: '#F3F6FB',
  surface: '#FFFFFF',
  surfaceTint: '#EAF0FA',
  border: '#E1E7F2',

  primary: '#163A8C',
  primaryGradientEnd: '#2456C9',
  accent: '#F5A524',

  textPrimary: '#10182B',
  textSecondary: '#5B6478',
  textMuted: '#8891A2',

  success: '#1E9E5A',
  danger: '#C0392B',
  dangerBg: '#FDF3F3',
  dangerBorder: '#F1CFCF',

  white: '#FFFFFF',
} as const;

export const transitBlueRadii = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const transitBlueSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const transitBlueTypography = {
  fontFamily: 'Sora_600SemiBold',
  fontFamilyBold: 'Sora_700Bold',
  fontFamilyRegular: 'Sora_400Regular',
  h1: { fontSize: 22, fontWeight: '800' as const },
  h2: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 14, fontWeight: '500' as const },
  caption: { fontSize: 11, fontWeight: '500' as const },
};

export const transitBlueShadow = {
  card: {
    shadowColor: '#10182B',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  floating: {
    shadowColor: '#10182B',
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
};

export type Theme = {
  colors: typeof transitBlueColors;
  radii: typeof transitBlueRadii;
  spacing: typeof transitBlueSpacing;
  typography: typeof transitBlueTypography;
  shadow: typeof transitBlueShadow;
};

export const transitBlueTheme: Theme = {
  colors: transitBlueColors,
  radii: transitBlueRadii,
  spacing: transitBlueSpacing,
  typography: transitBlueTypography,
  shadow: transitBlueShadow,
};
