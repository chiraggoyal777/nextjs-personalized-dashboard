"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/contexts/ThemeProvider";
import { Client } from "@/types/client";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  LogOut,
  Palette,
  X,
  WandSparkles,
  Github,
  Codepen,
  Linkedin,
} from "lucide-react";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";

export default function DashboardPage() {
  const [client, setClient] = useState<Client | null>(null);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const router = useRouter();
  const { theme, allThemes, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/");
      return;
    }

    const userData = JSON.parse(currentUser) as Client;
    setClient(userData);

    // Apply client theme
    setTheme(userData.themeId);
  }, [router, setTheme]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  if (!client)
    return (
      <div className="p-10 text-center text-2xl font-bold text-gray-800">
        Please wait...
      </div>
    );

  const metrics = [
    {
      title: "Total Revenue",
      value: client.metrics.revenue,
      icon: DollarSign,
      change: client.metrics.growth,
    },
    {
      title: "Active Users",
      value: client.metrics.users,
      icon: Users,
      change: "-5.2%",
    },
    {
      title: "Total Orders",
      value: client.metrics.orders,
      icon: BarChart3,
      change: "+3.1%",
    },
    {
      title: "Growth Rate",
      value: client.metrics.growth,
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
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-theme-primary sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-950">
                <span className="text-sm font-bold">
                  {client.name.charAt(0)}
                </span>
              </div>
              <h1 className="ml-3 text-xl font-semibold">
                {client.name} Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <Dropdown
                trigger={
                  <Button
                    variant="gray"
                    size="sm"
                    onClick={() => setIsDropdownOpen(true)}
                  >
                    <Palette className="h-4 w-4" />
                  </Button>
                }
                isOpen={isDropdownOpen}
                onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                onClose={() => setIsDropdownOpen(false)}
                position="bottom-center"
              >
                <div className="border-b border-gray-200 px-3 py-2 text-xs font-semibold">
                  Choose Theme
                </div>

                {allThemes.map((item) => (
                  <DropdownItem
                    key={item.id}
                    onClick={() => setTheme(item.id)}
                    isSelected={theme === item.id}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="size-4 rounded-full bg-gradient-to-br from-[var(--color-stop-1)] to-[var(--color-stop-2)]"
                        style={
                          {
                            "--color-stop-1": item.colors[0],
                            "--color-stop-2": item.colors[1],
                          } as React.CSSProperties
                        }
                      ></div>
                      <span>{item.label}</span>
                    </div>
                  </DropdownItem>
                ))}
                <>
                  <hr />
                  <DropdownItem
                    onClick={() => setTheme("")}
                    isSelected={theme === ""}
                  >
                    <div className="flex items-center gap-3">
                      <div className="from-primary to-accent size-4 rounded-full bg-gradient-to-br"></div>
                      <span>Brand default</span>
                    </div>
                  </DropdownItem>
                </>
                {!showThemeCustomizer && (
                  <>
                    <hr />
                    <DropdownItem
                      onClick={() => (
                        setShowThemeCustomizer(true), setIsDropdownOpen(false)
                      )}
                      isSelected={false}
                    >
                      <div className="flex items-center gap-3">
                        <WandSparkles className="text-theme-primary size-4" />
                        <span className="from-theme-primary to-theme-accent bg-gradient-to-r bg-clip-text text-transparent">
                          More Features
                        </span>
                      </div>
                    </DropdownItem>
                  </>
                )}
              </Dropdown>

              <Button variant="gray" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 size-4" />
                <span className="-my-1">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {client.name}
          </h2>
          <p className="mt-2 text-gray-600">
            {`Here's what's happening with your business today.`}
          </p>
        </div>

        {/* Theme Customizer */}
        {showThemeCustomizer && (
          <div className="relative mb-8">
            <div className="absolute -top-2 -right-2 w-max">
              <Button
                className="!bg-gray-0 !text-theme-accent !border-theme-accent !ring-theme-accent/20 !rounded-full !border-4 !p-1"
                onClick={() => setShowThemeCustomizer(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="from-theme-primary to-theme-accent rounded-xl bg-gradient-to-r p-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-theme-primary">
                    <WandSparkles className="mr-2 inline size-[1em] align-bottom" />
                    <span className="from-theme-primary to-theme-accent bg-gradient-to-r bg-clip-text text-transparent">
                      More features (Coming Soon)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    Explore the current features — and get ready for the
                    upcoming ones, including:
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-gray-600">
                    <li>More themes & pages</li>
                    <li>Create custom theme</li>
                    <li>Layout preferences</li>
                    <li>Personalized widgets</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardContent className="!p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metric.value}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          metric.change.includes("+")
                            ? "text-success"
                            : "text-danger"
                        } `}
                      >
                        {metric.change}
                      </p>
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
                    <div
                      className={`h-2 w-2 rounded-full ${
                        statusBgColor[activity.status]
                      }`}
                    />
                    <span className="text-gray-900">{activity.action}</span>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="bg-background py-4 text-gray-600 dark:text-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm opacity-80">&copy; chiraggoyal777</p>
          <span className="px-4 opacity-30 hidden sm:block">|</span>
          <div className="mt-2 flex sm:mt-0">
            <a
              href="https://github.com/chiraggoyal777"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit my Github repo"
              className="shrink-0 block p-2 rounded-full hover:bg-theme-primary/20 hover:text-theme-primary transition-colors"
              title="Visit my Github repo"
            >
              <Github className="size-4" />
            </a>
            <a
              href="https://codepen.io/chiraggoyal777"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow me on Codepen"
              className="shrink-0 block p-2 rounded-full hover:bg-theme-primary/20 hover:text-theme-primary transition-colors"
              title="Follow me on Codepen"
            >
              <Codepen className="size-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/chiraggoyal777"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Let's connect on LinkedIn"
              className="shrink-0 block p-2 rounded-full hover:bg-theme-primary/20 hover:text-theme-primary transition-colors"
              title="Let's connect on LinkedIn"
            >
              <Linkedin className="size-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
