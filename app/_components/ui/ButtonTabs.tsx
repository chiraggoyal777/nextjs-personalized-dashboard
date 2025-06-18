import React, { CSSProperties, useEffect, useRef, useState } from "react";

type ButtonTabOption<T> = {
  value: T;
  elm: React.ReactNode;
};

interface ButtonTabsProps<T extends string | number> {
  activeTab?: T; // optional for uncontrolled
  defaultActiveTab?: T;
  tabs: ButtonTabOption<T>[];
  onChange?: (tab: T) => void;
  markAllActive?: boolean;
}

const ButtonTabs = <T extends string | number>({ activeTab: controlledTab, defaultActiveTab, onChange, tabs, markAllActive = false }: ButtonTabsProps<T>) => {
  const isControlled = controlledTab !== undefined;
  const [uncontrolledTab, setUncontrolledTab] = useState<T>(defaultActiveTab ?? tabs[0]?.value);

  const activeTab = isControlled ? controlledTab! : uncontrolledTab;

  const mainRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({});

  function refreshIndicator() {
    const activeButton = tabRefs.current[String(activeTab)];

    if (activeButton) {
      setIndicatorStyle({
        transform: `translateX(${activeButton.offsetLeft}px)`,
        width: activeButton.offsetWidth,
        height: activeButton.offsetHeight,
      });
    }
  }

  useEffect(() => {
    refreshIndicator();
  }, [tabs]);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;
    refreshIndicator();
    const observer = new ResizeObserver(() => {
      refreshIndicator();
    });

    observer.observe(mainEl);

    // Clean up when component unmounts
    return () => {
      observer.disconnect();
    };
  }, [activeTab]);

  const handleTabClick = (value: T) => {
    if (!isControlled) {
      setUncontrolledTab(value);
    }
    onChange?.(value);
  };

  return (
    <div
      ref={mainRef}
      className={`relative overflow-hidden rounded bg-gray-100 p-1 text-gray-600`}
    >
      {/* Indicator */}
      {!markAllActive && (
        <div
          className="bg-theme-accent absolute top-1/2 -translate-y-1/2 rounded transition-all duration-300"
          style={indicatorStyle}
        />
      )}
      {/* Tabs */}
      <div className="relative flex">
        {tabs.map(({ value, elm }) => (
          <button
            key={String(value)}
            ref={(el) => {
              tabRefs.current[String(value)] = el;
            }}
            type="button"
            onClick={() => handleTabClick(value)}
            className={`block rounded px-2 py-1 text-sm transition-colors ${markAllActive ? "bg-theme-accent" : "bg-transparent"} ${activeTab === value && !markAllActive ? "text-theme-accent-contrast" : ""} `}
          >
            {elm}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonTabs;

export const ButtonTabsPreview = <T extends string | number>(props: ButtonTabsProps<T>) => {
  return <ButtonTabs {...props} />;
};
