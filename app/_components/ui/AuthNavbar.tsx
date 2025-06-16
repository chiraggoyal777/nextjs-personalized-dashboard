"use client";
import { useClient } from "@/components/contexts/ClientProvider";
import { useTheme } from "@/components/contexts/ThemeProvider";
import { Button } from "@/components/ui/Button";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";
import { Theme } from "@/types/theme";
import { CircleUser, Edit3, Loader, LogOut, PaintbrushVertical, Palette, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

interface AuthNavbarProps {
  onShowMoreFeaturesClick: () => void;
  isShowMoreFeaturesVisible: boolean;
}

const AuthNavbar = ({ onShowMoreFeaturesClick, isShowMoreFeaturesVisible }: AuthNavbarProps) => {
  const router = useRouter();
  const { client } = useClient();
  const { theme: activeTheme } = useTheme();

  const { theme, allThemes, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.removeItem("currentUser");
    toast.dismiss();
    toast("You've been logged out!");
    router.push("/");
  };

  const { systemThemes, customThemes } = {
    systemThemes: allThemes.filter((theme) => !theme.isUserCreated),
    customThemes: allThemes.filter((theme) => theme.isUserCreated),
  };

  const [applyingThemeId, setApplyingThemeId] = useState("");

  const requestTokenRef = useRef(0);

  async function handleApplyTheme(theme: Theme) {
    if (activeTheme && activeTheme.id === theme.id) return;

    // Cancel previous requests using a request token
    const requestId = ++requestTokenRef.current;
    setApplyingThemeId(theme.id);

    // Optional delay to simulate async task
    await new Promise((resolve) => setTimeout(resolve, 500));

    // If this is not the latest request, exit silently
    if (requestId !== requestTokenRef.current) return;

    // Dismiss all existing toasts
    toast.dismiss();

    // Apply theme and show new toast
    setTheme(theme);

    setApplyingThemeId("");
  }

  return (
    <nav className="bg-theme-primary sticky top-0 z-10 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-950">
              <span className="text-sm font-bold">{client.name.charAt(0)}</span>
            </div>
            <h1 className="ml-3 text-xl leading-tight font-semibold">{client.name} Dashboard</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Dropdown
              customWidthClasses="w-56"
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
              <div className="border-b border-gray-200 px-3 py-2 text-xs font-semibold">Choose Theme</div>

              {customThemes.map((item) => (
                <DropdownItem
                  key={item.id}
                  onClick={() => handleApplyTheme(item)}
                  isSelected={theme !== null && theme.cssClassName === item.cssClassName}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="relative size-4 shrink-0 rounded-full bg-gradient-to-br from-[var(--color-stop-1)] to-[var(--color-stop-2)]"
                      style={
                        {
                          "--color-stop-1": item.colors[0],
                          "--color-stop-2": item.colors[1],
                        } as React.CSSProperties
                      }
                    >
                      <div className="absolute -right-[1px] -bottom-[1px]">
                        <CircleUser className="h-2 w-2 rounded-full bg-gray-50" />
                      </div>
                    </div>
                    <span className="grow truncate">{item.label}</span>
                    {applyingThemeId === item.id && <Loader className="h-4 w-4 shrink-0 animate-spin" />}
                  </div>
                </DropdownItem>
              ))}
              <hr />
              {systemThemes.map((item) => (
                <DropdownItem
                  key={item.id}
                  onClick={() => handleApplyTheme(item)}
                  isSelected={theme !== null && theme.cssClassName === item.cssClassName}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="size-4 shrink-0 rounded-full bg-gradient-to-br from-[var(--color-stop-1)] to-[var(--color-stop-2)]"
                      style={
                        {
                          "--color-stop-1": item.colors[0],
                          "--color-stop-2": item.colors[1],
                        } as React.CSSProperties
                      }
                    ></div>
                    <span className="grow truncate">{item.label}</span>
                    {applyingThemeId === item.id && <Loader className="h-4 w-4 shrink-0 animate-spin" />}
                  </div>
                </DropdownItem>
              ))}
              <>
                <hr />
                <DropdownItem
                  onClick={() => theme !== null && !applyingThemeId && (toast.dismiss(), setTheme(null))}
                  isSelected={theme === null}
                >
                  <div className="flex items-center gap-3">
                    <div className="from-primary to-accent size-4 rounded-full bg-gradient-to-br"></div>
                    <span>Brand default</span>
                  </div>
                </DropdownItem>
              </>
              {!isShowMoreFeaturesVisible && (
                <>
                  <hr />
                  <DropdownItem
                    onClick={() => (onShowMoreFeaturesClick(), setIsDropdownOpen(false))}
                    isSelected={false}
                  >
                    <div className="flex items-center gap-3">
                      <WandSparkles className="text-theme-primary size-4" />
                      <span className="from-theme-primary to-theme-accent bg-gradient-to-r bg-clip-text text-transparent">More Features</span>
                    </div>
                  </DropdownItem>
                </>
              )}
              <>
                <hr />
                <DropdownItem
                  onClick={() => (router.push(`/customise-theme`), setIsDropdownOpen(false))}
                  isSelected={false}
                >
                  <div className="flex items-center gap-3">
                    <PaintbrushVertical className="text-theme-primary size-4" />
                    <span className="from-theme-primary to-theme-accent bg-gradient-to-r bg-clip-text text-transparent">
                      <span>Customise theme</span> <small className="from-theme-primary to-theme-accent text-theme-primary-contrast inline-block rounded-full bg-gradient-to-r px-2 align-middle">new</small>
                    </span>
                  </div>
                </DropdownItem>
                {activeTheme && activeTheme.isUserCreated && (
                  <DropdownItem
                    onClick={() => (router.push(`/customise-theme?id=${activeTheme.id}`), setIsDropdownOpen(false))}
                    isSelected={false}
                  >
                    <div className="flex items-center gap-3">
                      <Edit3 className="text-theme-primary size-4" />
                      <span className="from-theme-primary to-theme-accent bg-gradient-to-r bg-clip-text text-transparent">
                        <span>Modify {activeTheme.label}</span>
                      </span>
                    </div>
                  </DropdownItem>
                )}
              </>
            </Dropdown>

            <Button
              variant="gray"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? <Loader className="mr-2 size-4 animate-spin" /> : <LogOut className="mr-2 size-4" />}
              <span className="-my-1">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;
