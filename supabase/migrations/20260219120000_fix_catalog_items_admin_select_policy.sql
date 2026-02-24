-- Fix: permitir SELECT de admins em catalog_items mesmo quando active = false
-- Motivo: updates que inativam item podem falhar sem policy de leitura administrativa.

DROP POLICY IF EXISTS "Allow admins read all catalog_items" ON public.catalog_items;

CREATE POLICY "Allow admins read all catalog_items"
ON public.catalog_items
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
