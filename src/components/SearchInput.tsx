import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { forwardRef } from "react";

interface SearchInputProps extends React.ComponentProps<typeof Input> {
  placeholder?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = "Buscar equipamentos...", className, ...props }, ref) => {
    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className={`pl-10 rounded-input ${className || ""}`}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
