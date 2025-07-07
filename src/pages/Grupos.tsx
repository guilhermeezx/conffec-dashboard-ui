
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useGrupos } from "@/hooks/useGrupos";
import { Users, Target, Building } from "lucide-react";
import CriarGrupoDialog from "@/components/grupos/CriarGrupoDialog";
import GruposTable from "@/components/grupos/GruposTable";
import { MetricCard } from "@/components/ui/metric-card";

const Grupos = () => {
  const { canManageGroups } = useAuth();
  const { data: grupos } = useGrupos();

  // Calcular estatísticas
  const totalGrupos = grupos?.length || 0;
  const gruposComMeta = grupos?.filter(g => g.meta_diaria && g.meta_diaria > 0).length || 0;
  const setoresUnicos = new Set(grupos?.map(g => g.setor)).size;
  const metaMediaDiaria = grupos?.length 
    ? Math.round(grupos
        .filter(g => g.meta_diaria && g.meta_diaria > 0)
        .reduce((acc, g) => acc + (g.meta_diaria || 0), 0) / gruposComMeta) || 0
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Grupos</h1>
          <p className="text-muted-foreground">Gerencie os grupos de trabalho da empresa</p>
        </div>
        
        {canManageGroups() && <CriarGrupoDialog />}
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Grupos"
          value={totalGrupos}
          icon={Users}
        />
        
        <MetricCard
          title="Grupos com Meta"
          value={gruposComMeta}
          subtitle={`de ${totalGrupos} grupos`}
          icon={Target}
        />
        
        <MetricCard
          title="Setores Ativos"
          value={setoresUnicos}
          icon={Building}
        />
        
        <MetricCard
          title="Meta Média Diária"
          value={metaMediaDiaria}
          subtitle="peças por dia"
          icon={Target}
        />
      </div>

      {/* Tabela de Grupos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Grupos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os grupos de trabalho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GruposTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Grupos;
