
import { MetricCard } from "@/components/ui/metric-card";
import ConffecIcon from "@/components/ui/conffec-icon";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  DollarSign, 
  Clock,
  ArrowUp,
  ArrowDown,
  Plus,
  Download,
  Factory
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

// Dados simulados para o gráfico
const productionData = [
  { date: '18 Out', producao: 45, meta: 50 },
  { date: '19 Out', producao: 52, meta: 50 },
  { date: '20 Out', producao: 48, meta: 50 },
  { date: '21 Out', producao: 61, meta: 50 },
  { date: '22 Out', producao: 55, meta: 50 },
  { date: '23 Out', producao: 67, meta: 50 },
  { date: '24 Out', producao: 43, meta: 50 },
  { date: '25 Out', producao: 52, meta: 50 },
  { date: '26 Out', producao: 58, meta: 50 },
  { date: '27 Out', producao: 65, meta: 50 },
  { date: '28 Out', producao: 47, meta: 50 },
  { date: '29 Out', producao: 60, meta: 50 },
  { date: '30 Out', producao: 55, meta: 50 },
  { date: '31 Out', producao: 62, meta: 50 },
  { date: '1 Nov', producao: 58, meta: 50 },
  { date: '2 Nov', producao: 54, meta: 50 },
  { date: '9 Nov', producao: 59, meta: 50 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua confecção</p>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Produzido"
          value="1.247"
          change={{ value: "15,8%", trend: "up" }}
          subtitle="peças este mês"
          icon={Factory}
        />
        
        <MetricCard
          title="Eficiência Média"
          value="87,5%"
          change={{ value: "5,2%", trend: "up" }}
          subtitle="da equipe"
          icon={TrendingUp}
        />
        
        <MetricCard
          title="Custo por Peça"
          value="R$ 12,45"
          change={{ value: "2,1%", trend: "down" }}
          subtitle="custo médio"
          icon={DollarSign}
        />
        
        <MetricCard
          title="Ordens em Andamento"
          value="23"
          subtitle="ordens ativas"
          icon={Clock}
        />
      </div>

      {/* Gráfico de fluxo de produção */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 conffec-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Fluxo de Produção
              </h3>
              <p className="text-sm text-muted-foreground">
                Peças produzidas vs meta diária
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Produção</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
                <span>Meta</span>
              </div>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
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
                <Line 
                  type="monotone" 
                  dataKey="producao" 
                  stroke="#00D084" 
                  strokeWidth={3}
                  dot={{ fill: '#00D084', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="meta" 
                  stroke="#00D084" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cards de indicadores laterais */}
        <div className="space-y-6">
          <div className="conffec-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-foreground">Produção Hoje</h4>
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <ArrowUp className="w-4 h-4 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">67 peças</p>
            <p className="text-sm text-success font-medium">+34% vs ontem</p>
          </div>

          <div className="conffec-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-foreground">Tempo Médio</h4>
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">23 min</p>
            <p className="text-sm text-muted-foreground">por peça</p>
          </div>

          <div className="conffec-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-foreground">Metas do Mês</h4>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Meta: 1.500 peças</span>
                <span className="font-medium">83%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button className="h-12 conffec-button-primary gap-2">
          <Plus className="w-4 h-4" />
          Nova Ordem de Produção
        </Button>
        
        <Button variant="outline" className="h-12 gap-2">
          <Download className="w-4 h-4" />
          Relatório Diário
        </Button>
        
        <Button variant="outline" className="h-12 gap-2">
          <Clock className="w-4 h-4" />
          Iniciar Timer
        </Button>
        
        <Button variant="outline" className="h-12 gap-2">
          <TrendingUp className="w-4 h-4" />
          Ver Indicadores
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
