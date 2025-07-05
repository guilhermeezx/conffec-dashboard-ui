
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowLeft,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  User
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const ordemDetalhes = {
  id: "OP-002",
  produto: "Calça Jeans Masculina",
  grupo: "Costura B",
  qtdTotal: 200,
  qtdProduzida: 89,
  qtdReprovada: 3,
  status: "Em andamento",
  dataInicio: "18/11/2024",
  prazo: "25/11/2024",
  responsavel: "Maria Santos"
};

const registrosProducao = [
  {
    id: 1,
    qtdProduzida: 45,
    qtdReprovada: 2,
    responsavel: "João Silva",
    observacoes: "Pequenos ajustes no acabamento",
    dataHora: "20/11/2024 14:30",
    statusInspecao: "Aprovado"
  },
  {
    id: 2,
    qtdProduzida: 44,
    qtdReprovada: 1,
    responsavel: "Maria Santos",
    observacoes: "Produção normal",
    dataHora: "20/11/2024 09:15",
    statusInspecao: "Aprovado"
  },
  {
    id: 3,
    qtdProduzida: 0,
    qtdReprovada: 0,
    responsavel: "Carlos Lima",
    observacoes: "Aguardando material",
    dataHora: "19/11/2024 16:45",
    statusInspecao: "Pendente"
  }
];

const ProducaoDetalhes = () => {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    qtdProduzida: "",
    qtdReprovada: "",
    observacoes: ""
  });

  const getStatusInspecaoBadge = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <Badge className="bg-success/10 text-success border-success/20">Aprovado</Badge>;
      case "Reprovado":
        return <Badge className="bg-error/10 text-error border-error/20">Reprovado</Badge>;
      case "Pendente":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria implementada a lógica para salvar o registro
    console.log("Registrando produção:", formData);
    setModalOpen(false);
    setFormData({ qtdProduzida: "", qtdReprovada: "", observacoes: "" });
  };

  const progressoPercentual = (ordemDetalhes.qtdProduzida / ordemDetalhes.qtdTotal) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/producao">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{ordemDetalhes.id}</h1>
            <p className="text-muted-foreground">{ordemDetalhes.produto}</p>
          </div>
        </div>
        
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="conffec-button-primary gap-2">
              <Plus className="w-4 h-4" />
              Registrar Produção
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Registrar Nova Produção</DialogTitle>
                <DialogDescription>
                  Grupo: {ordemDetalhes.grupo} | Produto: {ordemDetalhes.produto}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qtdProduzida">Qtd. Produzida</Label>
                    <Input
                      id="qtdProduzida"
                      type="number"
                      placeholder="0"
                      value={formData.qtdProduzida}
                      onChange={(e) => setFormData({...formData, qtdProduzida: e.target.value})}
                      className="text-lg h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qtdReprovada">Qtd. Reprovada</Label>
                    <Input
                      id="qtdReprovada"
                      type="number"
                      placeholder="0"
                      value={formData.qtdReprovada}
                      onChange={(e) => setFormData({...formData, qtdReprovada: e.target.value})}
                      className="text-lg h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Comentários sobre a produção..."
                    value={formData.observacoes}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    className="min-h-20"
                  />
                </div>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  <p><strong>Data/Hora:</strong> {new Date().toLocaleString('pt-BR')}</p>
                  <p><strong>Responsável:</strong> {ordemDetalhes.responsavel}</p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="conffec-button-primary">
                  Registrar Produção
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Informações da OP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="conffec-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Informações Gerais</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Grupo Responsável</p>
              <Badge variant="outline" className="mt-1">{ordemDetalhes.grupo}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de Início</p>
              <p className="font-medium">{ordemDetalhes.dataInicio}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prazo</p>
              <p className="font-medium">{ordemDetalhes.prazo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="bg-primary/10 text-primary border-primary/20 mt-1">
                <Clock className="w-3 h-3 mr-1" />
                {ordemDetalhes.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="conffec-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Progresso</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Produção</span>
                <span className="font-bold text-lg">{ordemDetalhes.qtdProduzida}/{ordemDetalhes.qtdTotal}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${progressoPercentual}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{progressoPercentual.toFixed(1)}% concluído</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <p className="text-2xl font-bold text-success">{ordemDetalhes.qtdProduzida}</p>
                <p className="text-sm text-success">Produzidas</p>
              </div>
              <div className="text-center p-3 bg-error/10 rounded-lg">
                <p className="text-2xl font-bold text-error">{ordemDetalhes.qtdReprovada}</p>
                <p className="text-sm text-error">Reprovadas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="conffec-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Responsável</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{ordemDetalhes.responsavel}</p>
              <p className="text-sm text-muted-foreground">Supervisora do Grupo</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-warning" />
              <span>Restam {ordemDetalhes.qtdTotal - ordemDetalhes.qtdProduzida} peças</span>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de registros */}
      <div className="conffec-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Registros de Produção
        </h3>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Qtd. Produzida</TableHead>
              <TableHead>Qtd. Reprovada</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Status Inspeção</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrosProducao.map((registro) => (
              <TableRow key={registro.id}>
                <TableCell className="font-medium">{registro.dataHora}</TableCell>
                <TableCell>{registro.responsavel}</TableCell>
                <TableCell>
                  <span className="font-medium text-success">{registro.qtdProduzida}</span>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${registro.qtdReprovada > 0 ? 'text-error' : 'text-muted-foreground'}`}>
                    {registro.qtdReprovada}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs truncate">{registro.observacoes}</TableCell>
                <TableCell>{getStatusInspecaoBadge(registro.statusInspecao)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProducaoDetalhes;
