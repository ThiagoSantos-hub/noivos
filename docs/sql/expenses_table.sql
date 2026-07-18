-- Tabela de despesas do casamento
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_expenses_couple_id ON expenses(couple_id);

-- Habilitar RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "expenses_select_own" ON expenses
  FOR SELECT USING (couple_id = auth.uid());

CREATE POLICY "expenses_insert_own" ON expenses
  FOR INSERT WITH CHECK (couple_id = auth.uid());

CREATE POLICY "expenses_update_own" ON expenses
  FOR UPDATE USING (couple_id = auth.uid());

CREATE POLICY "expenses_delete_own" ON expenses
  FOR DELETE USING (couple_id = auth.uid());
