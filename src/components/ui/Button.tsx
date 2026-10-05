import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "default", fullWidth = false, className = "", disabled, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center font-body font-semibold transition-standard focus-visible-ring";

    const variantClasses = {
      primary: "bg-amber-500 text-ink-900 hover:bg-amber-600 active:scale-[0.98]",
      secondary: "bg-transparent text-fog-050 border-1.5 border-dusk-600 hover:border-fog-050 active:bg-white/5",
      ghost: "bg-transparent text-amber-500 px-2",
    };

    const sizeClasses = {
      default: "text-base px-6 py-3.5",
      sm: "text-sm px-4 py-2.5",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} rounded-pill ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";