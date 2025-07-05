
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  Target,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle2
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Componente de confetes
const Confetti = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Simular conquista de meta (normalmente viria de uma verificação real)
    const timer = setTimeout(() => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!showConfetti) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-primary mb-2">
            Parabéns Grupo Costura A!
          </h2>
          <p className="text-xl text-success">
            Meta Atingida! 🎯
          </p>
        </div>
      </div>
      
      {/* Animação de confetes simples com CSS */}
      <div className="confetti-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#00D084', '#3B82F6', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 4)]
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 3s linear infinite;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const metasGerais = [
  { periodo: 'Jan', meta: 2500, realizado: 2680 },
  { periodo: 'Fev', meta: 2600, realizado: 2420 },
  { periodo: 'Mar', meta: 2800, realizado: 2950 },
  { periodo: 'Abr', meta: 2700, realizado: 2580 },
  { periodo: 'Mai', meta: 2900, realizado: 3100 },
  { periodo: 'Jun', meta: 3000, realizado: 2890 },
];

const metasPorGrupo = [
  {
    id: 1,
    grupo: "Costura A",
    setor: "Costura",
    metaAtual: 850,
    realizado: 920,
    percentual: 108,
    status: "Meta Atingida",
    ultimaAtualizacao: "Hoje, 14:30"
  },
  {
    id: 2,
    grupo: "Costura B",
    setor: "Costura",
    metaAtual: 720,
    realizado: 680,
    percentual: 94,
    status: "Em Andamento",
    ultimaAtualizacao: "Hoje, 13:45"
  },
  {
    id: 3,
    grupo: "Corte Principal",
    setor: "Corte",
    metaAtual: 1200,
    realizado: 1156,
    percentual: 96,
    status: "Em Andamento",
    ultimaAtualizacao: "Hoje, 15:20"
  },
  {
    id: 4,
    grupo: "Acabamento A",
    setor: "Acabamento",
    metaAtual: 600,
    realizado: 645,
    percentual: 108,
    status: "Meta Atingida",
    ultimaAtualizacao: "Hoje, 12:15"
  }
];

const Metas = () => {
  const [periodoView, setPeriodoView] = useState("mensal");

  const getStatusBadge = (status: string, percentual: number) => {
    if (percentual >= 100) {
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Meta Atingida
        </Badge>
      );
    } else if (percentual >= 90) {
      return <Badge className="bg-warning/10 text-warning border-warning/20">Próximo da Meta</Badge>;
    } else {
      return <Badge className="bg-error/10 text-error border-error/20">Abaixo da Meta</Badge>;
    }
  };

  const getIndicadorVisual = (percentual: number) => {
    const color = percentual >= 100 ? '#00D084' : percentual >= 90 ? '#F59E0B' : '#EF4444';
    return (
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-300" 
          style={{ 
            width: `${Math.min(percentual, 100)}%`,
            backgroundColor: color
          }}
        ></div>
      </div>
    );
  };

  const totalRealizado = metasPorGrupo.reduce((acc, grupo) => acc + grupo.realizado, 0);
  const totalMeta = metasPorGrupo.reduce((acc, grupo) => acc + grupo.metaAtual, 0);
  const percentualGeral = (totalRealizado / totalMeta) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <Confetti />
      
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Metas</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho geral e por grupos</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={periodoView} onValueChange={setPeriodoView}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diario">Visão Diária</SelectItem>
              <SelectItem value="semanal">Visão Semanal</SelectItem>
              <SelectItem value="mensal">Visão Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metas gerais da empresa */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 conffec-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Metas Gerais da Empresa
              </h3>
              <p className="text-sm text-muted-foreground">
                Produção vs Meta - Últimos 6 meses
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Realizado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
                <span>Meta</span>
              </div>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metasGerais}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="periodo" 
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
                <Bar dataKey="meta" fill="#00D084" opacity={0.3} />
                <Bar dataKey="realizado" fill="#00D084" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="conffec-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Resumo Geral
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Progresso Total</span>
                <span className="font-bold text-lg">{percentualGeral.toFixed(1)}%</span>
              </div>
              {getIndicadorVisual(percentualGeral)}
              <p className="text-sm text-muted-foreground mt-1">
                {totalRealizado} / {totalMeta} peças
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <Award className="w-6 h-6 text-success mx-auto mb-1" />
                <p className="text-lg font-bold text-success">2</p>
                <p className="text-xs text-success">Metas Atingidas</p>
              </div>
              <div className="text-center p-3 bg-warning/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-warning mx-auto mb-1" />
                <p className="text-lg font-bold text-warning">2</p>
                <p className="text-xs text-warning">Em Andamento</p>
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Este Mês</span>
              </div>
              <p className="text-2xl font-bold text-primary">{totalRealizado}</p>
              <p className="text-sm text-muted-foreground">
                peças produzidas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metas por grupo */}
      <div className="conffec-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Metas por Grupo
        </h3>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Grupo</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Meta Atual</TableHead>
              <TableHead>Realizado</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Atualização</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metasPorGrupo.map((meta) => (
              <TableRow key={meta.id}>
                <TableCell className="font-medium">{meta.grupo}</TableCell>
                <TableCell>
                  <Badge variant="outline">{meta.setor}</Badge>
                </TableCell>
                <TableCell>{meta.metaAtual} peças</TableCell>
                <TableCell>
                  <span className={`font-medium ${
                    meta.percentual >= 100 ? 'text-success' : 'text-foreground'
                  }`}>
                    {meta.realizado} peças
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{meta.percentual}%</span>
                    </div>
                    {getIndicadorVisual(meta.percentual)}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(meta.status, meta.percentual)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {meta.ultimaAtualizacao}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Metas;
