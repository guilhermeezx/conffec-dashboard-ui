
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Página não encontrada</h2>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="conffec-button-primary gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="gap-2">
            <Link to="javascript:history.back()">
              <ArrowLeft className="w-4 h-4" />
              Página Anterior
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
