import { Clock } from "lucide-react";
import type { Service } from "../../types/appointment";
import { Skeleton } from "../ui/skeleton";

interface ServiceSelectorProps {
  services: Service[];
  selected: number | null;
  onSelect: (id: number) => void;
  isLoading: boolean;
  error: string | null;
}

export function ServiceSelector({ services, selected, onSelect, isLoading, error }: ServiceSelectorProps) {
  if (isLoading) {
    return (
      <div>
        <p className="text-foreground mb-3 font-semibold text-sm">¿Qué servicio necesitás?</p>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="text-foreground mb-3 font-semibold text-sm">¿Qué servicio necesitás?</p>
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div>
        <p className="text-foreground mb-3 font-semibold text-sm">¿Qué servicio necesitás?</p>
        <p className="text-muted-foreground text-sm">No hay servicios disponibles</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-foreground mb-3 font-semibold text-sm">¿Qué servicio necesitás?</p>
      <div className="grid grid-cols-2 gap-2">
        {services.map((s) => {
          const active = selected === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="text-left p-3 rounded-xl border transition-all"
              style={{
                borderColor: active ? "var(--color-primary)" : "var(--color-border)",
                background: active ? "var(--color-accent)" : "var(--color-card)",
              }}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-primary font-bold text-xs">${s.price.toLocaleString()}</span>
              </div>
              <div className="text-foreground text-xs font-semibold leading-tight">{s.name}</div>
              <div className="text-muted-foreground flex items-center gap-1 mt-0.5 text-xs">
                <Clock className="w-3 h-3" /> {s.durationMinutes} min
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
