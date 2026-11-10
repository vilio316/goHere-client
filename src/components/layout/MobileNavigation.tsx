import { useEffect, useRef } from "react";
import { NavLink } from "react-router";
import { FiX } from "react-icons/fi";
import { navItems } from "./navigation";
import { authClient } from "../../lib/authClient";
import { FaUser } from "react-icons/fa6";

export interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNavigation({ open, onClose }: MobileNavigationProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const {data: session} = authClient.useSession()

  useEffect(() => {
    if (!open) {
      return;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-out motion-reduce:transition-none md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] flex-col overscroll-contain border-l border-dusk-700 bg-dusk-950 shadow-2xl transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-dusk-700 px-5 py-4">
          <h2
            id="mobile-navigation-title"
            className="font-display text-lg font-bold text-text-on-dark"
          >
            Menu
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="focus-visible-ring rounded-md p-2 text-text-on-dark transition-colors hover:bg-dusk-800"
          >
            <FiX aria-hidden="true" className="text-2xl" />
          </button>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="flex flex-1 flex-col gap-2 overflow-y-auto p-4"
        >
       
          {!session || session == null ? (
            <NavLink
              to="/auth"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-lg px-4 py-3 text-lg transition-colors ${
                  isActive
                    ? "bg-amber-500/10 text-amber-500"
                    : "text-slate-400 hover:bg-dusk-800 hover:text-text-on-dark"
                }`
              }
            >
              <span className="font-medium">Guest</span>
            </NavLink>
          ) : null}
          {session && session.user && (
            <NavLink
              to="/profile"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-lg px-4 py-3 text-lg transition-colors ${
                  isActive
                    ? "bg-amber-500/10 text-amber-500"
                    : "text-slate-400 hover:bg-dusk-800 hover:text-text-on-dark"
                }`
              }
            >
              <span className="font-medium">
                <FaUser/>
              </span>
              <span className="font-medium">{session.user.name}</span>
            </NavLink>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-lg px-4 py-3 text-lg transition-colors ${
                    isActive
                      ? "bg-amber-500/10 text-amber-500"
                      : "text-slate-400 hover:bg-dusk-800 hover:text-text-on-dark"
                  }`
                }
              >
                <Icon aria-hidden="true" className="text-2xl" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
}
