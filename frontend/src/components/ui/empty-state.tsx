import { cn } from "../../lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {icon && <div className="text-muted-foreground mb-4">{icon}</div>}
      <h3 className="text-foreground font-semibold text-sm mb-1">{title}</h3>
      {description && <p className="text-muted-foreground text-xs max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}
