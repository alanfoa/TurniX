import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { fetchMyAppointments } from "../../api/appointments";
import { updateAppointmentStatus } from "../../api/dashboard";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/ui/empty-state";
import { Pagination } from "../../components/ui/pagination";
import type { Appointment } from "../../types/appointment";
import { toast } from "sonner";

const STATUS_STYLES: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  PENDING: { label: "Pendiente", bg: "#fef9c3", color: "#854d0e", dot: "#ca8a04" },
  CONFIRMED: { label: "Confirmado", bg: "#dcfce7", color: "#15803d", dot: "#16a34a" },
  CANCELLED: { label: "Cancelado", bg: "#fee2e2", color: "#991b1b", dot: "#dc2626" },
};

const PAGE_SIZE = 15;

export default function AppointmentsManager() {
  const [list, setList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async (p: number) => {
    setLoading(true);
    try {
      const res = await fetchMyAppointments(p, PAGE_SIZE);
      setList(res.data);
      setTotalPages(res.totalPages);
    } catch { toast.error("Error al cargar"); }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  const handleStatus = async (id: number, status: string) => {
    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Turno ${status === "CONFIRMED" ? "confirmado" : "cancelado"}`);
      load(page);
    } catch { toast.error("Error al actualizar"); }
  };

  const filtered = filter === "ALL" ? list : list.filter((a) => a.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-foreground font-bold text-2xl tracking-tight">Turnos</h1>
          <p className="text-muted-foreground text-sm">Gestioná todos los turnos</p>
        </div>
        <div className="flex gap-2">
          {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
            >
              {f === "ALL" ? "Todos" : STATUS_STYLES[f]?.label ?? f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-5 space-y-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<CalendarDays className="w-8 h-8" />} title="No hay turnos" description={filter === "ALL" ? "No se registraron turnos todavía" : `No hay turnos en estado ${STATUS_STYLES[filter]?.label ?? filter}`} />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Fecha", "Hora", "Cliente", "Servicio", "Profesional", "Estado", "Total", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-muted-foreground text-xs font-semibold tracking-wider uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const st = STATUS_STYLES[a.status] ?? STATUS_STYLES.PENDING;
                return (
                  <tr key={a.id} className="border-b border-muted hover:bg-muted transition-colors">
                    <td className="px-5 py-3 text-foreground text-sm font-medium">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-foreground text-sm font-semibold tabular-nums">{a.startTime} - {a.endTime}</td>
                    <td className="px-5 py-3 text-foreground text-sm">{a.user.name}</td>
                    <td className="px-5 py-3 text-muted-foreground text-sm">{a.service.name}</td>
                    <td className="px-5 py-3 text-muted-foreground text-sm">{a.professional.name}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: st.bg, color: st.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-foreground text-sm font-semibold">${a.price.toLocaleString()}</td>
                    <td className="px-5 py-3 flex gap-2">
                      {a.status === "PENDING" && (
                        <>
                          <button onClick={() => handleStatus(a.id, "CONFIRMED")} className="text-green-600 hover:text-green-700 text-sm font-medium">Confirmar</button>
                          <button onClick={() => handleStatus(a.id, "CANCELLED")} className="text-destructive hover:text-red-600 text-sm font-medium">Cancelar</button>
                        </>
                      )}
                      {a.status === "CONFIRMED" && (
                        <button onClick={() => handleStatus(a.id, "CANCELLED")} className="text-destructive hover:text-red-600 text-sm font-medium">Cancelar</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {filtered.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
