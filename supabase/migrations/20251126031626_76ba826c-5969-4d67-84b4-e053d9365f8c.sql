-- Garantir que RLS está habilitado
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Remover política antiga se existir
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;

-- Apenas leitura: usuários podem ver seus próprios roles
CREATE POLICY "Users can view own roles"
ON user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Inserção/Atualização/Deleção: BLOQUEADO para todos
-- (Sem política = sem permissão, apenas service_role pode gerenciar)