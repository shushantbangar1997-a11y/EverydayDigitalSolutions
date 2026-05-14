import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";

export interface NavTab {
  label: string;
  href: string;
}

interface NavSlideTabsProps {
  tabs: NavTab[];
  className?: string;
}

export function NavSlideTabs({ tabs, className = "" }: NavSlideTabsProps) {
  const [location] = useLocation();
  const [cursor, setCursor] = useState({ left: 0, width: 0, opacity: 0 });
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const getActiveIndex = useCallback(() => {
    return tabs.findIndex((t) => {
      if (t.href.startsWith("/#") || t.href === "/") return false;
      return location.startsWith(t.href);
    });
  }, [location, tabs]);

  const moveCursorTo = useCallback((i: number) => {
    const el = itemRefs.current[i];
    if (!el) return;
    const { width } = el.getBoundingClientRect();
    setCursor({ left: el.offsetLeft, width, opacity: 1 });
  }, []);

  useEffect(() => {
    const i = getActiveIndex();
    if (i >= 0) {
      moveCursorTo(i);
    } else {
      setCursor((c) => ({ ...c, opacity: 0 }));
    }
  }, [location, getActiveIndex, moveCursorTo]);

  function handleMouseEnter(i: number) {
    moveCursorTo(i);
  }

  function handleMouseLeave() {
    const i = getActiveIndex();
    if (i >= 0) {
      moveCursorTo(i);
    } else {
      setCursor((c) => ({ ...c, opacity: 0 }));
    }
  }

  return (
    <ul
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center list-none m-0 p-0 ${className}`}
    >
      <motion.li
        animate={cursor}
        transition={{ type: "spring", stiffness: 450, damping: 32 }}
        className="absolute inset-y-0.5 z-0 rounded-full bg-[var(--glass-fill-elevated)] border border-[var(--glass-stroke)] pointer-events-none"
        aria-hidden
      />
      {tabs.map((tab, i) => {
        const isActive =
          !tab.href.startsWith("/#") && location.startsWith(tab.href);
        return (
          <li
            key={tab.href}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            onMouseEnter={() => handleMouseEnter(i)}
            className="relative z-10 shrink-0"
          >
            <Link
              href={tab.href}
              className={`block px-3.5 py-1.5 text-[0.67rem] font-semibold tracking-[0.08em] uppercase whitespace-nowrap no-underline transition-colors duration-150 ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
