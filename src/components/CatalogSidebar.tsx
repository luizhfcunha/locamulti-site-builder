import { useState } from "react";
import { SearchInput } from "@/components/SearchInput";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface FilterGroup {
  id: string;
  label: string;
  options: { id: string; label: string }[];
}

interface CatalogSidebarProps {
  categories?: FilterGroup;
  brands?: FilterGroup;
  voltages?: FilterGroup;
  applications?: FilterGroup;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

export const CatalogSidebar = ({
  categories,
  brands,
  voltages,
  applications,
  onSearch,
  onFilterChange,
}: CatalogSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    categories: [],
    brands: [],
    voltages: [],
    applications: [],
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterToggle = (groupId: string, optionId: string) => {
    const newFilters = { ...selectedFilters };
    const group = newFilters[groupId] || [];
    
    if (group.includes(optionId)) {
      newFilters[groupId] = group.filter((id) => id !== optionId);
    } else {
      newFilters[groupId] = [...group, optionId];
    }
    
    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const FilterSection = ({ title, groupId, options }: { title: string; groupId: string; options: { id: string; label: string }[] }) => (
    <div className="space-y-3">
      <Label className="font-heading font-bold text-base text-foreground">{title}</Label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <Checkbox
              id={`${groupId}-${option.id}`}
              checked={selectedFilters[groupId]?.includes(option.id)}
              onCheckedChange={() => handleFilterToggle(groupId, option.id)}
            />
            <label
              htmlFor={`${groupId}-${option.id}`}
              className="text-sm text-foreground cursor-pointer hover:text-primary transition-colors"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <aside className="w-full lg:w-80 bg-background border-r border-border">
      <div className="sticky top-24 p-6">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-6 pr-4">
            {/* Search */}
            <div>
              <SearchInput
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar equipamentos..."
              />
            </div>

            <Separator />

            {/* Categories */}
            {categories && (
              <>
                <FilterSection
                  title="Categorias"
                  groupId="categories"
                  options={categories.options}
                />
                <Separator />
              </>
            )}

            {/* Brands */}
            {brands && (
              <>
                <FilterSection
                  title="Marcas"
                  groupId="brands"
                  options={brands.options}
                />
                <Separator />
              </>
            )}

            {/* Voltages */}
            {voltages && (
              <>
                <FilterSection
                  title="Tensão"
                  groupId="voltages"
                  options={voltages.options}
                />
                <Separator />
              </>
            )}

            {/* Applications */}
            {applications && (
              <>
                <FilterSection
                  title="Aplicação"
                  groupId="applications"
                  options={applications.options}
                />
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};
