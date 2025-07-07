
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Eye, 
  MoreHorizontal,
  PlayCircle,
  PauseCircle,
  CheckCircle2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useOrdens } from "@/hooks/useOrdens";
import CriarOrdemDialog from "@/components/producao/CriarOrdemDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "finalizada":
      return <Badge className="bg-success/10 text-success border-success/20">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Finalizada
      </Badge>;
    case "em_andamento":
      return <Badge className="bg-primary/10 text-primary border-primary/20">
        <PlayCircle className="w-3 h-3 mr-1" />
        Em andamento
      </Badge>;
    case "aguardando_inspecao":
      return <Badge className="bg-warning/10 text-warning border-warning/20">
        <PauseCircle className="w-3 h-3 mr-1" />
        Aguardando inspeção
      </Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const Producao = () => {
  const { canManageGroups } = useAuth();
  const { data: ordens, isLoading } = useOrdens();
  const [filtroStatus, setFiltroStatus] = useState("all");
  const [busca, setBusca] = useState("");

  const ordensFiltradas = ordens?.filter(ordem => {
    const matchStatus = filtroStatus === "all" || ordem.status === filtroStatus;
    const matchBusca = !busca || 
      ordem.numero_op.toLowerCase().includes(busca.toLowerCase()) ||
      ordem.produto.toLowerCase().includes(busca.toLowerCase());
    
    return matchStatus && matchBusca;
  }) || [];

  // Calculate statistics
  const stats = {
    finalizadas: ordens?.filter(o => o.status === 'finalizada').length || 0,
    emAndamento: ordens?.filter(o => o.status === 'em_andamento').length || 0,
    aguardandoInspecao: ordens?.filter(o => o.status === 'aguardando_inspecao').length || 0,
    totalPecas: ordens?.reduce((acc, o) => acc + (o.qtde_total_produzida || 0), 0) || 0
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando ordens de produção...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ordens de Produção</h1>
          <p className="text-muted-foreground">Gerencie ordens por grupos e acompanhe o progresso</p>
        </div>
        
        {canManageGroups() && <CriarOrdemDialog />}
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Finalizadas</p>
              <p className="text-xl font-bold">{stats.finalizadas}</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
              <p className="text-xl font-bold">{stats.emAndamento}</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <PauseCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aguardando Inspeção</p>
              <p className="text-xl font-bold">{stats.aguardandoInspecao}</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Peças Produzidas</p>
              <p className="text-xl font-bold">{stats.totalPecas.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="conffec-card p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar ordem ou produto..."
                className="pl-9 conffec-input"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
                <SelectItem value="aguardando_inspecao">Aguardando Inspeção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros Avançados
          </Button>
        </div>
      </div>

      {/* Tabela de ordens */}
      <div className="conffec-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº OP</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Grupo Responsável</TableHead>
              <TableHead>Meta</TableHead>
              <TableHead>Qtd. Produzida</TableHead>
              <TableHead>Qtd. Reprovada</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordensFiltradas.map((ordem) => (
              <TableRow key={ordem.id}>
                <TableCell className="font-medium">{ordem.numero_op}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{ordem.produto}</div>
                    {ordem.tipo_peca && (
                      <div className="text-sm text-muted-foreground">{ordem.tipo_peca}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {ordem.grupos ? (
                    <Badge variant="outline">{ordem.grupos.nome}</Badge>
                  ) : (
                    <span className="text-muted-foreground">Não atribuído</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{ordem.meta_producao || 0}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-success">{ordem.qtde_total_produzida || 0}</span>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${(ordem.qtde_total_reprovada || 0) > 0 ? 'text-error' : 'text-muted-foreground'}`}>
                    {ordem.qtde_total_reprovada || 0}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(ordem.status || 'em_andamento')}</TableCell>
                <TableCell>
                  {ordem.prazo_entrega ? 
                    format(new Date(ordem.prazo_entrega), 'dd/MM/yyyy', { locale: ptBR }) : 
                    'Não definido'
                  }
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/producao/${ordem.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {ordensFiltradas.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <PlayCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma ordem de produção encontrada.</p>
            {canManageGroups() && (
              <p className="text-sm mt-2">Crie uma nova ordem para começar.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Producao;
