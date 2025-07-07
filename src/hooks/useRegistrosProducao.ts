
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RegistroProducao {
  id: string;
  op_id: string;
  grupo_id: string;
  responsavel_id: string;
  qtde_produzida: number;
  qtde_reprovada?: number;
  observacoes?: string;
  status_inspecao?: string;
  motivo_reprovacao?: string;
  data_registro: string;
  aprovado_por?: string;
  data_aprovacao?: string;
  grupos?: {
    id: string;
    nome: string;
    setor: string;
  };
  responsavel?: {
    id: string;
    nome: string;
    email: string;
  };
  aprovador?: {
    id: string;
    nome: string;
    email: string;
  };
}

export const useRegistrosProducao = (opId?: string, grupoId?: string, status?: string) => {
  return useQuery({
    queryKey: ['registros-producao', opId, grupoId, status],
    queryFn: async () => {
      let query = supabase
        .from('registros_producao')
        .select(`
          *,
          grupos:grupo_id (
            id,
            nome,
            setor
          ),
          responsavel:responsavel_id (
            id,
            nome,
            email
          ),
          aprovador:aprovado_por (
            id,
            nome,
            email
          )
        `)
        .order('data_registro', { ascending: false });

      if (opId) {
        query = query.eq('op_id', opId);
      }

      if (grupoId) {
        query = query.eq('grupo_id', grupoId);
      }

      if (status) {
        query = query.eq('status_inspecao', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar registros de produção:', error);
        throw error;
      }

      return data as any[] as RegistroProducao[];
    }
  });
};

export const useCreateRegistroProducao = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (registroData: {
      op_id: string;
      grupo_id: string;
      responsavel_id: string;
      qtde_produzida: number;
      qtde_reprovada?: number;
      observacoes?: string;
    }) => {
      const { data, error } = await supabase
        .from('registros_producao')
        .insert([registroData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registros-producao'] });
      queryClient.invalidateQueries({ queryKey: ['ordens-producao'] });
      toast({
        title: "Produção registrada!",
        description: "O registro de produção foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao registrar produção:', error);
      toast({
        title: "Erro ao registrar produção",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useAprovarRegistro = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, aprovado_por }: { id: string; aprovado_por: string }) => {
      const { data, error } = await supabase
        .from('registros_producao')
        .update({
          status_inspecao: 'aprovado',
          aprovado_por,
          data_aprovacao: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registros-producao'] });
      toast({
        title: "Registro aprovado!",
        description: "A produção foi aprovada com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao aprovar registro:', error);
      toast({
        title: "Erro ao aprovar registro",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useReprovarRegistro = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      aprovado_por, 
      motivo_reprovacao 
    }: { 
      id: string; 
      aprovado_por: string; 
      motivo_reprovacao: string; 
    }) => {
      const { data, error } = await supabase
        .from('registros_producao')
        .update({
          status_inspecao: 'reprovado',
          aprovado_por,
          data_aprovacao: new Date().toISOString(),
          motivo_reprovacao
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registros-producao'] });
      toast({
        title: "Registro reprovado",
        description: "A produção foi reprovada e ficará disponível para reprocessamento.",
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao reprovar registro:', error);
      toast({
        title: "Erro ao reprovar registro",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  });
};
