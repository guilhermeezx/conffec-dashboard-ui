
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Factory, Users, BarChart3, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Factory className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Conffec</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestão Industrial</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/auth">Entrar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Gerencie sua Confecção
            <br />
            <span className="text-primary">com Eficiência</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sistema completo de gestão para confecções com controle de produção, 
            metas, colaboradores e muito mais.
          </p>
          
          <div className="flex justify-center gap-4">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link to="/auth">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Factory className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Controle de Produção</CardTitle>
              <CardDescription>
                Gerencie ordens de produção, registre quantidades e acompanhe o progresso em tempo real.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Gestão de Colaboradores</CardTitle>
              <CardDescription>
                Organize equipes, defina roles e acompanhe o desempenho de cada colaborador.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Indicadores e Metas</CardTitle>
              <CardDescription>
                Defina metas, acompanhe indicadores e tome decisões baseadas em dados.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Shield className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Segurança Avançada</CardTitle>
              <CardDescription>
                Sistema de permissões por role, auditoria de ações e proteção de dados.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Factory className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Documentos ABVTEX</CardTitle>
              <CardDescription>
                Gerencie documentos e certificações necessárias para compliance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Relatórios Detalhados</CardTitle>
              <CardDescription>
                Relatórios completos de produção, financeiro e performance da equipe.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Pronto para começar?
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Acesse o sistema e comece a gerenciar sua confecção de forma profissional.
          </p>
          <Button size="lg" className="text-lg px-12" asChild>
            <Link to="/auth">
              Entrar no Sistema
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
