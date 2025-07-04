
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Bot, 
  Users, 
  Clock, 
  TrendingUp,
  CheckCircle,
  X,
  Settings,
  Lightbulb,
  ArrowRight,
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

// Dados simulados das estações
const estacoes = [
  {
    id: 1,
    nome: "Corte",
    operadores: 3,
    tempoMedio: "12 min",
    eficiencia: 88,
    carga: "Alta",
    gargalo: true
  },
  {
    id: 2,
    nome: "Costura",
    operadores: 5,
    tempoMedio: "25 min",
    eficiencia: 92,
    carga: "Média",
    gargalo: false
  },
  {
    id: 3,
    nome: "Acabamento",
    operadores: 2,
    tempoMedio: "8 min",
    eficiencia: 85,
    carga: "Baixa",
    gargalo: false
  },
  {
    id: 4,
    nome: "Controle Qualidade",
    operadores: 1,
    tempoMedio: "5 min",
    eficiencia: 95,
    carga: "Baixa",
    gargalo: false
  },
];

// Sugestões da IA
const sugestoesIA = [
  {
    id: 1,
    tipo: "Realocação",
    prioridade: "Alta",
    titulo: "Mover João Silva da Costura para Corte",
    descricao: "Baseado no histórico, João tem 15% mais eficiência no corte. Isso reduziria o gargalo em 23%.",
    impacto: "+23% eficiência no Corte",
    confianca: 92,
    aceita: null
  },
  {
    id: 2,
    tipo: "Reforço",
    prioridade: "Média",
    titulo: "Adicionar 1 operador no Corte",
    descricao: "A estação de corte está operando acima da capacidade. Um operador adicional equilibraria o fluxo.",
    impacto: "+35% capacidade",
    confianca: 87,
    aceita: null
  },
  {
    id: 3,
    tipo: "Otimização",
    prioridade: "Baixa",
    titulo: "Reorganizar sequência no Acabamento",
    descricao: "Mudança na ordem das operações pode reduzir tempo de setup entre peças diferentes.",
    impacto: "-12% tempo de setup",
    confianca: 78,
    aceita: null
  },
];

const getCargaBadge = (carga: string) => {
  switch (carga) {
    case "Alta":
      return <Badge className="bg-error/10 text-error border-error/20">Alta</Badge>;
    case "Média":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Média</Badge>;
    case "Baixa":
      return <Badge className="bg-success/10 text-success border-success/20">Baixa</Badge>;
    default:
      return <Badge variant="outline">{carga}</Badge>;
  }
};

const getPrioridadeBadge = (prioridade: string) => {
  switch (prioridade) {
    case "Alta":
      return <Badge className="bg-error/10 text-error border-error/20">Alta</Badge>;
    case "Média":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Média</Badge>;
    case "Baixa":
      return <Badge className="bg-primary/10 text-primary border-primary/20">Baixa</Badge>;
    default:
      return <Badge variant="outline">{prioridade}</Badge>;
  }
};

