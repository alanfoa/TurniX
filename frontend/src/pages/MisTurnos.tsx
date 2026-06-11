import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, ArrowLeft, XCircle } from "lucide-react";
import { fetchMyAppointments } from "../api/appointments";
import { updateAppointmentStatus } from "../api/dashboard";
import type { Appointment } from "../types/appointment";
import { toast } from "sonner";

const STATUS_MAP: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  CONFIRMED: { label: "Confirmado", bg: "#dcfce7", color: "#15803d", dot: "#16a34a" },
  PENDING: { label: "Pendiente", bg: "#fef9c3", color: "#854d0e", dot: "#ca8a04" },
  CANCELLED: { label: "Cancelado", bg: "#fee2e2", color: "#991b1b", dot: "#dc2626" },
};

function AppointmentCard({ a, onCancel }: { a: Appointment; onCancel: (id: number) => void }) {
  const st = STATUS_MAP[a.status] ?? STATUS_MAP.PENDING;
  const isPast = new Date(a.date) < new Date(new Date().toDateString());
  const canCancel = a.status === "PENDING" && !isPast;

  return (
    <div className={`bg-card border border-border rounded-xl p-5 shadow-sm ${isPast ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <div className="text-foreground font-semibold text-sm">{a.service.name}</div>
            <div className="text-muted-foreground text-xs">{a.professional.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: st.bg, color: st.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
            {st.label}
          </span>
          {canCancel && (
            <button
              onClick={() => onCancel(a.id)}
              className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Cancelar turno"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>{new Date(a.date).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{a.startTime} — {a.endTime}</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        ${a.price.toLocaleString()} · {a.durationMinutes} min
      </div>
    </div>
  );
}

export default function MisTurnos() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchMyAppointments(1, 100)
      .then((res) => setAppointments(res.data))
      .catch(() => toast.error("Error al cargar turnos"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id: number) => {
    if (!confirm("¿Cancelar este turno?")) return;
    try {
      await updateAppointmentStatus(id, "CANCELLED");
      toast.success("Turno cancelado");
      load();
    } catch {
      toast.error("Error al cancelar turno");
    }
  };

  const now = new Date(new Date().toDateString());
  const upcoming = appointments.filter((a) => new Date(a.date) >= now && a.status !== "CANCELLED");
  const history = appointments.filter((a) => new Date(a.date) < now || a.status === "CANCELLED");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm font-medium mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        <h1 className="text-foreground font-bold text-2xl tracking-tight mb-1">Mis Turnos</h1>
        <p className="text-muted-foreground text-sm mb-6">Gestioná tus turnos activos y revisá tu historial</p>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {/* Upcoming */}
            <h2 className="text-foreground font-semibold text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Próximos Turnos
            </h2>
            {upcoming.length > 0 ? (
              <div className="space-y-3 mb-8">
                {upcoming.map((a) => <AppointmentCard key={a.id} a={a} onCancel={handleCancel} />)}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-6 text-center mb-8">
                <p className="text-muted-foreground text-sm">No tenés turnos próximos.</p>
                <Link to="/#booking" className="text-primary hover:text-sky-600 text-sm font-semibold mt-1 inline-block">
                  Reservar un turno
                </Link>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <>
                <h2 className="text-foreground font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  Historial
                </h2>
                <div className="space-y-3">
                  {history.map((a) => <AppointmentCard key={a.id} a={a} onCancel={handleCancel} />)}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
