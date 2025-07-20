
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCheck, UserX, Clock } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { useAuth } from "@/hooks/useAuth";
import { useColaboradoresIndividuais } from "@/hooks/useColaboradoresIndividuais";
import CriarColaboradorDialog from "@/components/colaboradores/CriarColaboradorDialog";
import ColaboradoresIndividuaisTable from "@/components/colaboradores/ColaboradoresIndividuaisTable";

const Colaboradores = () => {
  const { canManageGroups } = useAuth();
  const { data: colaboradores } = useColaboradoresIndividuais();

  // Calcular estatísticas
  const totalColaboradores = colaboradores?.length || 0;
  const colaboradoresAtivos = colaboradores?.filter(c => c.situacao === 'ativo').length || 0;
  const colaboradoresInativos = colaboradores?.filter(c => c.situacao === 'inativo').length || 0;
  const colaboradoresLicenca = colaboradores?.filter(c => c.situacao === 'licenca').length || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Colaboradores</h1>
          <p className="text-muted-foreground">Gerencie os colaboradores da empresa</p>
        </div>
        
        {canManageGroups() && <CriarColaboradorDialog />}
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Colaboradores"
          value={totalColaboradores}
          icon={Users}
        />
        
        <MetricCard
          title="Ativos"
          value={colaboradoresAtivos}
          icon={UserCheck}
        />
        
        <MetricCard
          title="Inativos"
          value={colaboradoresInativos}
          icon={UserX}
        />
        
        <MetricCard
          title="Em Licença"
          value={colaboradoresLicenca}
          subtitle="temporária ou médica"
          icon={Clock}
        />
      </div>

      {/* Conteúdo Principal */}
      <Tabs defaultValue="individuais" className="space-y-4">
        <TabsList>
          <TabsTrigger value="individuais">Colaboradores Individuais</TabsTrigger>
          <TabsTrigger value="grupos">Grupos de Produção</TabsTrigger>
        </TabsList>

        <TabsContent value="individuais" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Colaboradores Individuais</CardTitle>
              <CardDescription>
                Colaboradores que não fazem parte de grupos de produção (revisores, acabamento, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ColaboradoresIndividuaisTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grupos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grupos de Produção</CardTitle>
              <CardDescription>
                Colaboradores organizados em grupos de produção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Funcionalidade em desenvolvimento</p>
                <p className="text-sm">Em breve você poderá ver os colaboradores dos grupos aqui.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Colaboradores;
