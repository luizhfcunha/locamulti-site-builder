-- STAB-014
-- Geracao automatica de codigo no insert de catalog_items.
-- Formato: CC.FF.III

CREATE OR REPLACE FUNCTION public.generate_catalog_item_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_item_no INTEGER;
  category_part TEXT;
  family_digits TEXT;
  family_part TEXT;
  candidate_code TEXT;
BEGIN
  IF NEW.code IS NOT NULL AND btrim(NEW.code) <> '' THEN
    RETURN NEW;
  END IF;

  -- Evita colisao em criacoes concorrentes da mesma categoria/familia.
  PERFORM pg_advisory_xact_lock(hashtext(COALESCE(NEW.category_slug, '') || ':' || COALESCE(NEW.family_slug, '')));

  IF NEW.item_order IS NULL OR NEW.item_order <= 0 THEN
    SELECT COALESCE(MAX(ci.item_order), 0) + 1
      INTO next_item_no
    FROM public.catalog_items ci
    WHERE ci.category_slug = NEW.category_slug
      AND ci.family_slug = NEW.family_slug;

    NEW.item_order := next_item_no;
  END IF;

  category_part := LPAD(COALESCE(NEW.category_no, 0)::TEXT, 2, '0');
  family_digits := regexp_replace(COALESCE(NEW.family_no, ''), '[^0-9]', '', 'g');
  family_part := LPAD(COALESCE(NULLIF(family_digits, ''), '0'), 2, '0');

  candidate_code := category_part || '.' || family_part || '.' || LPAD(NEW.item_order::TEXT, 3, '0');

  WHILE EXISTS (
    SELECT 1
    FROM public.catalog_items ci
    WHERE ci.code = candidate_code
  ) LOOP
    NEW.item_order := NEW.item_order + 1;
    candidate_code := category_part || '.' || family_part || '.' || LPAD(NEW.item_order::TEXT, 3, '0');
  END LOOP;

  NEW.code := candidate_code;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_generate_catalog_item_code ON public.catalog_items;

CREATE TRIGGER trg_generate_catalog_item_code
BEFORE INSERT ON public.catalog_items
FOR EACH ROW
EXECUTE FUNCTION public.generate_catalog_item_code();

