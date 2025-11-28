-- Permitir que admins vejam todos os produtos (inclusive inativos)
-- Isso corrige o erro ao inativar produtos, pois o admin precisa ter permissão de SELECT no produto inativo para que o UPDATE retorne os dados com sucesso.

CREATE POLICY "Allow admins read all products" ON products
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Garantir leitura para categorias e subcategorias também
CREATE POLICY "Allow admins read all categories" ON categories
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Allow admins read all subcategories" ON subcategories
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));
