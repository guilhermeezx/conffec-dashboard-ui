
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCheck, UserX, Clock, FileText } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { useAuth } from "@/hooks/useAuth";
import { useProfiles } from "@/hooks/useProfiles";
import { useColaboradoresIndividuais } from "@/hooks/useColaboradoresIndividuais";
import CriarColaboradorDialog from "@/components/colaboradores/CriarColaboradorDialog";
import ColaboradoresIndividuaisTable from "@/components/colaboradores/ColaboradoresIndividuaisTable";
import ColaboradoresTable from "@/components/colaboradores/ColaboradoresTable";
import DocumentosTable from "@/components/colaboradores/DocumentosTable";

const Colaboradores = () => {
  const { canManageGroups } = useAuth();
  const { data: profiles } = useProfiles();
  const { data: colaboradoresIndividuais } = useColaboradoresIndividuais();

  // Calcular estatísticas dos profiles (colaboradores principais)
  const totalColaboradores = profiles?.length || 0;
  const colaboradoresAtivos = profiles?.filter(c => c.situacao === 'ativo').length || 0;
  const colaboradoresInativos = profiles?.filter(c => c.situacao === 'inativo').length || 0;
  const colaboradoresLicenca = profiles?.filter(c => c.situacao === 'licenca').length || 0;

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
      <Tabs defaultValue="colaboradores" className="space-y-4">
        <TabsList>
          <TabsTrigger value="colaboradores">Todos os Colaboradores</TabsTrigger>
          <TabsTrigger value="individuais">Colaboradores Individuais</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="colaboradores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Colaboradores</CardTitle>
              <CardDescription>
                Lista completa de todos os colaboradores do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ColaboradoresTable />
            </CardContent>
          </Card>
        </TabsContent>

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

        <TabsContent value="documentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>
                Gerencie os documentos dos colaboradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentosTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Colaboradores;
