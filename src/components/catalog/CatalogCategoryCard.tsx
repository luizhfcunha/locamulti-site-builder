import { ChevronRight, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import type { CatalogCategory } from "@/lib/catalogNew";

interface CatalogCategoryCardProps {
  category: CatalogCategory;
}

export function CatalogCategoryCard({ category }: CatalogCategoryCardProps) {
  return (
    <Link
      to={`/catalogo/${category.category_slug}`}
      className="group block bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {category.category_name}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {category.item_count} {category.item_count === 1 ? 'item' : 'itens'} disponíveis
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
