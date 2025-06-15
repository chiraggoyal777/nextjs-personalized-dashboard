import { Theme } from "./theme";

export interface Client {
  id: string;
  name: string;
  email: string;
  themeId: Theme["id"] | null;
  metrics: {
    revenue: string;
    users: string;
    orders: string;
    growth: string;
  };
}
