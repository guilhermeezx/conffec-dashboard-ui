
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricCard } from "@/components/ui/metric-card";
import { 
  Calculator, 
  DollarSign, 
  Clock, 
  TrendingUp,
  Save,
  Info
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";

// Dados históricos simulados
const historicoData = [
  { mes: 'Jul', custo: 0.85 },
  { mes: 'Ago', custo: 0.92 },
  { mes: 'Set', custo: 0.88 },
  { mes: 'Out', custo: 0.95 },
  { mes: 'Nov', custo: 0.91 },
];

const CustoMinuto = () => {
  const [folhaMensal, setFolhaMensal] = useState("45000");
  const [overhead, setOverhead] = useState("12000");
  const [minutosProductivos, setMinutosProductivos] = useState("38400");

  // Cálculo do custo minuto
  const custoMinuto = ((parseFloat(folhaMensal) + parseFloat(overhead)) / parseFloat(minutosProductivos)).toFixed(4);
  const custoMinutoFormatado = `€ ${custoMinuto}`;

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-fade-in">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Custo Minuto</h1>
            <p className="text-muted-foreground">Calcule e acompanhe o custo por minuto de produção</p>
          </div>
        </div>

        {/* Calculadora de Custo Minuto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="conffec-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Calculadora</h3>
                <p className="text-sm text-muted-foreground">Insira os dados para calcular o custo minuto</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="folha">Folha de Pagamento Mensal</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Soma de todos os salários, encargos e benefícios dos funcionários</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="folha"
                    type="number"
                    value={folhaMensal}
                    onChange={(e) => setFolhaMensal(e.target.value)}
                    className="pl-9"
                    placeholder="45000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="overhead">Overhead Mensal</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Custos fixos: aluguel, energia, água, manutenção, etc.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="overhead"
                    type="number"
                    value={overhead}
                    onChange={(e) => setOverhead(e.target.value)}
                    className="pl-9"
                    placeholder="12000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="minutos">Minutos Produtivos/Mês</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total de minutos efetivamente trabalhados na produção</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="minutos"
                    type="number"
                    value={minutosProductivos}
                    onChange={(e) => setMinutosProductivos(e.target.value)}
                    className="pl-9"
                    placeholder="38400"
                  />
                </div>
              </div>

              <Button className="w-full conffec-button-primary gap-2">
                <Save className="w-4 h-4" />
                Salvar Configuração
              </Button>
            </div>
          </div>

          {/* Resultado do Cálculo */}
          <div className="space-y-6">
            <div className="conffec-card p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Custo Minuto Atual</h3>
              <p className="text-4xl font-bold text-primary mb-2">{custoMinutoFormatado}</p>
              <p className="text-sm text-muted-foreground">por minuto de produção</p>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Cálculo:</p>
                <p className="text-sm font-mono">
                  (€{folhaMensal} + €{overhead}) ÷ {minutosProductivos} = {custoMinutoFormatado}
                </p>
              </div>
            </div>

            {/* Meta e Comparação */}
            <MetricCard
              title="Meta do Custo Minuto"
              value="€ 0,90"
              change={{ value: "5,6%", trend: "up" }}
              subtitle="objetivo mensal"
              icon={TrendingUp}
            />
          </div>
        </div>

        {/* Histórico Mensal */}
        <div className="conffec-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Histórico do Custo Minuto
              </h3>
              <p className="text-sm text-muted-foreground">
                Evolução dos últimos 5 meses
              </p>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="mes" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickLine={{ stroke: '#E5E7EB' }}
                  domain={['dataMin - 0.05', 'dataMax + 0.05']}
                />
                <ChartTooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0px 2px 6px rgba(0,0,0,0.06)'
                  }}
                  formatter={(value) => [`€ ${value}`, 'Custo Minuto']}
                />
                <Line 
                  type="monotone" 
                  dataKey="custo" 
                  stroke="#00D084" 
                  strokeWidth={3}
                  dot={{ fill: '#00D084', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dicas e Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="conffec-card p-6">
            <h4 className="font-semibold text-foreground mb-3">💡 Dicas para Reduzir Custos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Otimize o tempo de setup entre operações</li>
              <li>• Treine operadores para aumentar eficiência</li>
              <li>• Reduza desperdícios de material</li>
              <li>• Monitore custos de energia e utilities</li>
            </ul>
          </div>
          
          <div className="conffec-card p-6">
            <h4 className="font-semibold text-foreground mb-3">📊 Análise do Período</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Variação mensal:</span>
                <span className="text-sm font-medium text-success">-4,2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tendência:</span>
                <span className="text-sm font-medium">Estável</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">vs. Meta:</span>
                <span className="text-sm font-medium text-primary">+1,1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CustoMinuto;
