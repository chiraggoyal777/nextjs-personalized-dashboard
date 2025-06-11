export interface Theme {
  id: string;
  label: string;
  colors: [string, string]; // Tuple of exactly 2 color strings
  description: string;
};