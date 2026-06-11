import type { Professional } from "../../types/appointment";
import { Skeleton } from "../ui/skeleton";

interface ProfessionalSelectorProps {
  professionals: Professional[];
  selected: number | null;
  onSelect: (id: number) => void;
  isLoading: boolean;
  error: string | null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e"];

export function ProfessionalSelector({ professionals, selected, onSelect, isLoading, error }: ProfessionalSelectorProps) {
  if (isLoading) {
    return (
      <div>
        <p className="text-foreground mb-3 font-semibold text-sm">¿Con quién querés reservar?</p>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="text-foreground mb-3 font-semibold text-sm">¿Con quién querés reservar?</p>
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  if (professionals.length === 0) {
    return (
      <div>
        <p className="text-foreground mb-3 font-semibold text-sm">¿Con quién querés reservar?</p>
        <p className="text-muted-foreground text-sm">No hay profesionales disponibles</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-foreground mb-3 font-semibold text-sm">¿Con quién querés reservar?</p>
      <div className="space-y-2">
        {professionals.map((p, idx) => {
          const active = selected === p.id;
          const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all"
              style={{
                borderColor: active ? "var(--color-primary)" : "var(--color-border)",
                background: active ? "var(--color-accent)" : "var(--color-card)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background: p.imageUrl ? "transparent" : color + "22" }}
              >
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span style={{ color, fontWeight: 700, fontSize: 13 }}>{getInitials(p.name)}</span>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="text-foreground text-sm font-semibold">{p.name}</div>
                {p.specialty && <div className="text-muted-foreground text-xs">{p.specialty}</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
