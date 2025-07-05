
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  User,
  FileText,
  Award,
  Clock,
  Target,
  Calendar,
  Download,
  Upload
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const colaboradorDados = {
  id: 1,
  nome: "João Silva",
  cpf: "123.456.789-00",
  funcao: "Operador de Costura",
  grupo: "Costura A",
  admissao: "15/01/2023",
  situacao: "Ativo",
  metasAtingidas: 8,
  premioZeroFalta: true,
  horasExtras: 12,
  salario: "R$ 2.450,00"
};

const documentos = [
  { tipo: "RG", nome: "rg_joao_silva.pdf", validade: "25/08/2029", status: "Válido" },
  { tipo: "CPF", nome: "cpf_joao_silva.pdf", validade: "-", status: "Válido" },
  { tipo: "Contrato", nome: "contrato_joao_silva.pdf", validade: "15/01/2025", status: "Válido" },
  { tipo: "Exames Médicos", nome: "exames_joao_silva.pdf", validade: "20/12/2024", status: "Vencendo" },
];

const metasHistorico = [
  { mes: "Novembro", meta: 850, realizado: 920, percentual: 108 },
  { mes: "Outubro", meta: 850, realizado: 795, percentual: 94 },
  { mes: "Setembro", meta: 800, realizado: 880, percentual: 110 },
  { mes: "Agosto", meta: 800, realizado: 756, percentual: 95 },
];

const ColaboradorPerfil = () => {
  const { id } = useParams();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Válido":
        return <Badge className="bg-success/10 text-success border-success/20">Válido</Badge>;
      case "Vencendo":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Vencendo</Badge>;
      case "Vencido":
        return <Badge className="bg-error/10 text-error border-error/20">Vencido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/colaboradores">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{colaboradorDados.nome}</h1>
            <p className="text-muted-foreground">{colaboradorDados.funcao} - {colaboradorDados.grupo}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Gerar Relatório
          </Button>
          <Button className="conffec-button-primary gap-2">
            <User className="w-4 h-4" />
            Editar Perfil
          </Button>
        </div>
      </div>

      {/* Informações principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dados pessoais */}
        <div className="conffec-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Dados Pessoais
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">CPF</p>
              <p className="font-medium">{colaboradorDados.cpf}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de Admissão</p>
              <p className="font-medium">{colaboradorDados.admissao}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Situação</p>
              <Badge className="bg-success/10 text-success border-success/20">
                {colaboradorDados.situacao}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Salário</p>
              <p className="font-medium text-lg">{colaboradorDados.salario}</p>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="conffec-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Performance
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Metas Atingidas</span>
                <span className="font-bold text-lg text-success">{colaboradorDados.metasAtingidas}/10</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full" 
                  style={{ width: `${(colaboradorDados.metasAtingidas / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {colaboradorDados.premioZeroFalta && (
              <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg">
                <Award className="w-5 h-5 text-success" />
                <span className="font-medium text-success">Prêmio Zero Falta</span>
              </div>
            )}
          </div>
        </div>

        {/* Horas extras */}
        <div className="conffec-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horas Extras
          </h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-secondary mb-1">{colaboradorDados.horasExtras}h</p>
            <p className="text-sm text-muted-foreground">Acumuladas este mês</p>
            <div className="mt-4 p-3 bg-secondary/10 rounded-lg">
              <p className="text-sm font-medium text-secondary">
                Valor estimado: R$ 156,00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de metas */}
      <div className="conffec-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Histórico de Metas (Últimos 4 meses)
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mês</TableHead>
              <TableHead>Meta</TableHead>
              <TableHead>Realizado</TableHead>
              <TableHead>Percentual</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metasHistorico.map((meta, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{meta.mes}</TableCell>
                <TableCell>{meta.meta} peças</TableCell>
                <TableCell>{meta.realizado} peças</TableCell>
                <TableCell>
                  <span className={`font-medium ${
                    meta.percentual >= 100 ? 'text-success' : 'text-warning'
                  }`}>
                    {meta.percentual}%
                  </span>
                </TableCell>
                <TableCell>
                  {meta.percentual >= 100 ? (
                    <Badge className="bg-success/10 text-success border-success/20">
                      Meta Atingida
                    </Badge>
                  ) : (
                    <Badge className="bg-warning/10 text-warning border-warning/20">
                      Abaixo da Meta
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Documentos */}
      <div className="conffec-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Documentos
          </h3>
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Adicionar Documento
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Nome do Arquivo</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentos.map((doc, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{doc.tipo}</TableCell>
                <TableCell>{doc.nome}</TableCell>
                <TableCell>{doc.validade}</TableCell>
                <TableCell>{getStatusBadge(doc.status)}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
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

export default ColaboradorPerfil;
