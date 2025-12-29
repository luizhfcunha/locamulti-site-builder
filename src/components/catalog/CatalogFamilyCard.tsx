import { ChevronRight, Package, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import type { CatalogFamily } from "@/lib/catalogNew";

interface CatalogFamilyCardProps {
  family: CatalogFamily;
}

export function CatalogFamilyCard({ family }: CatalogFamilyCardProps) {
  return (
    <Link
      to={`/catalogo/${family.category_slug}/${family.family_slug}`}
      className="group block bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {family.family_name}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {family.equipment_count > 0 && (
              <span className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                {family.equipment_count} equipamento{family.equipment_count !== 1 && 's'}
              </span>
            )}
            {family.consumable_count > 0 && (
              <span className="flex items-center gap-1 text-accent-foreground/70">
                + {family.consumable_count} consumível{family.consumable_count !== 1 && 'is'}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