const BalanceamentoIA = () => {
  const [sugestoes, setSugestoes] = useState(sugestoesIA);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const aceitarSugestao = (id: number) => {
    setSugestoes(prev => prev.map(s => 
      s.id === id ? { ...s, aceita: true } : s
    ));
  };

  const rejeitarSugestao = (id: number) => {
    setSugestoes(prev => prev.map(s => 
      s.id === id ? { ...s, aceita: false } : s
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            Balanceamento com IA
          </h1>
          <p className="text-muted-foreground">Otimização inteligente da alocação de operadores</p>
        </div>
        
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Configurações IA
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurações da IA</DialogTitle>
              <DialogDescription>
                Ajuste os parâmetros de análise do sistema
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Frequência de Análise</label>
                <select className="w-full p-2 border border-border rounded-lg">
                  <option>A cada 2 horas</option>
                  <option>A cada 4 horas</option>
                  <option>Diariamente</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Confiança Mínima (%)</label>
                <input type="range" min="70" max="95" defaultValue="80" className="w-full" />
                <div className="text-xs text-muted-foreground">80%</div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Histórico de Análise</label>
                <select className="w-full p-2 border border-border rounded-lg">
                  <option>Últimos 7 dias</option>
                  <option>Últimos 15 dias</option>
                  <option>Últimos 30 dias</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Cancelar
              </Button>
              <Button className="conffec-button-primary" onClick={() => setIsConfigOpen(false)}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status da IA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status da IA</p>
              <p className="text-lg font-bold">Ativa</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sugestões Hoje</p>
              <p className="text-lg font-bold">3</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Melhoria Estimada</p>
              <p className="text-lg font-bold">+18%</p>
            </div>
          </div>
        </div>

        <div className="conffec-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
              <p className="text-lg font-bold">91%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estações de Trabalho */}
      <div className="conffec-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Estações de Trabalho</h3>
              <p className="text-sm text-muted-foreground">Status atual das estações e operadores</p>
            </div>
            
            <Button className="conffec-button-secondary gap-2">
              <Users className="w-4 h-4" />
              Gerenciar Operadores
            </Button>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estação</TableHead>
              <TableHead>Operadores</TableHead>
              <TableHead>Tempo Médio</TableHead>
              <TableHead>Eficiência</TableHead>
              <TableHead>Carga</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {estacoes.map((estacao) => (
              <TableRow key={estacao.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {estacao.gargalo && <AlertCircle className="w-4 h-4 text-error" />}
                    <span className="font-medium">{estacao.nome}</span>
                  </div>
                </TableCell>
                <TableCell>{estacao.operadores}</TableCell>
                <TableCell>{estacao.tempoMedio}</TableCell>
                <TableCell>
                  <span className={`font-medium ${
                    estacao.eficiencia >= 90 ? 'text-success' : 
                    estacao.eficiencia >= 85 ? 'text-warning' : 'text-error'
                  }`}>
                    {estacao.eficiencia}%
                  </span>
                </TableCell>
                <TableCell>{getCargaBadge(estacao.carga)}</TableCell>
                <TableCell>
                  {estacao.gargalo ? (
                    <Badge className="bg-error/10 text-error border-error/20">Gargalo</Badge>
                  ) : (
                    <Badge className="bg-success/10 text-success border-success/20">Normal</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Sugestões da IA */}
      <div className="conffec-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Sugestões da IA
              </h3>
              <p className="text-sm text-muted-foreground">Recomendações baseadas na análise dos dados históricos</p>
            </div>
            
            <Button className="conffec-button-primary gap-2">
              <Bot className="w-4 h-4" />
              Nova Análise
            </Button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {sugestoes.map((sugestao) => (
            <div 
              key={sugestao.id} 
              className={`border rounded-lg p-4 ${
                sugestao.aceita === true ? 'border-success/20 bg-success/5' :
                sugestao.aceita === false ? 'border-error/20 bg-error/5' :
                'border-border bg-background'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground">{sugestao.titulo}</h4>
                    {getPrioridadeBadge(sugestao.prioridade)}
                    <Badge variant="outline">{sugestao.tipo}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {sugestao.descricao}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="font-medium text-success">{sugestao.impacto}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Confiança:</span>
                      <span className="font-medium">{sugestao.confianca}%</span>
                    </div>
                  </div>
                </div>
                
                {sugestao.aceita === null && (
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      className="conffec-button-primary"
                      onClick={() => aceitarSugestao(sugestao.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Aceitar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => rejeitarSugestao(sugestao.id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Ignorar
                    </Button>
                  </div>
                )}
                
                {sugestao.aceita === true && (
                  <Badge className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Aceita
                  </Badge>
                )}
                
                {sugestao.aceita === false && (
                  <Badge className="bg-error/10 text-error border-error/20">
                    <X className="w-3 h-3 mr-1" />
                    Ignorada
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Como funciona */}
      <div className="conffec-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          Como Funciona a IA
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-lg font-bold text-primary">1</span>
            </div>
            <h4 className="font-semibold mb-2">Coleta de Dados</h4>
            <p className="text-sm text-muted-foreground">
              Analisa histórico de produção, tempos por operador e eficiência das estações
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-lg font-bold text-primary">2</span>
            </div>
            <h4 className="font-semibold mb-2">Análise Inteligente</h4>
            <p className="text-sm text-muted-foreground">
              Identifica gargalos, padrões de eficiência e oportunidades de melhoria
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-lg font-bold text-primary">3</span>
            </div>
            <h4 className="font-semibold mb-2">Sugestões Personalizadas</h4>
            <p className="text-sm text-muted-foreground">
              Propõe realocações e otimizações com base nos dados analisados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceamentoIA;
