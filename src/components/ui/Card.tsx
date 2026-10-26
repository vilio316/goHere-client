import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = "default", className = "", ...props }, ref) => {
    const variantClasses = {
      default: "bg-surface-raised border border-border-subtle shadow-card",
      elevated: "bg-surface-raised border border-border-subtle shadow-card-elevated",
    };

    return (
      <div
        ref={ref}
        className={`${variantClasses[variant]} rounded-lg overflow-hidden transition-sheet ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardPhoto = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        style={{
          height: "160px",
          background: "var(--photo-gradient)",
          ...style,
        }}
        {...props}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"30\" cy=\"30\" r=\"20\" fill=\"%23F2A63D\" opacity=\"0.1\"/><circle cx=\"80\" cy=\"70\" r=\"30\" fill=\"%2334D399\" opacity=\"0.08\"/></svg>')",
          }}
        />
        <div className="relative z-10 h-full flex items-end justify-between p-4">{children}</div>
      </div>
    );
  }
);

CardPhoto.displayName = "CardPhoto";

export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div ref={ref} className={`p-4 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = "CardBody";

export const CardMeta = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`grid justify-between items-center pt-3 border-t border-border-subtle font-data text-xs text-text-meta ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardMeta.displayName = "CardMeta";

export const CardActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div ref={ref} className={`flex gap-3 mt-4 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardActions.displayName = "CardActions";