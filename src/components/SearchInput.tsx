import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { forwardRef } from "react";

interface SearchInputProps extends Omit<React.ComponentProps<typeof Input>, 'size'> {
  placeholder?: string;
  inputSize?: "default" | "large";
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = "🔍 Buscar equipamento… Ex: betoneira, andaime, compactador", inputSize = "default", className, ...props }, ref) => {
    const sizeClasses = inputSize === "large" 
      ? "h-12 text-base pl-12" 
      : "h-10 pl-10";
    
    return (
      <div className="relative">
        <Search className={`absolute ${inputSize === "large" ? "left-4" : "left-3"} top-1/2 -translate-y-1/2 ${inputSize === "large" ? "h-5 w-5" : "h-4 w-4"} text-muted-foreground`} />
        <Input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className={`${sizeClasses} rounded-xl border-2 border-border focus:border-primary bg-secondary/30 ${className || ""}`}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
