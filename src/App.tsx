
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Producao from "./pages/Producao";
import ProducaoDetalhes from "./pages/ProducaoDetalhes";
import Grupos from "./pages/Grupos";
import Metas from "./pages/Metas";
import Colaboradores from "./pages/Colaboradores";
import ColaboradorPerfil from "./pages/ColaboradorPerfil";
import Perfil from "./pages/Perfil";
import CustoMinuto from "./pages/CustoMinuto";
import Fiscal from "./pages/Fiscal";
import Documentos from "./pages/Documentos";
import Financeiro from "./pages/Financeiro";
import Indicadores from "./pages/Indicadores";
import BalanceamentoIA from "./pages/BalanceamentoIA";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen w-full bg-muted">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout />
                  </SidebarProvider>
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="producao" element={<Producao />} />
                <Route path="producao/:id" element={<ProducaoDetalhes />} />
                <Route path="grupos" element={
                  <ProtectedRoute requiredRoles={['admin', 'ceo', 'encarregado']}>
                    <Grupos />
                  </ProtectedRoute>
                } />
                <Route path="metas" element={
                  <ProtectedRoute requiredRoles={['admin', 'ceo', 'encarregado']}>
                    <Metas />
                  </ProtectedRoute>
                } />
                <Route path="colaboradores" element={<Colaboradores />} />
                <Route path="colaboradores/:id" element={<ColaboradorPerfil />} />
                <Route path="colaboradorPerfil/:id" element={<ColaboradorPerfil />} />
                <Route path="perfil" element={<Perfil />} />
                <Route path="custo-minuto" element={<CustoMinuto />} />
                <Route path="fiscal" element={<Fiscal />} />
                <Route path="documentos" element={
                  <ProtectedRoute requiredRoles={['admin']}>
                    <Documentos />
                  </ProtectedRoute>
                } />
                <Route path="financeiro" element={
                  <ProtectedRoute requiredRoles={['admin', 'ceo', 'financeiro']}>
                    <Financeiro />
                  </ProtectedRoute>
                } />
                <Route path="indicadores" element={<Indicadores />} />
                <Route path="balanceamento-ia" element={<BalanceamentoIA />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
