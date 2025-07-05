
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
  Plus, 
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

const ordensProducao = [
  {
    id: "OP-001",
    produto: "Camiseta Básica Branca",
    grupo: "Costura A",
    qtdProduzida: 245,
    qtdReprovada: 12,
    status: "Finalizada",
    dataInicio: "15/11/2024",
    prazo: "20/11/2024"
  },
  {
    id: "OP-002",
    produto: "Calça Jeans Masculina",
    grupo: "Costura B",
    qtdProduzida: 89,
    qtdReprovada: 3,
    status: "Em andamento",
    dataInicio: "18/11/2024",
    prazo: "25/11/2024"
  },
  {
    id: "OP-003",
    produto: "Blusa Social Feminina",
    grupo: "Corte Principal",
    qtdProduzida: 156,
    qtdReprovada: 8,
    status: "Aguardando inspeção",
    dataInicio: "16/11/2024",
    prazo: "22/11/2024"
  },
  {
    id: "OP-004",
    produto: "Vestido Casual",
    grupo: "Acabamento A",
    qtdProduzida: 67,
    qtdReprovada: 2,
    status: "Em andamento",
    dataInicio: "20/11/2024",
    prazo: "28/11/2024"
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Finalizada":
      return <Badge className="bg-success/10 text-success border-success/20">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Finalizada
      </Badge>;
    case "Em andamento":
      return <Badge className="bg-primary/10 text-primary border-primary/20">
        <PlayCircle className="w-3 h-3 mr-1" />
        Em andamento
      </Badge>;
    case "Aguardando inspeção":
      return <Badge className="bg-warning/10 text-warning border-warning/20">
        <PauseCircle className="w-3 h-3 mr-1" />
        Aguardando inspeção
      </Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const Producao = () => {
  const [filtroStatus, setFiltroStatus] = useState("all");

  const ordensFiltradas = ordensProducao.filter(ordem => 
    filtroStatus === "all" || ordem.status === filtroStatus
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ordens de Produção</h1>
          <p className="text-muted-foreground">Gerencie ordens por grupos e acompanhe o progresso</p>
        </div>
        
        <Button className="conffec-button-primary gap-2">
          <Plus className="w-4 h-4" />
          Nova Ordem
        </Button>
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
              <p className="text-xl font-bold">8</p>
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
              <p className="text-xl font-bold">5</p>
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
              <p className="text-xl font-bold">3</p>
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
              <p className="text-xl font-bold">1.247</p>
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
              />
            </div>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Em andamento">Em Andamento</SelectItem>
                <SelectItem value="Finalizada">Finalizada</SelectItem>
                <SelectItem value="Aguardando inspeção">Aguardando Inspeção</SelectItem>
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
                <TableCell className="font-medium">{ordem.id}</TableCell>
                <TableCell>{ordem.produto}</TableCell>
                <TableCell>
                  <Badge variant="outline">{ordem.grupo}</Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-success">{ordem.qtdProduzida}</span>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${ordem.qtdReprovada > 0 ? 'text-error' : 'text-muted-foreground'}`}>
                    {ordem.qtdReprovada}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(ordem.status)}</TableCell>
                <TableCell>{ordem.prazo}</TableCell>
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
      </div>
    </div>
  );
};

export default Producao;
