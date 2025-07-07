
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  Users, 
  Package,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOrdem } from "@/hooks/useOrdens";
import { useRegistrosProducao } from "@/hooks/useRegistrosProducao";
import RegistrarProducaoDialog from "@/components/producao/RegistrarProducaoDialog";
import RegistrosProducaoTable from "@/components/producao/RegistrosProducaoTable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "finalizada":
      return <Badge className="bg-success/10 text-success border-success/20">
        <CheckCircle2 className="w-4 h-4 mr-1" />
        Finalizada
      </Badge>;
    case "em_andamento":
      return <Badge className="bg-primary/10 text-primary border-primary/20">
        <PlayCircle className="w-4 h-4 mr-1" />
        Em andamento
      </Badge>;
    case "aguardando_inspecao":
      return <Badge className="bg-warning/10 text-warning border-warning/20">
        <PauseCircle className="w-4 h-4 mr-1" />
        Aguardando inspeção
      </Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const ProducaoDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const { canRegisterProduction } = useAuth();
  const { data: ordem, isLoading: loadingOrdem } = useOrdem(id!);
  const { data: registros } = useRegistrosProducao(id);

  if (loadingOrdem) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando detalhes da ordem...</p>
        </div>
      </div>
    );
  }

  if (!ordem) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-warning" />
          <h2 className="text-xl font-semibold mb-2">Ordem não encontrada</h2>
          <p className="text-muted-foreground mb-4">A ordem de produção solicitada não existe.</p>
          <Button asChild>
            <Link to="/producao">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar às Ordens
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculate progress
  const totalProduzido = ordem.qtde_total_produzida || 0;
  const meta = ordem.meta_producao || 0;
  const progresso = meta > 0 ? Math.min((totalProduzido / meta) * 100, 100) : 0;

  // Statistics from records
  const registrosAprovados = registros?.filter(r => r.status_inspecao === 'aprovado').length || 0;
  const registrosPendentes = registros?.filter(r => r.status_inspecao === 'pendente').length || 0;
  const registrosReprovados = registros?.filter(r => r.status_inspecao === 'reprovado').length || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/producao">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{ordem.numero_op}</h1>
            <p className="text-muted-foreground">{ordem.produto}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {getStatusBadge(ordem.status || 'em_andamento')}
          {canRegisterProduction() && ordem.status !== 'finalizada' && (
            <RegistrarProducaoDialog opId={ordem.id} />
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta de Produção</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              peças planejadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produzido</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{totalProduzido.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {progresso.toFixed(1)}% da meta
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progresso}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grupo Responsável</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {ordem.grupos?.nome || 'Não atribuído'}
            </div>
            <p className="text-xs text-muted-foreground">
              {ordem.grupos?.setor || 'Setor não definido'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prazo</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {ordem.prazo_entrega ? 
                format(new Date(ordem.prazo_entrega), 'dd/MM/yyyy', { locale: ptBR }) : 
                'Não definido'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {ordem.tipo_peca || 'Tipo não especificado'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="registros" className="space-y-4">
        <TabsList>
          <TabsTrigger value="registros">Registros de Produção</TabsTrigger>
          <TabsTrigger value="aprovados">
            Aprovados ({registrosAprovados})
          </TabsTrigger>
          <TabsTrigger value="pendentes">
            Pendentes ({registrosPendentes})
          </TabsTrigger>
          <TabsTrigger value="reprovados">
            Reprovados ({registrosReprovados})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Registros</CardTitle>
              <CardDescription>
                Histórico completo de produção desta ordem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegistrosProducaoTable opId={ordem.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aprovados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registros Aprovados</CardTitle>
              <CardDescription>
                Produção aprovada pela inspeção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegistrosProducaoTable opId={ordem.id} status="aprovado" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendentes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registros Pendentes</CardTitle>
              <CardDescription>
                Aguardando inspeção e aprovação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegistrosProducaoTable opId={ordem.id} status="pendente" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reprovados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registros Reprovados</CardTitle>
              <CardDescription>
                Produção reprovada - disponível para reprocessamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegistrosProducaoTable opId={ordem.id} status="reprovado" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProducaoDetalhes;
