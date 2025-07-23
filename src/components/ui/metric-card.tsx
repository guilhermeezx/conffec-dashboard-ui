
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down";
  };
  subtitle?: string;
  icon?: LucideIcon | (() => JSX.Element);
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  subtitle,
  icon: Icon,
  className,
}: MetricCardProps) {
  return (
    <div className={cn("conffec-card p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-foreground mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        
        {Icon && (
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            {typeof Icon === 'function' && Icon.length === 0 ? (
              <Icon />
            ) : (
              <Icon className="w-5 h-5 text-primary" />
            )}
          </div>
        )}
      </div>
      
      {change && (
        <div className="mt-4 flex items-center gap-1">
          <span
            className={cn(
              "text-sm font-medium",
              change.trend === "up" ? "text-success" : "text-error"
            )}
          >
            {change.trend === "up" ? "+" : ""}{change.value}
          </span>
          <span className="text-xs text-muted-foreground">vs período anterior</span>
        </div>
      )}
    </div>
  );
}
