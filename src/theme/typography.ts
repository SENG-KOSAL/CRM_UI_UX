import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  h1: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'System',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  h4: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodyBold: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  caption: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
  },
  captionBold: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  small: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  buttonSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  kpi: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  kpiLabel: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
};
