import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Meta {
  id: string;
  grupo_id?: string;
  valor_meta: number;
  periodo_inicio: string;
  periodo_fim: string;
  tipo: string;
  created_at: string;
}

export interface MetaCompleta extends Meta {
  grupos?: {
    id: string;
    nome: string;
    setor: string;
  };
}

export const useMetas = () => {
  return useQuery({
    queryKey: ['metas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('metas')
        .select(`
          *,
          grupos (
            id,
            nome,
            setor
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar metas:', error);
        throw error;
      }

      return data as MetaCompleta[];
    }
  });
};

export const useCreateMeta = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (metaData: {
      grupo_id?: string;
      valor_meta: number;
      periodo_inicio: string;
      periodo_fim: string;
      tipo: string;
    }) => {
      const { data, error } = await supabase
        .from('metas')
        .insert([metaData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas'] });
      toast({
        title: "Meta criada com sucesso!",
        description: "A nova meta foi adicionada ao sistema.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao criar meta:', error);
      toast({
        title: "Erro ao criar meta",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateMeta = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { 
      id: string; 
      grupo_id?: string;
      valor_meta?: number;
      periodo_inicio?: string;
      periodo_fim?: string;
      tipo?: string;
    }) => {
      const { data, error } = await supabase
        .from('metas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas'] });
      toast({
        title: "Meta atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar meta:', error);
      toast({
        title: "Erro ao atualizar meta",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useDeleteMeta = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('metas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas'] });
      toast({
        title: "Meta excluída",
        description: "A meta foi removida do sistema.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao deletar meta:', error);
      toast({
        title: "Erro ao excluir meta",
        description: "Não foi possível excluir a meta.",
        variant: "destructive",
      });
    }
  });
};

// Hook para buscar produção realizada de um grupo em um período
export const useProducaoRealizada = (grupoId?: string, dataInicio?: string, dataFim?: string) => {
  return useQuery({
    queryKey: ['producao-realizada', grupoId, dataInicio, dataFim],
    queryFn: async () => {
      if (!grupoId || !dataInicio || !dataFim) return 0;

      const { data, error } = await supabase
        .from('registros_producao')
        .select('qtde_produzida')
        .eq('grupo_id', grupoId)
        .eq('status_inspecao', 'aprovado')
        .gte('data_registro', dataInicio)
        .lte('data_registro', dataFim);

      if (error) {
        console.error('Erro ao buscar produção realizada:', error);
        throw error;
      }

      return data.reduce((total, registro) => total + (registro.qtde_produzida || 0), 0);
    },
    enabled: !!grupoId && !!dataInicio && !!dataFim
  });
};