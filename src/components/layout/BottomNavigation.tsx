import { useLocation } from "react-router";
import { NavLink } from "react-router";
import { navItems } from "./navigation";

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 hidden h-16 items-center justify-around border-t border-dusk-700 bg-dusk-950 md:flex"
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-2xl transition-colors ${
                isActive ? "text-amber-500" : "text-slate-400"
              }`
            }
            aria-current={location.pathname === item.path ? "page" : undefined}
            aria-label={item.label}
          >
            <span aria-hidden="true">
              <Icon />
            </span>
            <span className="hidden text-[10px] font-medium sm:block">
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
