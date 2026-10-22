import { useLocation } from "react-router";
import { NavLink } from "react-router";
import{ FaCompass, FaSave, FaUser, FaHome  } from "react-icons/fa";

interface NavItem {
  path: string;
  icon: React.ReactNode
  label: string;
}

const navItems: NavItem[] = [
  { path: "/", icon: <FaHome />, label: "Home" },
  { path: "/explore", icon:<FaCompass />, label: "Explore" },
  { path: "/saved", icon: <FaSave/>, label: "Saved" },
  { path: "/profile", icon: <FaUser />, label: "Profile" },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-16 bg-dusk-950 border-t border-dusk-700 flex items-center justify-around z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item) => (
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
          <span aria-hidden="true">{item.icon}</span>
          <span className="text-[10px] font-medium hidden sm:block">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}