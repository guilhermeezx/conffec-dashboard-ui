
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Users,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

const grupos = [
  {
    id: 1,
    nome: "Costura A",
    setor: "Costura",
    membros: 8,
    lider: "Maria Santos",
    status: "Ativo",
    metaMensal: 850
  },
  {
    id: 2,
    nome: "Costura B",
    setor: "Costura",
    membros: 6,
    lider: "João Silva",
    status: "Ativo",
    metaMensal: 720
  },
  {
    id: 3,
    nome: "Corte Principal",
    setor: "Corte",
    membros: 4,
    lider: "Carlos Lima",
    status: "Ativo",
    metaMensal: 1200
  },
  {
    id: 4,
    nome: "Acabamento A",
    setor: "Acabamento",
    membros: 5,
    lider: "Ana Costa",
    status: "Ativo",
    metaMensal: 600
  },
  {
    id: 5,
    nome: "Acabamento B",
    setor: "Acabamento",
    membros: 3,
    lider: "Pedro Santos",
    status: "Inativo",
    metaMensal: 450
  }
];

const colaboradoresDisponiveis = [
  "Roberto Silva", "Fernanda Costa", "Miguel Santos", "Juliana Lima",
  "André Oliveira", "Patrícia Rocha", "Thiago Alves", "Camila Ferreira"
];

const Grupos = () => {
  const [filtroSetor, setFiltroSetor] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    setor: "",
    lider: "",
    metaMensal: "",
    membros: [] as string[]
  });

  const gruposFiltrados = grupos.filter(grupo => 
    filtroSetor === "all" || grupo.setor === filtroSetor
  );

  const getSetorBadge = (setor: string) => {
    const colors = {
      "Costura": "bg-primary/10 text-primary border-primary/20",
      "Corte": "bg-secondary/10 text-secondary border-secondary/20",
      "Acabamento": "bg-warning/10 text-warning border-warning/20"
    };
    return <Badge className={colors[setor as keyof typeof colors] || ""}>{setor}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return status === "Ativo" 
      ? <Badge className="bg-success/10 text-success border-success/20">Ativo</Badge>
      : <Badge className="bg-error/10 text-error border-error/20">Inativo</Badge>;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Criando grupo:", formData);
    setModalOpen(false);
    setFormData({ nome: "", setor: "", lider: "", metaMensal: "", membros: [] });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Grupos</h1>
          <p className="text-muted-foreground">Gerencie grupos produtivos e suas equipes</p>
        </div>
        
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="conffec-button-primary gap-2">
              <Plus className="w-4 h-4" />
              Novo Grupo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Criar Novo Grupo</DialogTitle>
                <DialogDescription>
                  Configure um novo grupo produtivo e adicione membros.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Grupo</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Costura C"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setor">Setor</Label>
                    <Select value={formData.setor} onValueChange={(value) => setFormData({...formData, setor: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Costura">Costura</SelectItem>
                        <SelectItem value="Corte">Corte</SelectItem>
                        <SelectItem value="Acabamento">Acabamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lider">Líder do Grupo</Label>
                    <Select value={formData.lider} onValueChange={(value) => setFormData({...formData, lider: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {colaboradoresDisponiveis.map((colaborador) => (
                          <SelectItem key={colaborador} value={colaborador}>{colaborador}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaMensal">Meta Mensal</Label>
                    <Input
                      id="metaMensal"
                      type="number"
                      placeholder="0"
                      value={formData.metaMensal}
                      onChange={(e) => setFormData({...formData, metaMensal: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="conffec-button-primary">
                  Criar Grupo
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Grupos</p>
              <p className="text-xl font-bold">5</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Grupos Ativos</p>
              <p className="text-xl font-bold">4</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Membros</p>
              <p className="text-xl font-bold">26</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Média por Grupo</p>
              <p className="text-xl font-bold">5,2</p>
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
                placeholder="Buscar grupo..."
                className="pl-9 conffec-input"
              />
            </div>

            <Select value={filtroSetor} onValueChange={setFiltroSetor}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Setores</SelectItem>
                <SelectItem value="Costura">Costura</SelectItem>
                <SelectItem value="Corte">Corte</SelectItem>
                <SelectItem value="Acabamento">Acabamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros Avançados
          </Button>
        </div>
      </div>

      {/* Tabela de grupos */}
      <div className="conffec-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Grupo</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Líder</TableHead>
              <TableHead>Membros</TableHead>
              <TableHead>Meta Mensal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gruposFiltrados.map((grupo) => (
              <TableRow key={grupo.id}>
                <TableCell className="font-medium">{grupo.nome}</TableCell>
                <TableCell>{getSetorBadge(grupo.setor)}</TableCell>
                <TableCell>{grupo.lider}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{grupo.membros}</span>
                  </div>
                </TableCell>
                <TableCell>{grupo.metaMensal} peças</TableCell>
                <TableCell>{getStatusBadge(grupo.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
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

export default Grupos;
