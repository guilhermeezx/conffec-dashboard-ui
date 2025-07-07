
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Grupo {
  id: string;
  nome: string;
  setor: string;
  meta_diaria?: number;
  created_at: string;
  updated_at: string;
}

export const useGrupos = () => {
  return useQuery({
    queryKey: ['grupos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grupos')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar grupos:', error);
        throw error;
      }

      return data as Grupo[];
    }
  });
};

export const useGrupo = (id: string) => {
  return useQuery({
    queryKey: ['grupo', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grupos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar grupo:', error);
        throw error;
      }

      return data as Grupo;
    },
    enabled: !!id
  });
};
