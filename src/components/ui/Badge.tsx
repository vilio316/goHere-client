import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "live" | "solo" | "closed";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = "live", className = "", ...props }, ref) => {
    const variantClasses = {
      live: "bg-badge-live-bg text-badge-live-text",
      solo: "bg-badge-solo-bg text-badge-solo-text",
      closed: "bg-badge-closed-bg text-badge-closed-text",
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