
-- Criar enum para tipos de usuário
CREATE TYPE public.user_role AS ENUM (
  'admin',
  'ceo', 
  'encarregado',
  'lider_grupo',
  'inspetor',
  'financeiro',
  'colaborador'
);

-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE,
  telefone TEXT,
  data_admissao DATE,
  situacao TEXT DEFAULT 'ativo' CHECK (situacao IN ('ativo', 'inativo')),
  role user_role NOT NULL DEFAULT 'colaborador',
  grupo_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar tabela de grupos
CREATE TABLE public.grupos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  setor TEXT NOT NULL CHECK (setor IN ('corte', 'costura', 'acabamento')),
  meta_diaria INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar tabela de ordens de produção
CREATE TABLE public.ordens_producao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_op TEXT NOT NULL UNIQUE,
  produto TEXT NOT NULL,
  tipo_peca TEXT,
  grupo_id UUID REFERENCES public.grupos(id),
  qtde_total_produzida INTEGER DEFAULT 0,
  qtde_total_reprovada INTEGER DEFAULT 0,
  status TEXT DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'aguardando_inspecao', 'finalizada')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar tabela de registros de produção
CREATE TABLE public.registros_producao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  op_id UUID NOT NULL REFERENCES public.ordens_producao(id) ON DELETE CASCADE,
  grupo_id UUID NOT NULL REFERENCES public.grupos(id),
  responsavel_id UUID NOT NULL REFERENCES public.profiles(id),
  qtde_produzida INTEGER NOT NULL,
  qtde_reprovada INTEGER DEFAULT 0,
  observacoes TEXT,
  status_inspecao TEXT DEFAULT 'pendente' CHECK (status_inspecao IN ('pendente', 'aprovado', 'reprovado')),
  motivo_reprovacao TEXT,
  data_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  aprovado_por UUID REFERENCES public.profiles(id),
  data_aprovacao TIMESTAMP WITH TIME ZONE
);

-- Criar tabela de metas
CREATE TABLE public.metas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grupo_id UUID REFERENCES public.grupos(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('diaria', 'semanal', 'mensal')),
  valor_meta INTEGER NOT NULL,
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar tabela de documentos
CREATE TABLE public.documentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  colaborador_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tipo_documento TEXT NOT NULL CHECK (tipo_documento IN ('rg', 'cpf', 'contrato', 'exame', 'abvtex', 'outros')),
  nome_arquivo TEXT NOT NULL,
  url_arquivo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar tabela de logs de auditoria
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  acao TEXT NOT NULL,
  tabela TEXT,
  registro_id UUID,
  dados_anteriores JSONB,
  dados_novos JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Adicionar referência de grupo_id na tabela profiles
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_grupo 
FOREIGN KEY (grupo_id) REFERENCES public.grupos(id);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordens_producao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_producao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Função para verificar roles do usuário
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
      AND situacao = 'ativo'
  )
$$;

-- Função para verificar se é admin ou CEO
CREATE OR REPLACE FUNCTION public.is_admin_or_ceo(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role IN ('admin', 'ceo')
      AND situacao = 'ativo'
  )
$$;

-- Políticas RLS para profiles
CREATE POLICY "Admins e CEOs podem ver todos os perfis"
ON public.profiles FOR SELECT
USING (public.is_admin_or_ceo(auth.uid()));

CREATE POLICY "Usuários podem ver próprio perfil"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins e CEOs podem inserir perfis"
ON public.profiles FOR INSERT
WITH CHECK (public.is_admin_or_ceo(auth.uid()));

CREATE POLICY "Admins e CEOs podem atualizar perfis"
ON public.profiles FOR UPDATE
USING (public.is_admin_or_ceo(auth.uid()));

CREATE POLICY "Usuários podem atualizar próprio perfil"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Políticas RLS para grupos
CREATE POLICY "Todos usuários autenticados podem ver grupos"
ON public.grupos FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins, CEOs e Encarregados podem gerenciar grupos"
ON public.grupos FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'ceo') OR 
  public.has_role(auth.uid(), 'encarregado')
);

-- Políticas RLS para ordens de produção
CREATE POLICY "Todos usuários autenticados podem ver OPs"
ON public.ordens_producao FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins, CEOs e Encarregados podem gerenciar OPs"
ON public.ordens_producao FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'ceo') OR 
  public.has_role(auth.uid(), 'encarregado')
);

-- Políticas RLS para registros de produção
CREATE POLICY "Todos usuários autenticados podem ver registros"
ON public.registros_producao FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Líderes podem registrar produção"
ON public.registros_producao FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'ceo') OR 
  public.has_role(auth.uid(), 'encarregado') OR
  public.has_role(auth.uid(), 'lider_grupo')
);

CREATE POLICY "Inspetores podem aprovar/reprovar"
ON public.registros_producao FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'ceo') OR 
  public.has_role(auth.uid(), 'inspetor')
);

-- Políticas RLS para metas
CREATE POLICY "Todos usuários autenticados podem ver metas"
ON public.metas FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins, CEOs e Encarregados podem gerenciar metas"
ON public.metas FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'ceo') OR 
  public.has_role(auth.uid(), 'encarregado')
);

-- Políticas RLS para documentos (apenas Admin)
CREATE POLICY "Apenas admins podem acessar documentos"
ON public.documentos FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para audit logs
CREATE POLICY "Admins e CEOs podem ver logs"
ON public.audit_logs FOR SELECT
USING (public.is_admin_or_ceo(auth.uid()));

-- Função para criar perfil automaticamente ao registrar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.email),
    'colaborador'
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Criar bucket para documentos no storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documentos', 'documentos', false);

-- Política de storage para documentos (apenas admin)
CREATE POLICY "Apenas admins podem acessar documentos no storage"
ON storage.objects FOR ALL
USING (
  bucket_id = 'documentos' AND 
  public.has_role(auth.uid(), 'admin')
);
