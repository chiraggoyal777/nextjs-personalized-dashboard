import { ShadesPalette, ThemePalette } from "@/types/theme";

type RGB = { r: number; g: number; b: number };

export function rgbToHex(rgb: string): string {
  const result = rgb.match(/\d+/g);
  if (!result) return rgb;
  return (
    "#" +
    result
      .slice(0, 3)
      .map((num) => {
        const hex = parseInt(num).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  ).toLowerCase();
}

export function normalizeHex(hex: string): string {
  // Handle shorthand like #fff
  if (hex.startsWith("#") && hex.length === 4) {
    return (
      "#" +
      hex[1] + hex[1] +
      hex[2] + hex[2] +
      hex[3] + hex[3]
    ).toLowerCase();
  }
  return hex.toLowerCase();
}

// Color utility functions
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHsl = (r: number, g: number, b: number): [h: number, s: number, l: number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};
export const hslToRgb = (h: number, s: number, l: number): [r: number, g: number, b: number] => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  if (s === 0) {
    const gray = Math.round(l * 255);
    return [gray, gray, gray];
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return [Math.round(hue2rgb(p, q, h + 1 / 3) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - 1 / 3) * 255)];
  }
};

export const generatePalette = (baseColor: string): ShadesPalette => {
  const rgb: RGB | null = hexToRgb(baseColor);
  if (!rgb) return {};

  const [h, s, l]: [number, number, number] = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const shades: Record<number, [number, number, number]> = {
    50: [h, Math.max(s - 20, 10), Math.min(l + 45, 95)],
    100: [h, Math.max(s - 10, 15), Math.min(l + 35, 90)],
    200: [h, s, Math.min(l + 25, 85)],
    300: [h, s, Math.min(l + 15, 80)],
    400: [h, s, Math.min(l + 5, 75)],
    500: [h, s, l], // base color
    600: [h, Math.min(s + 5, 100), Math.max(l - 10, 15)],
    700: [h, Math.min(s + 10, 100), Math.max(l - 20, 10)],
    800: [h, Math.min(s + 15, 100), Math.max(l - 30, 8)],
    900: [h, Math.min(s + 20, 100), Math.max(l - 40, 6)],
    950: [h, Math.min(s + 25, 100), Math.max(l - 50, 4)],
  };

  const palette: ShadesPalette = {};

  Object.entries(shades).forEach(([shade, [hue, sat, light]]) => {
    const [r, g, b] = hslToRgb(hue, sat, light);
    palette[shade] = `rgb(${r} ${g} ${b})`;
  });

  return palette;
};

export const getContrastRatio = (color1: string, color2: "#ffffff" | "#000000"): number => {
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      const normalized = c / 255;
      return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const rgb1: RGB | null = hexToRgb(color1);
  const rgb2: RGB = color2 === "#ffffff" ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 };

  if (!rgb1) return 1;

  const l1: number = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2: number = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

export const generateThemeCSS = ({ cssClassName, primaryColor, accentColor, useSeparateDarkMode, useSeparateAccent }: { cssClassName: string; primaryColor: ThemePalette;  accentColor: ThemePalette; useSeparateDarkMode: boolean; useSeparateAccent: boolean }) => {
  const primaryPalette = generatePalette(primaryColor.light.DEFAULT);
  const accentPalette = useSeparateAccent ? generatePalette(accentColor.light.DEFAULT) : generatePalette(primaryColor.light.DEFAULT);

  let css = `/* ${cssClassName} theme */\n.${cssClassName} {\n`;

  // Primary colors
  Object.entries(primaryPalette).forEach(([shade, color]) => {
    css += `  --color-theme-primary-${shade}: ${color};\n`;
  });

  css += `  /* default primary, interaction, contrast */\n`;
  css += `  --color-theme-primary: var(--color-theme-primary-500);\n`;
  css += `  --color-theme-primary-interaction: var(--color-theme-primary-600);\n`;
  css += `  --color-theme-primary-contrast: var(--color-gray-${primaryColor.light.contrast === "white" ? "0" : "1000"});\n\n`;

  // Accent colors
  Object.entries(accentPalette).forEach(([shade, color]) => {
    css += `  --color-theme-accent-${shade}: ${color};\n`;
  });

  css += `  /* default accent, interaction, contrast */\n`;
  css += `  --color-theme-accent: var(--color-theme-accent-500);\n`;
  css += `  --color-theme-accent-interaction: var(--color-theme-accent-600);\n`;
  css += `  --color-theme-accent-contrast: var(--color-gray-${accentColor.light.contrast === "white" ? "0" : "1000"});\n`;
  css += `}\n`;

  // Dark mode
  const darkPrimaryPalette = useSeparateDarkMode ? generatePalette(primaryColor.dark.DEFAULT) : generatePalette(primaryColor.light.DEFAULT);
  const darkAccentPalette = useSeparateDarkMode ? generatePalette(accentColor.dark.DEFAULT) : generatePalette(accentColor.light.DEFAULT);

  // Reverse the palette for dark mode
  const reversedPrimary: Record<number, string> = {};
  const reversedAccent: Record<number, string> = {};

  Object.entries(darkPrimaryPalette).forEach(([shade, color]) => {
    const reverseShade = 1000 - parseInt(shade);
    reversedPrimary[reverseShade] = color;
  });

  Object.entries(darkAccentPalette).forEach(([shade, color]) => {
    const reverseShade = 1000 - parseInt(shade);
    reversedAccent[reverseShade] = color;
  });

  css += `/* ${cssClassName} theme dark */\n.${cssClassName}.dark {\n`;

  Object.entries(reversedPrimary).forEach(([shade, color]) => {
    css += `  --color-theme-primary-${shade}: ${color};\n`;
  });

  css += `  /* override light mode primary, interaction, contrast */\n`;
  css += `  --color-theme-primary: var(--color-theme-primary-500);\n`;
  css += `  --color-theme-primary-interaction: var(--color-theme-primary-600);\n`;
  css += `  --color-theme-primary-contrast: var(--color-gray-${primaryColor.dark.contrast === "white" ? "1000" : "0"});\n\n`;

  Object.entries(reversedAccent).forEach(([shade, color]) => {
    css += `  --color-theme-accent-${shade}: ${color};\n`;
  });

  css += `  /* override light mode accent, interaction, contrast */\n`;
  css += `  --color-theme-accent: var(--color-theme-accent-500);\n`;
  css += `  --color-theme-accent-interaction: var(--color-theme-accent-600);\n`;
  css += `  --color-theme-accent-contrast: var(--color-gray-${accentColor.dark.contrast === "white" ? "1000" : "0"});\n`;
  css += `}\n`;

  return css;
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T, 
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export function isWithinNDays(createdAt: string, days: number): boolean {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffInMs = now.getTime() - createdDate.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return diffInDays <= days;
}