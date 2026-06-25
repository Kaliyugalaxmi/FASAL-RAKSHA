/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F5F5EF',
    tint: '#1A5C2A',
    icon: '#5A7260',
    tabIconDefault: '#5A7260',
    tabIconSelected: '#1A5C2A',
  },
  dark: {
    text: '#ECEDEE',
    background: '#1A2E1A',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

export const THEME = {
  BG: "#F5F5EF",
  WHITE: "#FFFFFF",
  DARK: "#1A2E1A",
  MUTED: "#5A7260",
  GREEN: "#1A5C2A",
  GREEN_LIGHT: "#E8F4EA",
  GREEN_MID: "#3A7A2A",
  GREEN_DARK: "#0F3D1A",
  BORDER: "rgba(26,92,42,0.12)",
  AMBER: "#B8680A",
  RED: "#C0392B",
  GOLD: "#B8860B",
  GOLD_LIGHT: "#FEF3C7",
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
