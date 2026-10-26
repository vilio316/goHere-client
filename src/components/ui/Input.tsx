import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-label-s text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3.5
            bg-surface-raised border-1.5 border-border-strong rounded-md
            text-text-primary placeholder:text-text-secondary text-base font-body
            transition-standard focus-visible-ring
            focus:border-accent-text focus:bg-surface-input-focus
            ${error ? "border-alert-text" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-alert-text font-data">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";