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
      primary: "bg-accent-fill text-on-accent hover:bg-amber-600 active:scale-[0.98]",
      secondary:
        "bg-transparent text-text-primary border-[1.5px] border-border-strong hover:border-text-primary hover:bg-secondary-hover active:bg-surface-active",
      ghost:
        "bg-transparent text-accent-text px-2 light:underline light:underline-offset-4",
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