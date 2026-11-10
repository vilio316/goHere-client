import type { IconType } from "react-icons";
import { FaCompass, FaHome, FaSave, FaUser } from "react-icons/fa";

export interface NavItem {
  path: string;
  icon: IconType;
  label: string;
}

export const navItems: NavItem[] = [
  { path: "/", icon: FaHome, label: "Home" },
  { path: "/explore", icon: FaCompass, label: "Explore" },
  { path: "/saved", icon: FaSave, label: "Saved" },
 
];
