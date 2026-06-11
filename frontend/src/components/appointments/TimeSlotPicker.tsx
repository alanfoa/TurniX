import type { TimeSlot } from "../../types/appointment";
import { Skeleton } from "../ui/skeleton";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selected: string | null;
  onSelect: (time: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function TimeSlotPicker({ slots, selected, onSelect, isLoading, error }: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <div>
        <p className="text-foreground mb-3 font-semibold text-sm">Elegí un horario disponible</p>
        <div className="grid grid-cols-4 gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="text-foreground mb-3 font-semibold text-sm">Elegí un horario disponible</p>
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div>
        <p className="text-foreground mb-3 font-semibold text-sm">Elegí un horario disponible</p>
        <p className="text-muted-foreground text-sm">No hay horarios disponibles para esta fecha</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-foreground mb-3 font-semibold text-sm">Elegí un horario disponible</p>
      <div className="grid grid-cols-4 gap-1.5">
        {slots.map((s) => {
          const active = selected === s.startTime;
          return (
            <button
              key={s.startTime}
              onClick={() => onSelect(s.startTime)}
              className="py-2 rounded-lg text-center transition-all border text-xs font-semibold"
              style={{
                borderColor: active ? "var(--color-primary)" : "var(--color-border)",
                background: active ? "var(--color-primary)" : "var(--color-card)",
                color: active ? "var(--color-primary-foreground)" : "var(--color-foreground)",
              }}
            >
              {s.startTime}
            </button>
          );
        })}
      </div>
    </div>
  );
}
