export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          acao: string
          created_at: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          id: string
          registro_id: string | null
          tabela: string | null
          user_id: string
        }
        Insert: {
          acao: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          registro_id?: string | null
          tabela?: string | null
          user_id: string
        }
        Update: {
          acao?: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          registro_id?: string | null
          tabela?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          colaborador_id: string | null
          created_at: string
          id: string
          nome_arquivo: string
          tipo_documento: string
          url_arquivo: string
        }
        Insert: {
          colaborador_id?: string | null
          created_at?: string
          id?: string
          nome_arquivo: string
          tipo_documento: string
          url_arquivo: string
        }
        Update: {
          colaborador_id?: string | null
          created_at?: string
          id?: string
          nome_arquivo?: string
          tipo_documento?: string
          url_arquivo?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      grupos: {
        Row: {
          created_at: string
          id: string
          meta_diaria: number | null
          nome: string
          setor: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          meta_diaria?: number | null
          nome: string
          setor: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          meta_diaria?: number | null
          nome?: string
          setor?: string
          updated_at?: string
        }
        Relationships: []
      }
      metas: {
        Row: {
          created_at: string
          grupo_id: string | null
          id: string
          periodo_fim: string
          periodo_inicio: string
          tipo: string
          valor_meta: number
        }
        Insert: {
          created_at?: string
          grupo_id?: string | null
          id?: string
          periodo_fim: string
          periodo_inicio: string
          tipo: string
          valor_meta: number
        }
        Update: {
          created_at?: string
          grupo_id?: string | null
          id?: string
          periodo_fim?: string
          periodo_inicio?: string
          tipo?: string
          valor_meta?: number
        }
        Relationships: [
          {
            foreignKeyName: "metas_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_producao: {
        Row: {
          created_at: string
          grupo_id: string | null
          id: string
          meta_producao: number | null
          numero_op: string
          prazo_entrega: string | null
          produto: string
          qtde_total_produzida: number | null
          qtde_total_reprovada: number | null
          status: string | null
          tipo_peca: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          grupo_id?: string | null
          id?: string
          meta_producao?: number | null
          numero_op: string
          prazo_entrega?: string | null
          produto: string
          qtde_total_produzida?: number | null
          qtde_total_reprovada?: number | null
          status?: string | null
          tipo_peca?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          grupo_id?: string | null
          id?: string
          meta_producao?: number | null
          numero_op?: string
          prazo_entrega?: string | null
          produto?: string
          qtde_total_produzida?: number | null
          qtde_total_reprovada?: number | null
          status?: string | null
          tipo_peca?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordens_producao_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cpf: string | null
          created_at: string
          data_admissao: string | null
          email: string
          grupo_id: string | null
          id: string
          nome: string
          role: Database["public"]["Enums"]["user_role"]
          situacao: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          email: string
          grupo_id?: string | null
          id: string
          nome: string
          role?: Database["public"]["Enums"]["user_role"]
          situacao?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          email?: string
          grupo_id?: string | null
          id?: string
          nome?: string
          role?: Database["public"]["Enums"]["user_role"]
          situacao?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_grupo"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_producao: {
        Row: {
          aprovado_por: string | null
          data_aprovacao: string | null
          data_registro: string
          grupo_id: string
          id: string
          motivo_reprovacao: string | null
          observacoes: string | null
          op_id: string
          qtde_produzida: number
          qtde_reprovada: number | null
          responsavel_id: string
          status_inspecao: string | null
        }
        Insert: {
          aprovado_por?: string | null
          data_aprovacao?: string | null
          data_registro?: string
          grupo_id: string
          id?: string
          motivo_reprovacao?: string | null
          observacoes?: string | null
          op_id: string
          qtde_produzida: number
          qtde_reprovada?: number | null
          responsavel_id: string
          status_inspecao?: string | null
        }
        Update: {
          aprovado_por?: string | null
          data_aprovacao?: string | null
          data_registro?: string
          grupo_id?: string
          id?: string
          motivo_reprovacao?: string | null
          observacoes?: string | null
          op_id?: string
          qtde_produzida?: number
          qtde_reprovada?: number | null
          responsavel_id?: string
          status_inspecao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registros_producao_aprovado_por_fkey"
            columns: ["aprovado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_producao_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_producao_op_id_fkey"
            columns: ["op_id"]
            isOneToOne: false
            referencedRelation: "ordens_producao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_producao_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin_or_ceo: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role:
        | "admin"
        | "ceo"
        | "encarregado"
        | "lider_grupo"
        | "inspetor"
        | "financeiro"
        | "colaborador"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: [
        "admin",
        "ceo",
        "encarregado",
        "lider_grupo",
        "inspetor",
        "financeiro",
        "colaborador",
      ],
    },
  },
} as const
