import type { ChangeEvent, KeyboardEvent } from "react";
import { Input } from "../ui/Input";
import { FaMagnifyingGlassArrowRight } from "react-icons/fa6";

export interface SearchFieldProps {
  placeholder?: string;
  onClick?: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  submit?: () => void;
  value?: string;
}

export function SearchField({
  placeholder = "Search for your favorite places...",
  onClick,
  onChange,
  value,
  submit,
}: SearchFieldProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    submit?.();
  };

  return (
    <div role="search" className="flex gap-x-2 p-2 items-center">
      <Input
        type="search"
        placeholder={placeholder}
        onClick={onClick}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        value={value}
        className="cursor-pointer"
        autoComplete="off"
      />
      <button
        type="button"
        onClick={submit}
        aria-label="Search"
        className="bg-accent-fill hover:bg-amber-600 transition-standard rounded-lg p-2 flex items-center justify-center"
      >
        <FaMagnifyingGlassArrowRight className="text-on-accent" size={24} />
      </button>
    </div>
  );
}
