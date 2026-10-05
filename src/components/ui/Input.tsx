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
          <label htmlFor={inputId} className="block text-label-s text-slate-400 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3.5
            bg-dusk-800 border-1.5 border-dusk-600 rounded-md
            text-fog-050 placeholder-slate-400 text-base font-body
            transition-standard focus-visible-ring
            focus:border-amber-500 focus:bg-dusk-700
            ${error ? "border-transit-500" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-transit-500 font-data">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";