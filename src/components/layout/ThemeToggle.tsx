import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";

export interface ThemeToggleProps {
  /** "nav" sits on the dusk status bar; "surface" sits on page/card content. */
  tone?: "nav" | "surface";
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({
  tone = "nav",
  showLabel = false,
  className = "",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  const toneClasses =
    tone === "nav"
      ? "text-nav-muted hover:text-text-on-dark hover:bg-dusk-800"
      : "border border-border-subtle text-text-secondary hover:bg-surface-sunken hover:text-text-primary";

  const sizeClasses = showLabel
    ? "gap-2 px-3 py-1.5 text-xs font-semibold"
    : "h-8 w-8";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      className={`inline-flex items-center justify-center rounded-pill transition-standard focus-visible-ring ${sizeClasses} ${toneClasses} ${className}`}
    >
      {isDark ? (
        <FiSun aria-hidden="true" size={showLabel ? 16 : 18} />
      ) : (
        <FiMoon aria-hidden="true" size={showLabel ? 16 : 18} />
      )}
      {showLabel && <span>{isDark ? "Light mode" : "Dark mode"}</span>}
    </button>
  );
}
