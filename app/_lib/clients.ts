import { Client } from "@/types/client";

export const clients: Client[] = [
  {
    id: "client-K8X919",
    name: "Northwind Corp",
    email: "admin@northwindcorp.io",
    themeId: "theme-system-06",
    metrics: {
      revenue: "$125,430",
      users: "12,543",
      orders: "1,247",
      growth: "+12.5%",
    },
  },
  {
    id: "client-OX01SK",
    name: "Orbit Labs",
    email: "admin@orbitlabs.com",
    themeId: "theme-system-02",
    metrics: {
      revenue: "$89,320",
      users: "8,932",
      orders: "892",
      growth: "+8.7%",
    },
  },
];

export const getClientByEmail = (email: string): Client | undefined => {
  return clients.find((client) => client.email === email);
};
