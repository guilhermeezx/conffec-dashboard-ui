
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
  Play, 
  Pause, 
  CheckCircle, 
  Clock,
  User
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dados simulados das ordens de produção
const ordensProducao = [
  {
    id: "OP-001",
    tipo: "Camiseta Básica",
    operador: "João Silva",
    inicio: "08:00",
    fim: "10:30",
    tempo: "2h30min",
    eficiencia: 92,
    status: "Finalizada",
    pecas: 15
  },
  {
    id: "OP-002",
    tipo: "Calça Jeans",
    operador: "Maria Santos",
    inicio: "09:15",
    fim: "-",
    tempo: "3h12min",
    eficiencia: 87,
    status: "Em Produção",
    pecas: 8
  },
  {
    id: "OP-003",
    tipo: "Blusa Social",
    operador: "Carlos Lima",
    inicio: "07:30",
    fim: "-",
    tempo: "-",
    eficiencia: 0,
    status: "Pausada",
    pecas: 0
  },
  {
    id: "OP-004",
    tipo: "Vestido Casual",
    operador: "Ana Costa",
    inicio: "10:00",
    fim: "14:20",
    tempo: "4h20min",
    eficiencia: 95,
    status: "Finalizada",
    pecas: 12
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Finalizada":
      return <Badge className="bg-success/10 text-success border-success/20">Finalizada</Badge>;
    case "Em Produção":
      return <Badge className="bg-primary/10 text-primary border-primary/20">Em Produção</Badge>;
    case "Pausada":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Pausada</Badge>;
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
          <h1 className="text-3xl font-bold text-foreground">Produção</h1>
          <p className="text-muted-foreground">Gerencie ordens e acompanhe o progresso</p>
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
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Finalizadas Hoje</p>
              <p className="text-xl font-bold">12</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Em Produção</p>
              <p className="text-xl font-bold">5</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Pause className="w-5 h-5 text-error" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pausadas</p>
              <p className="text-xl font-bold">2</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Operadores Ativos</p>
              <p className="text-xl font-bold">8</p>
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
                placeholder="Buscar ordem ou operador..."
                className="pl-9 conffec-input"
              />
            </div>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Em Produção">Em Produção</SelectItem>
                <SelectItem value="Finalizada">Finalizada</SelectItem>
                <SelectItem value="Pausada">Pausada</SelectItem>
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
              <TableHead>Nº Ordem</TableHead>
              <TableHead>Tipo de Peça</TableHead>
              <TableHead>Operador</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Fim</TableHead>
              <TableHead>Tempo</TableHead>
              <TableHead>Peças</TableHead>
              <TableHead>Eficiência</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordensFiltradas.map((ordem) => (
              <TableRow key={ordem.id}>
                <TableCell className="font-medium">{ordem.id}</TableCell>
                <TableCell>{ordem.tipo}</TableCell>
                <TableCell>{ordem.operador}</TableCell>
                <TableCell>{ordem.inicio}</TableCell>
                <TableCell>{ordem.fim}</TableCell>
                <TableCell>{ordem.tempo}</TableCell>
                <TableCell>{ordem.pecas}</TableCell>
                <TableCell>
                  {ordem.eficiencia > 0 && (
                    <span className={`font-medium ${
                      ordem.eficiencia >= 90 ? 'text-success' : 
                      ordem.eficiencia >= 80 ? 'text-warning' : 'text-error'
                    }`}>
                      {ordem.eficiencia}%
                    </span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(ordem.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  {ordem.status === "Em Produção" && (
                    <Button size="sm" variant="outline">
                      <Pause className="w-4 h-4" />
                    </Button>
                  )}
                  {ordem.status === "Pausada" && (
                    <Button size="sm" className="conffec-button-primary">
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Clock className="w-4 h-4" />
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
