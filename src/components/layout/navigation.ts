import type { IconType } from "react-icons";
import { FaCompass, FaHome, FaSave, FaStar } from "react-icons/fa";

export interface NavItem {
  path: string;
  icon: IconType;
  label: string;
}

export const navItems: NavItem[] = [
  { path: "/", icon: FaHome, label: "Home" },
  { path: "/recommendations", icon: FaStar, label: "For You" },
  { path: "/explore", icon: FaCompass, label: "Explore" },
  { path: "/saved", icon: FaSave, label: "Saved" },
 
];
