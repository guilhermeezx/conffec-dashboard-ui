
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric-card";
import { 
  FileText, 
  Plus, 
  Download, 
  Eye, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
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

// Dados simulados das NF-e
const notasFiscais = [
  {
    numero: "000.001.234",
    cliente: "Confecções Silva Ltda",
    valor: "R$ 2.450,00",
    emissao: "15/11/2024",
    status: "Emitida",
    chave: "35241115123456000123550010000012341123456789"
  },
  {
    numero: "000.001.235",
    cliente: "Moda & Estilo",
    valor: "R$ 1.850,00",
    emissao: "14/11/2024",
    status: "Pendente",
    chave: "35241114123456000123550010000012351123456789"
  },
  {
    numero: "000.001.236",
    cliente: "Fashion Store",
    valor: "R$ 3.200,00",
    emissao: "13/11/2024",
    status: "Erro",
    chave: "35241113123456000123550010000012361123456789"
  },
  {
    numero: "000.001.237",
    cliente: "Boutique Elegante",
    valor: "R$ 1.650,00",
    emissao: "12/11/2024",
    status: "Emitida",
    chave: "35241112123456000123550010000012371123456789"
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Emitida":
      return <Badge className="bg-success/10 text-success border-success/20">Emitida</Badge>;
    case "Pendente":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Pendente</Badge>;
    case "Erro":
      return <Badge className="bg-error/10 text-error border-error/20">Erro</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const Fiscal = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Módulo Fiscal</h1>
          <p className="text-muted-foreground">Emissão e controle de Notas Fiscais Eletrônicas</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="conffec-button-primary gap-2">
              <Plus className="w-4 h-4" />
              Emitir NF-e
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Emitir Nova NF-e</DialogTitle>
              <DialogDescription>
                Preencha os dados para emissão da Nota Fiscal Eletrônica
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input id="cliente" placeholder="Nome do cliente" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ/CPF</Label>
                  <Input id="cnpj" placeholder="00.000.000/0000-00" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="produto">Produto/Serviço</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camiseta">Camiseta</SelectItem>
                      <SelectItem value="calca">Calça</SelectItem>
                      <SelectItem value="vestido">Vestido</SelectItem>
                      <SelectItem value="blusa">Blusa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input id="quantidade" type="number" placeholder="0" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor Unitário</Label>
                  <Input id="valor" placeholder="€ 0,00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total">Valor Total</Label>
                  <Input id="total" placeholder="€ 0,00" disabled />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" placeholder="Observações adicionais..." />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="conffec-button-primary" onClick={() => setIsDialogOpen(false)}>
                Emitir NF-e
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Emitido no Mês"
          value="R$ 28.450,00"
          change={{ value: "12,3%", trend: "up" }}
          subtitle="em NF-e"
          icon={DollarSign}
        />
        
        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Emitidas</p>
              <p className="text-xl font-bold">24</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-xl font-bold">3</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-error" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Com Erro</p>
              <p className="text-xl font-bold">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de NF-e */}
      <div className="conffec-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Histórico de NF-e</h3>
              <p className="text-sm text-muted-foreground">Últimas notas fiscais emitidas</p>
            </div>
            
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar Lista
            </Button>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Emissão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notasFiscais.map((nota) => (
              <TableRow key={nota.numero}>
                <TableCell className="font-medium">{nota.numero}</TableCell>
                <TableCell>{nota.cliente}</TableCell>
                <TableCell className="font-medium">{nota.valor}</TableCell>
                <TableCell>{nota.emissao}</TableCell>
                <TableCell>{getStatusBadge(nota.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Configurações de Integração */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="conffec-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Integração NFe.io</h3>
              <p className="text-sm text-muted-foreground">Status da conexão</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status:</span>
              <Badge className="bg-success/10 text-success border-success/20">Conectado</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Último sync:</span>
              <span className="text-sm text-muted-foreground">há 2 minutos</span>
            </div>
            <Button variant="outline" className="w-full">
              Configurar Integração
            </Button>
          </div>
        </div>

        <div className="conffec-card p-6">
          <h3 className="text-lg font-semibold mb-4">Próximas Ações</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border border-warning/20 bg-warning/5 rounded-lg">
              <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium">1 NF-e com erro</p>
                <p className="text-xs text-muted-foreground">Rejeição 999 - Verificar dados</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 border border-primary/20 bg-primary/5 rounded-lg">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">3 NF-e aguardando processamento</p>
                <p className="text-xs text-muted-foreground">Tempo médio: 5 minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fiscal;
