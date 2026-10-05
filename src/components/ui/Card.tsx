import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = "default", className = "", ...props }, ref) => {
    const variantClasses = {
      default: "bg-dusk-800 border border-dusk-600",
      elevated: "bg-dusk-800 border border-dusk-600 shadow-[0_16px_30px_rgba(0,0,0,0.35)]",
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
          background: "linear-gradient(135deg, rgba(242, 166, 61, 0.4), rgba(52, 211, 153, 0.2)), linear-gradient(0deg, var(--color-dusk-950), var(--color-dusk-700))",
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
        className={`flex justify-between items-center pt-3 border-t border-dusk-600 font-data text-xs text-fog-100 ${className}`}
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