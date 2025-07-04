import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3,
  Calendar,
  Download
} from "lucide-react";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Dados simulados
const receitaDespesaData = [
  { mes: 'Jan', receita: 42000, despesa: 35000, lucro: 7000 },
  { mes: 'Fev', receita: 38000, despesa: 32000, lucro: 6000 },
  { mes: 'Mar', receita: 45000, despesa: 36000, lucro: 9000 },
  { mes: 'Abr', receita: 48000, despesa: 38000, lucro: 10000 },
  { mes: 'Mai', receita: 52000, despesa: 40000, lucro: 12000 },
  { mes: 'Jun', receita: 55000, despesa: 42000, lucro: 13000 },
  { mes: 'Jul', receita: 58000, despesa: 44000, lucro: 14000 },
  { mes: 'Ago', receita: 61000, despesa: 46000, lucro: 15000 },
  { mes: 'Set', receita: 59000, despesa: 45000, lucro: 14000 },
  { mes: 'Out', receita: 63000, despesa: 48000, lucro: 15000 },
  { mes: 'Nov', receita: 65000, despesa: 49000, lucro: 16000 },
];

const eficienciaData = [
  { mes: 'Jul', eficiencia: 85 },
  { mes: 'Ago', eficiencia: 87 },
  { mes: 'Set', eficiencia: 83 },
  { mes: 'Out', eficiencia: 89 },
  { mes: 'Nov', eficiencia: 91 },
];

const custosData = [
  { categoria: 'Matéria Prima', valor: 18500, cor: '#00D084' },
  { categoria: 'Mão de Obra', valor: 15200, cor: '#00664F' },
  { categoria: 'Overhead', valor: 8300, cor: '#3B82F6' },
  { categoria: 'Transporte', valor: 4200, cor: '#F59E0B' },
  { categoria: 'Outros', valor: 2800, cor: '#EF4444' },
];

const Indicadores = () => {
  const [periodoComparacao, setPeriodoComparacao] = useState("mensal");
  const [tipoVisualização, setTipoVisualização] = useState("receita");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Indicadores</h1>
          <p className="text-muted-foreground">Análise comparativa e métricas de performance</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={periodoComparacao} onValueChange={setPeriodoComparacao}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Relatório
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Margem de Lucro"
          value="24,6%"
          change={{ value: "2,3%", trend: "up" }}
          subtitle="últimos 30 dias"
          icon={TrendingUp}
        />
        
        <MetricCard
          title="ROI"
          value="18,5%"
          change={{ value: "1,2%", trend: "up" }}
          subtitle="retorno sobre investimento"
          icon={Target}
        />
        
        <MetricCard
          title="Produtividade"
          value="91%"
          change={{ value: "4,1%", trend: "up" }}
          subtitle="eficiência média"
          icon={BarChart3}
        />
        
        <MetricCard
          title="Ticket Médio"
          value="R$ 145,50"
          change={{ value: "6,8%", trend: "down" }}
          subtitle="por ordem"
          icon={TrendingDown}
        />
      </div>

      {/* Gráficos Comparativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receita vs Despesas vs Lucro */}
        <div className="conffec-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Performance Financeira
              </h3>
              <p className="text-sm text-muted-foreground">
                Evolução mensal comparativa
              </p>
            </div>
            
            <Select value={tipoVisualização} onValueChange={setTipoVisualização}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receita">Receita/Despesa</SelectItem>
                <SelectItem value="lucro">Lucro Líquido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {tipoVisualização === "receita" ? (
                <BarChart data={receitaDespesaData}>
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
              ) : (
                <LineChart data={receitaDespesaData}>
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
                  <Line 
                    type="monotone" 
                    dataKey="lucro" 
                    stroke="#00D084" 
                    strokeWidth={3}
                    dot={{ fill: '#00D084', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Eficiência Produtiva */}
        <div className="conffec-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Eficiência Produtiva
              </h3>
              <p className="text-sm text-muted-foreground">
                Percentual de eficiência mensal
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">91%</div>
              <div className="text-sm text-success">+4,1%</div>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={eficienciaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="mes" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  domain={[75, 95]}
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
                  formatter={(value) => [`${value}%`, 'Eficiência']}
                />
                <Line 
                  type="monotone" 
                  dataKey="eficiencia" 
                  stroke="#00D084" 
                  strokeWidth={3}
                  dot={{ fill: '#00D084', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Análise de Custos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 conffec-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Distribuição de Custos
              </h3>
              <p className="text-sm text-muted-foreground">
                Breakdown dos custos por categoria
              </p>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={custosData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="valor"
                >
                  {custosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0px 2px 6px rgba(0,0,0,0.06)'
                  }}
                  formatter={(value) => [`R$ ${value}`, 'Valor']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="conffec-card p-4">
            <h4 className="font-semibold text-foreground mb-3">Metas vs Resultados</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Receita Mensal</span>
                  <span className="font-medium">108%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-xs text-success mt-1">Meta: R$ 60.000 | Real: R$ 65.000</p>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Margem de Lucro</span>
                  <span className="font-medium">96%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
                <p className="text-xs text-warning mt-1">Meta: 25% | Real: 24%</p>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Eficiência</span>
                  <span className="font-medium">101%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-xs text-success mt-1">Meta: 90% | Real: 91%</p>
              </div>
            </div>
          </div>

          <div className="conffec-card p-4">
            <h4 className="font-semibold text-foreground mb-3">Resumo do Período</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Receita Total:</span>
                <span className="font-medium">R$ 65.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Despesas:</span>
                <span className="font-medium">R$ 49.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lucro Líquido:</span>
                <span className="font-medium text-success">R$ 16.000</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="text-muted-foreground">Crescimento:</span>
                <span className="font-medium text-success">+12,3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legenda dos custos */}
      <div className="conffec-card p-6">
        <h4 className="font-semibold text-foreground mb-4">Detalhamento de Custos</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {custosData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: item.cor }}
              ></div>
              <div>
                <p className="text-sm font-medium">{item.categoria}</p>
                <p className="text-xs text-muted-foreground">R$ {item.valor.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Indicadores;
