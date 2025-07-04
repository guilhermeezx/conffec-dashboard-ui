
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Upload, 
  Download,
  Search,
  Filter,
  DollarSign,
  AlertCircle
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Dados simulados do fluxo de caixa
const fluxoCaixaData = [
  { mes: 'Jul', receita: 45000, despesa: -32000, saldo: 13000 },
  { mes: 'Ago', receita: 52000, despesa: -35000, saldo: 17000 },
  { mes: 'Set', receita: 48000, despesa: -33000, saldo: 15000 },
  { mes: 'Out', receita: 61000, despesa: -38000, saldo: 23000 },
  { mes: 'Nov', receita: 58000, despesa: -36000, saldo: 22000 },
];

// Dados simulados das transações
const transacoes = [
  {
    id: 1,
    descricao: "Venda Loja A",
    tipo: "Receita",
    valor: "€ 2.450,00",
    vencimento: "15/11/2024",
    status: "Pago",
    metodo: "Transferência"
  },
  {
    id: 2,
    descricao: "Aluguel Fábrica",
    tipo: "Despesa",
    valor: "€ 3.200,00",
    vencimento: "10/11/2024",
    status: "Pago",
    metodo: "Débito Automático"
  },
  {
    id: 3,
    descricao: "Matéria Prima",
    tipo: "Despesa",
    valor: "€ 1.850,00",
    vencimento: "20/11/2024",
    status: "Aberto",
    metodo: "Boleto"
  },
  {
    id: 4,
    descricao: "Venda Loja B",
    tipo: "Receita",
    valor: "€ 1.650,00",
    vencimento: "12/11/2024",
    status: "Atrasado",
    metodo: "Pix"
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pago":
      return <Badge className="bg-success/10 text-success border-success/20">Pago</Badge>;
    case "Aberto":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Aberto</Badge>;
    case "Atrasado":
      return <Badge className="bg-error/10 text-error border-error/20">Atrasado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const Financeiro = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("all");
  const [filtroStatus, setFiltroStatus] = useState("all");

  const transacoesFiltradas = transacoes.filter(t => {
    const matchTipo = filtroTipo === "all" || t.tipo === filtroTipo;
    const matchStatus = filtroStatus === "all" || t.status === filtroStatus;
    return matchTipo && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">Controle financeiro e fluxo de caixa</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Importar Extrato
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="conffec-button-primary gap-2">
                <Plus className="w-4 h-4" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Nova Transação</DialogTitle>
                <DialogDescription>
                  Adicione uma nova receita ou despesa
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input id="descricao" placeholder="Ex: Venda para cliente X" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="receita">Receita</SelectItem>
                        <SelectItem value="despesa">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor</Label>
                    <Input id="valor" placeholder="€ 0,00" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vencimento">Vencimento</Label>
                    <Input id="vencimento" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metodo">Método</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pix">Pix</SelectItem>
                        <SelectItem value="transferencia">Transferência</SelectItem>
                        <SelectItem value="boleto">Boleto</SelectItem>
                        <SelectItem value="debito">Débito Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="conffec-button-primary" onClick={() => setIsDialogOpen(false)}>
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Receita Total"
          value="€ 58.000,00"
          change={{ value: "12,3%", trend: "up" }}
          subtitle="este mês"
          icon={TrendingUp}
        />
        
        <MetricCard
          title="Despesas Totais"
          value="€ 36.000,00"
          change={{ value: "5,7%", trend: "up" }}
          subtitle="este mês"
          icon={TrendingDown}
        />
        
        <MetricCard
          title="Saldo Atual"
          value="€ 22.000,00"
          change={{ value: "18,5%", trend: "up" }}
          subtitle="lucro líquido"
          icon={Wallet}
        />
        
        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-error" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contas Atrasadas</p>
              <p className="text-xl font-bold">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Fluxo de Caixa */}
      <div className="conffec-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Fluxo de Caixa
            </h3>
            <p className="text-sm text-muted-foreground">
              Receitas vs Despesas dos últimos meses
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span>Receitas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <span>Despesas</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fluxoCaixaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="mes" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 6px rgba(0,0,0,0.06)'
                }}
              />
              <Bar dataKey="receita" fill="#00D084" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesa" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filtros e Tabela */}
      <div className="conffec-card">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar transação..."
                  className="pl-9 conffec-input"
                />
              </div>

              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Receita">Receita</SelectItem>
                  <SelectItem value="Despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Aberto">Aberto</SelectItem>
                  <SelectItem value="Atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Método</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transacoesFiltradas.map((transacao) => (
              <TableRow key={transacao.id}>
                <TableCell className="font-medium">{transacao.descricao}</TableCell>
                <TableCell>
                  <Badge variant={transacao.tipo === "Receita" ? "default" : "outline"}>
                    {transacao.tipo}
                  </Badge>
                </TableCell>
                <TableCell className={`font-medium ${
                  transacao.tipo === "Receita" ? "text-success" : "text-error"
                }`}>
                  {transacao.tipo === "Receita" ? "+" : "-"}{transacao.valor}
                </TableCell>
                <TableCell>{transacao.vencimento}</TableCell>
                <TableCell>{getStatusBadge(transacao.status)}</TableCell>
                <TableCell>{transacao.metodo}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    Editar
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

export default Financeiro;
