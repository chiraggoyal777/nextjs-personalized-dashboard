export interface ClientTheme {
  name: string;
  className: string;
  colors: {
    light: {
      primary: string;
      secondary: string;
      accent: string;
    };
    dark: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
}
export interface Client {
  id: string;
  name: string;
  email: string;
  theme: ClientTheme;
  metrics: {
    revenue: string;
    users: string;
    orders: string;
    growth: string;
  };
}
