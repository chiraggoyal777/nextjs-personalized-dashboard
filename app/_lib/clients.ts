import { Client } from "@/types/client";

export const clients: Client[] = [
  {
    id: "1",
    name: "Orange Corp",
    email: "admin@orangecorp.com",
    theme: {
      name: "Orange",
      className: "theme-orange-sky",
      colors: {
        light: {
          primary: "#ea580c",
          secondary: "#fb923c",
          accent: "#fed7aa",
        },
        dark: {
          primary: "#ea580c",
          secondary: "#fb923c",
          accent: "#fed7aa",
        },
      },
    },
    metrics: {
      revenue: "$125,430",
      users: "12,543",
      orders: "1,247",
      growth: "+12.5%",
    },
  },
  {
    id: "2",
    name: "Purple Industries",
    email: "admin@purpleind.com",
    theme: {
      name: "Purple",
      className: "theme-purple-lime",
      colors: {
        light: {
          primary: "#7c3aed",
          secondary: "#a78bfa",
          accent: "#ddd6fe",
        },
        dark: {
          primary: "#7c3aed",
          secondary: "#a78bfa",
          accent: "#ddd6fe",
        },
      },
    },
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
