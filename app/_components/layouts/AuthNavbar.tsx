"use client";
import { useClient } from "@/components/contexts/ClientProvider";
import { useTheme } from "@/components/contexts/ThemeProvider";
import { Button } from "@/components/ui/Button";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";
import { isWithinNDays } from "@/lib/helpers";
import { ThemeStore } from "@/types/theme";
import { CircleUser, Edit3, Loader, LogOut, PaintbrushVertical, Palette, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { CSSProperties, useState } from "react";
import toast from "react-hot-toast";

interface AuthNavbarProps {
  onShowMoreFeaturesClick: () => void;
  isShowMoreFeaturesVisible: boolean;
}

interface ThemeItemContentProps {
  item: ThemeStore;
  isDark: boolean;
  showUserIcon?: boolean;
  showNewBadge?: boolean;
  applying: boolean;
}

const ThemeItemContent = ({ item, isDark, showUserIcon = false, showNewBadge = false, applying }: ThemeItemContentProps) => {
  const primary = isDark ? item.primaryColor.dark : item.primaryColor.light;
  const accent = isDark ? item.accentColor.dark : item.accentColor.light;

  const style: CSSProperties = {
    "--color-stop-1": primary.DEFAULT,
    "--color-stop-2": accent.DEFAULT,
    "--contrast": primary.contrast,
  } as CSSProperties;

  return (
    <div
      className="flex min-w-0 items-center gap-3"
      style={style}
    >
      <div className="relative size-4 shrink-0 rounded-full bg-[linear-gradient(to_bottom_right,var(--color-stop-1)_0%,var(--color-stop-1)_50%,var(--color-stop-2)_50%,var(--color-stop-2)_100%)]">
        {showUserIcon && (
          <div className="absolute -right-[1px] -bottom-[1px]">
            <CircleUser className="h-2 w-2 rounded-full bg-gray-50" />
          </div>
        )}
      </div>
      <span className="grow truncate">{item.label}</span>
      {showNewBadge && <small className="inline-block shrink-0 rounded-full bg-gradient-to-r from-[var(--color-stop-1)] to-[var(--color-stop-2)] px-2 align-middle text-[var(--contrast)]">{isWithinNDays(item.createdAt, 5) ? "new" : ""}</small>}
      {applying && <Loader className="h-4 w-4 shrink-0 animate-spin" />}
    </div>
  );
};

const AuthNavbar = ({ onShowMoreFeaturesClick, isShowMoreFeaturesVisible }: AuthNavbarProps) => {
  const router = useRouter();
  const { client } = useClient();
  const { theme: activeTheme, isDark, allThemes, setTheme, applyingThemeId, applyThemeGlobal: handleApplyTheme } = useTheme();

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
    systemThemes: allThemes.filter((theme) => !theme.isUserCreated).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), // or new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()

    customThemes: allThemes.filter((theme) => theme.isUserCreated).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };

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
                  color="gray"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDropdownOpen(true)}
                  endIcon={<Palette />}
                />
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
                  isSelected={activeTheme?.cssClassName === item.cssClassName}
                >
                  <ThemeItemContent
                    item={item}
                    isDark={isDark}
                    showUserIcon
                    applying={applyingThemeId === item.id}
                  />
                </DropdownItem>
              ))}

              <hr />

              {systemThemes.map((item) => (
                <DropdownItem
                  key={item.id}
                  onClick={() => handleApplyTheme(item)}
                  isSelected={activeTheme?.cssClassName === item.cssClassName}
                >
                  <ThemeItemContent
                    item={item}
                    isDark={isDark}
                    showNewBadge
                    applying={applyingThemeId === item.id}
                  />
                </DropdownItem>
              ))}

              <>
                <hr />
                <DropdownItem
                  onClick={() => activeTheme !== null && !applyingThemeId && (toast.dismiss(), setTheme(null))}
                  isSelected={activeTheme === null}
                >
                  <div className="flex items-center gap-3">
                    <div className="from-primary to-accent size-4 rounded-full bg-[linear-gradient(to_bottom_right,var(--color-primary)_0%,var(--color-primary)_50%,var(--color-accent)_50%,var(--color-accent)_100%)]"></div>
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
                    <PaintbrushVertical className="text-theme-primary size-4 shrink-0" />
                    <span className="from-theme-primary to-theme-accent flex min-w-0 items-center bg-gradient-to-r bg-clip-text text-transparent">
                      <span className="mr-1 min-w-0 truncate">Customise theme</span> <small className="from-theme-primary to-theme-accent text-theme-primary-contrast inline-block shrink-0 rounded-full bg-gradient-to-r px-2 align-middle">new</small>
                    </span>
                  </div>
                </DropdownItem>
                {activeTheme && activeTheme.isUserCreated && (
                  <DropdownItem
                    onClick={() => (router.push(`/customise-theme?id=${activeTheme.id}`), setIsDropdownOpen(false))}
                    isSelected={false}
                  >
                    <div className="flex items-center gap-3">
                      <Edit3 className="text-theme-primary size-4 shrink-0" />
                      <span className="from-theme-primary to-theme-accent flex min-w-0 items-center bg-gradient-to-r bg-clip-text text-transparent">
                        <span className="min-w-0 truncate">Modify {activeTheme.label}</span>
                      </span>
                    </div>
                  </DropdownItem>
                )}
              </>
            </Dropdown>
            <Button
              color="gray"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              startIcon={isLoggingOut ? <Loader className="animate-spin" /> : <LogOut />}
            >
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;
