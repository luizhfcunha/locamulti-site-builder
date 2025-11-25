-- 1. Criar enum de role (apenas admin)
CREATE TYPE app_role AS ENUM ('admin');

-- 2. Criar tabela user_roles
CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 3. Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Função segura para verificar role (SECURITY DEFINER evita recursão)
CREATE OR REPLACE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- 5. Atribuir role admin ao usuário inicial
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'admin@locamulti.com.br'
ON CONFLICT DO NOTHING;

-- 6. Atualizar RLS policies em products (substituir authenticated por admin)
DROP POLICY IF EXISTS "Allow authenticated insert to products" ON products;
DROP POLICY IF EXISTS "Allow authenticated update to products" ON products;
DROP POLICY IF EXISTS "Allow authenticated delete from products" ON products;

CREATE POLICY "Allow admins insert to products" ON products
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Allow admins update to products" ON products
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Allow admins delete from products" ON products
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- 7. Atualizar RLS policies em categories
DROP POLICY IF EXISTS "Allow authenticated insert to categories" ON categories;
DROP POLICY IF EXISTS "Allow authenticated update to categories" ON categories;
DROP POLICY IF EXISTS "Allow authenticated delete from categories" ON categories;

CREATE POLICY "Allow admins insert to categories" ON categories
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Allow admins update to categories" ON categories
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Allow admins delete from categories" ON categories
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- 8. Atualizar RLS policies em subcategories
DROP POLICY IF EXISTS "Allow authenticated insert to subcategories" ON subcategories;
DROP POLICY IF EXISTS "Allow authenticated update to subcategories" ON subcategories;
DROP POLICY IF EXISTS "Allow authenticated delete from subcategories" ON subcategories;

CREATE POLICY "Allow admins insert to subcategories" ON subcategories
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Allow admins update to subcategories" ON subcategories
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Allow admins delete from subcategories" ON subcategories
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- 9. RLS policy para user_roles (usuários veem apenas seu próprio role)
CREATE POLICY "Users can view own role" ON user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());