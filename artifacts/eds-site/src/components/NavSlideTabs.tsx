import { useLocation } from "wouter";
import { Link } from "wouter";

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

  return (
    <ul className={`relative flex items-center list-none m-0 p-0 gap-0.5 ${className}`}>
      {tabs.map((tab) => {
        const isActive =
          tab.href !== "/" &&
          !tab.href.startsWith("/#") &&
          location.startsWith(tab.href);
        return (
          <li key={tab.href} className="shrink-0">
            <Link
              href={tab.href}
              className={`block px-3.5 py-1.5 text-[0.67rem] font-semibold tracking-[0.08em] uppercase whitespace-nowrap no-underline rounded-full transition-colors duration-150 ${
                isActive
                  ? "bg-[var(--glass-fill-elevated)] border border-[var(--glass-stroke)] text-foreground"
                  : "border border-transparent text-muted-foreground hover:bg-[var(--glass-fill)] hover:text-foreground"
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
