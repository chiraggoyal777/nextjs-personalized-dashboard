"use client";

import { useClient } from "@/components/contexts/ClientProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BarChart3, Users, DollarSign, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { client } = useClient();
  const loadedClient = client!;
  const metrics = [
    {
      title: "Total Revenue",
      value: loadedClient.metrics.revenue,
      icon: DollarSign,
      change: loadedClient.metrics.growth,
    },
    {
      title: "Active Users",
      value: loadedClient.metrics.users,
      icon: Users,
      change: "-5.2%",
    },
    {
      title: "Total Orders",
      value: loadedClient.metrics.orders,
      icon: BarChart3,
      change: "+3.1%",
    },
    {
      title: "Growth Rate",
      value: loadedClient.metrics.growth,
      icon: TrendingUp,
      change: "+0.8%",
    },
  ];

  const statusBgColor: Record<string, string> = {
    success: "bg-success",
    info: "bg-info",
    danger: "bg-danger",
    warning: "bg-warning",
  };

  return (
    <>
      {/* Metrics Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card
              key={index}
              className="transition-shadow hover:shadow-lg"
            >
              <CardContent className="!p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className={`text-sm font-medium ${metric.change.includes("+") ? "text-success" : "text-danger"} `}>{metric.change}</p>
                  </div>
                  <div className="bg-theme-accent/10 text-theme-accent rounded-full p-3">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-theme-accent/10 flex h-64 items-center justify-center rounded-lg">
              <div className="text-center">
                <BarChart3 className="text-theme-accent mx-auto mb-2 h-12 w-12" />
                <p className="text-gray-800">Chart Component</p>
                <p className="text-sm text-gray-600">Integration Ready</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-theme-accent/10 flex h-64 items-center justify-center rounded-lg">
              <div className="text-center">
                <Users className="text-theme-accent mx-auto mb-2 h-12 w-12" />
                <p className="text-gray-800">Analytics Component</p>
                <p className="text-sm text-gray-600">Integration Ready</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Awaiting order confirmation",
                time: "2 minutes ago",
                status: "warning", // Indicates attention needed (e.g. unfulfilled order)
              },
              {
                action: "User registration",
                time: "5 minutes ago",
                status: "info", // Informational, non-critical
              },
              {
                action: "Payment processed",
                time: "10 minutes ago",
                status: "success", // Successful transaction
              },
              {
                action: "System backup failed",
                time: "1 hour ago",
                status: "danger", // More standard than "danger" in most UI libraries
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-200 py-3 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className={`h-2 w-2 rounded-full ${statusBgColor[activity.status]}`} />
                  <span className="text-gray-900">{activity.action}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
