"use client";
import { useClient } from "@/components/contexts/ClientProvider";
import React from "react";

const ClientInfo = () => {
  const { client } = useClient();
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900">Welcome back, {client.name}</h2>
      <p className="mt-2 text-gray-600">{`Here's what's happening with your business today.`}</p>
    </div>
  );
};

export default ClientInfo;
