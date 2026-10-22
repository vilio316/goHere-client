import { Input } from "../ui/Input";
import { FaMagnifyingGlassArrowRight } from "react-icons/fa6";
export interface SearchFieldProps {
  placeholder?: string;
  onClick?: () => void;
  onChange?: (e: any) => void;
  submit?: () => void;
  value?: string;
}

export function SearchField({ placeholder = "Search for your favorite places...", onClick, onChange, value, submit }: SearchFieldProps) {
  return (
    <div className="flex gap-x-2 p-2 items-center">
    <Input
      type="search"
      placeholder={placeholder}
      onClick={onClick}
      onChange={onChange}
      value={value}
      className="cursor-pointer"
      autoComplete="off"
    />
    <button type="submit" onClick={submit} className="bg-amber-500 hover:bg-amber-600 transition-standard rounded-lg p-2 flex items-center justify-center">
      <FaMagnifyingGlassArrowRight className="text-fog-050" size={24} />
    </button>
    </div>

  );
}