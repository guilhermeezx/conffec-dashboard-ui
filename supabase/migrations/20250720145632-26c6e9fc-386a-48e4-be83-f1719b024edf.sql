-- Primeiro, vamos verificar e recriar a função de atualização dos totais
-- para garantir que ela está funcionando corretamente
CREATE OR REPLACE FUNCTION update_production_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Update totals for the affected ordem de produção
  UPDATE ordens_producao 
  SET 
    qtde_total_produzida = (
      SELECT COALESCE(SUM(qtde_produzida), 0) 
      FROM registros_producao 
      WHERE op_id = COALESCE(NEW.op_id, OLD.op_id)
        AND status_inspecao = 'aprovado'
    ),
    qtde_total_reprovada = (
      SELECT COALESCE(SUM(qtde_reprovada), 0) 
      FROM registros_producao 
      WHERE op_id = COALESCE(NEW.op_id, OLD.op_id)
        AND qtde_reprovada IS NOT NULL
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.op_id, OLD.op_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Recriar os triggers para garantir que funcionem
DROP TRIGGER IF EXISTS trigger_update_production_totals_insert ON registros_producao;
DROP TRIGGER IF EXISTS trigger_update_production_totals_update ON registros_producao;
DROP TRIGGER IF EXISTS trigger_update_production_totals_delete ON registros_producao;

-- Create trigger for INSERT
CREATE TRIGGER trigger_update_production_totals_insert
  AFTER INSERT ON registros_producao
  FOR EACH ROW
  EXECUTE FUNCTION update_production_totals();

-- Create trigger for UPDATE  
CREATE TRIGGER trigger_update_production_totals_update
  AFTER UPDATE ON registros_producao
  FOR EACH ROW
  EXECUTE FUNCTION update_production_totals();

-- Create trigger for DELETE
CREATE TRIGGER trigger_update_production_totals_delete
  AFTER DELETE ON registros_producao
  FOR EACH ROW
  EXECUTE FUNCTION update_production_totals();

-- Agora vamos adicionar uma nova tabela para colaboradores individuais
-- que não fazem parte de grupos de produção (revisores, acabamento, etc.)
CREATE TABLE IF NOT EXISTS public.colaboradores_individuais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  funcao TEXT NOT NULL, -- revisor, acabamento, inspetor, etc.
  tipo_remuneracao TEXT NOT NULL DEFAULT 'fixo', -- fixo, por_peca
  valor_por_peca DECIMAL(10,2), -- apenas se tipo_remuneracao = 'por_peca'
  situacao TEXT NOT NULL DEFAULT 'ativo',
  data_admissao DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.colaboradores_individuais ENABLE ROW LEVEL SECURITY;

-- Create policies for colaboradores_individuais
CREATE POLICY "Admins e CEOs podem gerenciar colaboradores individuais"
ON public.colaboradores_individuais
FOR ALL
USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'ceo'::user_role));

CREATE POLICY "Todos usuários autenticados podem ver colaboradores individuais"
ON public.colaboradores_individuais
FOR SELECT
USING (true);

-- Create function to update updated_at column for colaboradores_individuais
CREATE OR REPLACE FUNCTION public.update_colaboradores_individuais_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on colaboradores_individuais
CREATE TRIGGER update_colaboradores_individuais_updated_at
  BEFORE UPDATE ON public.colaboradores_individuais
  FOR EACH ROW
  EXECUTE FUNCTION public.update_colaboradores_individuais_updated_at();