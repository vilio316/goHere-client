import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "live" | "solo" | "closed";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = "live", className = "", ...props }, ref) => {
    const variantClasses = {
      live: "bg-signal-500/14 text-signal-500",
      solo: "bg-amber-500/14 text-amber-500",
      closed: "bg-transit-500/14 text-transit-500",
    };

    const baseClasses = "inline-flex items-center gap-1.5 font-data text-xs px-2.5 py-1.5 rounded-pill";

    return (
      <span ref={ref} className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
        {variant === "live" && (
          <span className="relative flex-shrink-0" aria-hidden="true">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-500" />
            <span className="absolute inset-[-4px] rounded-full border-1.5 border-signal-500 animate-pulse-ring" />
          </span>
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";