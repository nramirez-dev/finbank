import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'sm' | 'md' | 'lg';

export interface ResponsiveLayout {
  breakpoint: Breakpoint;
  /** Horizontal screen padding */
  px: number;
  /** Horizontal padding inside cards */
  cardPx: number;
  /** Gap between elements */
  gap: number;
  /** Base font size offset (0 for md, -2 for sm, +1 for lg) */
  fontScale: number;
  /** Width available for content */
  contentWidth: number;
  screenWidth: number;
}

export function useResponsive(): ResponsiveLayout {
  const { width } = useWindowDimensions();

  if (width < 360) {
    // Small phones (320–359px)
    return {
      breakpoint: 'sm',
      px: 14,
      cardPx: 14,
      gap: 10,
      fontScale: -2,
      contentWidth: width - 28,
      screenWidth: width,
    };
  }

  if (width >= 440) {
    // Large phones / tablets (480px+)
    return {
      breakpoint: 'lg',
      px: 28,
      cardPx: 24,
      gap: 20,
      fontScale: 1,
      contentWidth: width - 56,
      screenWidth: width,
    };
  }

  // Normal phones (360–439px) — base design at 375px
  return {
    breakpoint: 'md',
    px: 20,
    cardPx: 20,
    gap: 16,
    fontScale: 0,
    contentWidth: width - 40,
    screenWidth: width,
  };
}
