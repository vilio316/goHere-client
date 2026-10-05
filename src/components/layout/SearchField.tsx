import { Input } from "../ui/Input";

export interface SearchFieldProps {
  placeholder?: string;
  onClick?: () => void;
  onChange?: (value: string) => void;
  value?: string;
}

export function SearchField({ placeholder = "Search or explore…", onClick, onChange, value }: SearchFieldProps) {
  return (
    <Input
      type="search"
      placeholder={placeholder}
      onClick={onClick}
      onChange={(e) => onChange?.(e.target.value)}
      value={value}
      className="cursor-pointer"
      autoComplete="off"
    />
  );
}