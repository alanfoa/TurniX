import { CheckCircle } from "lucide-react";
import type { Service, Professional } from "../../types/appointment";

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span
        className="text-sm"
        style={{
          fontWeight: accent ? 700 : 600,
          color: accent ? "var(--color-primary)" : "var(--color-foreground)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

interface BookingConfirmationProps {
  service: Service | null;
  professional: Professional | null;
  date: number | null;
  time: string | null;
  month: number;
  year: number;
  isCreating: boolean;
  error?: string | null;
}

export function BookingConfirmation({ service, professional, date, time, month, year, isCreating, error }: BookingConfirmationProps) {
  return (
    <div>
      <p className="text-foreground mb-4 font-semibold text-sm">Revisá tu reserva</p>
      <div className="bg-muted border border-border rounded-xl p-4 space-y-3 mb-4">
        <Row label="Servicio" value={service?.name ?? "—"} />
        <Row label="Duración" value={service ? `${service.durationMinutes} min` : "—"} />
        <Row label="Profesional" value={professional?.name ?? "—"} />
        <Row label="Fecha" value={date ? `${date} de ${MONTHS[month]}, ${year}` : "—"} />
        <Row label="Horario" value={time ?? "—"} />
        <div className="border-t border-border pt-3">
          <Row label="Total" value={service ? `$${service.price.toLocaleString()}` : "—"} accent />
        </div>
      </div>
      {isCreating && (
        <div className="flex items-center justify-center gap-2 text-primary text-sm font-semibold">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          Creando turno...
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 mb-3">
          <p className="text-red-700 text-xs leading-relaxed">{error}</p>
        </div>
      )}
      {!error && !isCreating && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-green-700 text-xs leading-relaxed">
            Recibirás confirmación por WhatsApp al instante y un recordatorio 24 hs antes.
          </p>
        </div>
      )}
    </div>
  );
}
