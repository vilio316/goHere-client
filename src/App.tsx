import { useCallback, useRef, useState } from "react";
import { Outlet } from "react-router";
import {
  BottomNavigation,
  InstallPrompt,
  MobileNavigation,
  StatusBar,
} from "./components/layout";

export default function App() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const openMobileNav = useCallback(() => {
    setIsMobileNavOpen(true);
  }, []);

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen relative">
      <StatusBar
        onMenuClick={openMobileNav}
        isMenuOpen={isMobileNavOpen}
        menuButtonRef={menuButtonRef}
      />
      <Outlet />
      <BottomNavigation />
      <MobileNavigation open={isMobileNavOpen} onClose={closeMobileNav} />
      <InstallPrompt />
    </div>
  );
}
