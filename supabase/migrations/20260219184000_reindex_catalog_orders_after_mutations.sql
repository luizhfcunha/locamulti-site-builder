-- Garantir sequencia continua de ordenacao no catalogo apos inserir/editar/excluir.
-- Reindexa:
-- - category_order (entre categorias)
-- - family_order (dentro da categoria)
-- - item_order (dentro da familia)

CREATE OR REPLACE FUNCTION public.reindex_catalog_orders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 1) Reindexar ordem de categorias (sem alterar category_no)
  WITH categories AS (
    SELECT
      category_slug,
      DENSE_RANK() OVER (
        ORDER BY
          MIN(category_order),
          MIN(category_no),
          category_slug
      ) AS new_category_order
    FROM public.catalog_items
    GROUP BY category_slug
  )
  UPDATE public.catalog_items ci
  SET category_order = c.new_category_order
  FROM categories c
  WHERE ci.category_slug = c.category_slug
    AND ci.category_order IS DISTINCT FROM c.new_category_order;

  -- 2) Reindexar ordem de familias dentro da categoria (sem alterar family_no)
  WITH families AS (
    SELECT
      category_slug,
      family_slug,
      DENSE_RANK() OVER (
        PARTITION BY category_slug
        ORDER BY
          MIN(family_order),
          MIN(family_no),
          family_slug
      ) AS new_family_order
    FROM public.catalog_items
    GROUP BY category_slug, family_slug
  )
  UPDATE public.catalog_items ci
  SET family_order = f.new_family_order
  FROM families f
  WHERE ci.category_slug = f.category_slug
    AND ci.family_slug = f.family_slug
    AND ci.family_order IS DISTINCT FROM f.new_family_order;

  -- 3) Reindexar ordem de itens dentro da familia
  WITH items AS (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY category_slug, family_slug
        ORDER BY
          item_order,
          code,
          id
      ) AS new_item_order
    FROM public.catalog_items
  )
  UPDATE public.catalog_items ci
  SET item_order = i.new_item_order
  FROM items i
  WHERE ci.id = i.id
    AND ci.item_order IS DISTINCT FROM i.new_item_order;
END;
$$;

CREATE OR REPLACE FUNCTION public.reindex_catalog_orders_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Evita recursao quando a propria reindexacao dispara UPDATE.
  IF pg_trigger_depth() > 1 THEN
    RETURN NULL;
  END IF;

  PERFORM public.reindex_catalog_orders();
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_reindex_catalog_orders ON public.catalog_items;

CREATE TRIGGER trg_reindex_catalog_orders
AFTER INSERT OR UPDATE OR DELETE ON public.catalog_items
FOR EACH STATEMENT
EXECUTE FUNCTION public.reindex_catalog_orders_trigger();

-- Normaliza estado atual imediatamente ao aplicar migration.
SELECT public.reindex_catalog_orders();

