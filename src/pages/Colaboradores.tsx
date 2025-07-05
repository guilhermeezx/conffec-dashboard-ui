
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
  Edit,
  UserX,
  Award,
  Users
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

const colaboradores = [
  {
    id: 1,
    nome: "João Silva",
    funcao: "Operador de Costura",
    grupo: "Costura A",
    situacao: "Ativo",
    admissao: "15/01/2023",
    metasAtingidas: 8,
    premioZeroFalta: true,
    horasExtras: 12
  },
  {
    id: 2,
    nome: "Maria Santos",
    funcao: "Operadora de Corte",
    grupo: "Corte Principal",
    situacao: "Ativo",
    admissao: "10/03/2023",
    metasAtingidas: 6,
    premioZeroFalta: false,
    horasExtras: 8
  },
  {
    id: 3,
    nome: "Carlos Lima",
    funcao: "Operador de Acabamento",
    grupo: "Acabamento B",
    situacao: "Inativo",
    admissao: "22/06/2022",
    metasAtingidas: 4,
    premioZeroFalta: true,
    horasExtras: 0
  },
  {
    id: 4,
    nome: "Ana Costa",
    funcao: "Inspetora",
    grupo: "Qualidade",
    situacao: "Ativo",
    admissao: "05/09/2022",
    metasAtingidas: 10,
    premioZeroFalta: true,
    horasExtras: 16
  },
];

const getSituacaoBadge = (situacao: string) => {
  switch (situacao) {
    case "Ativo":
      return <Badge className="bg-success/10 text-success border-success/20">Ativo</Badge>;
    case "Inativo":
      return <Badge className="bg-error/10 text-error border-error/20">Inativo</Badge>;
    default:
      return <Badge variant="outline">{situacao}</Badge>;
  }
};

const Colaboradores = () => {
  const [filtroSituacao, setFiltroSituacao] = useState("all");

  const colaboradoresFiltrados = colaboradores.filter(colaborador => 
    filtroSituacao === "all" || colaborador.situacao === filtroSituacao
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Colaboradores</h1>
          <p className="text-muted-foreground">Gerencie informações e desempenho da equipe</p>
        </div>
        
        <Button className="conffec-button-primary gap-2">
          <Plus className="w-4 h-4" />
          Novo Colaborador
        </Button>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Ativos</p>
              <p className="text-xl font-bold">24</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prêmio Zero Falta</p>
              <p className="text-xl font-bold">8</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Metas Atingidas</p>
              <p className="text-xl font-bold">18</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Horas Extras/Mês</p>
              <p className="text-xl font-bold">156h</p>
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
                placeholder="Buscar colaborador..."
                className="pl-9 conffec-input"
              />
            </div>

            <Select value={filtroSituacao} onValueChange={setFiltroSituacao}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Situação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Situações</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros Avançados
          </Button>
        </div>
      </div>

      {/* Tabela de colaboradores */}
      <div className="conffec-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Admissão</TableHead>
              <TableHead>Metas</TableHead>
              <TableHead>Prêmios</TableHead>
              <TableHead>H. Extras</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colaboradoresFiltrados.map((colaborador) => (
              <TableRow key={colaborador.id}>
                <TableCell className="font-medium">{colaborador.nome}</TableCell>
                <TableCell>{colaborador.funcao}</TableCell>
                <TableCell>
                  <Badge variant="outline">{colaborador.grupo}</Badge>
                </TableCell>
                <TableCell>{getSituacaoBadge(colaborador.situacao)}</TableCell>
                <TableCell>{colaborador.admissao}</TableCell>
                <TableCell>
                  <span className={`font-medium ${
                    colaborador.metasAtingidas >= 8 ? 'text-success' : 
                    colaborador.metasAtingidas >= 5 ? 'text-warning' : 'text-error'
                  }`}>
                    {colaborador.metasAtingidas}/10
                  </span>
                </TableCell>
                <TableCell>
                  {colaborador.premioZeroFalta && (
                    <Badge className="bg-success/10 text-success border-success/20">
                      <Award className="w-3 h-3 mr-1" />
                      Zero Falta
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{colaborador.horasExtras}h</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/colaboradores/${colaborador.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  {colaborador.situacao === "Ativo" && (
                    <Button size="sm" variant="outline">
                      <UserX className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Colaboradores;
