
-- Inserir usuário administrador diretamente na tabela profiles
-- Nota: Este usuário precisará se registrar normalmente via interface para ter acesso ao auth.users
-- Mas vamos preparar um perfil administrativo que será vinculado quando ele se registrar

-- Primeiro, vamos criar alguns grupos de exemplo para o sistema
INSERT INTO public.grupos (nome, setor, meta_diaria) VALUES
('Corte Principal', 'corte', 300),
('Costura A', 'costura', 250),
('Costura B', 'costura', 200),
('Acabamento Geral', 'acabamento', 180);

-- Inserir algumas ordens de produção de exemplo
INSERT INTO public.ordens_producao (numero_op, produto, tipo_peca, grupo_id, qtde_total_produzida, qtde_total_reprovada, status) 
SELECT 
  'OP-' || LPAD((ROW_NUMBER() OVER())::text, 3, '0'),
  CASE 
    WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 'Camiseta Básica Branca'
    WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 'Calça Jeans Masculina'
    WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 'Blusa Social Feminina'
    ELSE 'Vestido Casual'
  END,
  CASE 
    WHEN ROW_NUMBER() OVER() % 3 = 1 THEN 'Superior'
    WHEN ROW_NUMBER() OVER() % 3 = 2 THEN 'Inferior'
    ELSE 'Vestido'
  END,
  g.id,
  FLOOR(RANDOM() * 200 + 50)::integer,
  FLOOR(RANDOM() * 20)::integer,
  CASE 
    WHEN ROW_NUMBER() OVER() % 3 = 1 THEN 'finalizada'
    WHEN ROW_NUMBER() OVER() % 3 = 2 THEN 'em_andamento'
    ELSE 'aguardando_inspecao'
  END
FROM public.grupos g, generate_series(1, 2) s;

-- Criar função para atualizar perfil quando usuário admin se registrar
CREATE OR REPLACE FUNCTION public.update_admin_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Se o email for do administrador, atualizar para role admin
  IF NEW.email = 'contato@guilhermehorstmann.com.br' THEN
    UPDATE public.profiles 
    SET role = 'admin'::user_role,
        nome = 'Administrador Conffec'
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger para atualizar perfil do admin automaticamente
CREATE TRIGGER on_admin_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  WHEN (NEW.email = 'contato@guilhermehorstmann.com.br')
  EXECUTE PROCEDURE public.update_admin_profile();

-- Adicionar campos de prazo e meta nas ordens de produção
ALTER TABLE public.ordens_producao 
ADD COLUMN prazo_entrega DATE,
ADD COLUMN meta_producao INTEGER DEFAULT 0;

-- Atualizar OPs existentes com prazos e metas
UPDATE public.ordens_producao 
SET prazo_entrega = CURRENT_DATE + INTERVAL '7 days',
    meta_producao = 200
WHERE prazo_entrega IS NULL;
