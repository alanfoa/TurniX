import { useEffect, useState } from "react";
import { CalendarDays, DollarSign, UserCheck, Star, TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Link } from "react-router-dom";
import { fetchDashboardStats } from "../../api/dashboard";
import type { DashboardStats } from "../../api/dashboard";
import { toast } from "sonner";

const RANGE_OPTIONS = [
  { value: "today" as const, label: "Hoy" },
  { value: "week" as const, label: "Semana" },
  { value: "month" as const, label: "Mes" },
];

const STATUS_MAP: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  CONFIRMED: { label: "Confirmado", bg: "#dcfce7", color: "#15803d", dot: "#16a34a" },
  PENDING: { label: "Pendiente", bg: "#fef9c3", color: "#854d0e", dot: "#ca8a04" },
  CANCELLED: { label: "Cancelado", bg: "#fee2e2", color: "#991b1b", dot: "#dc2626" },
};

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-muted-foreground mb-1 text-xs font-semibold">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>
            {p.name}: {typeof p.value === "number" && p.value > 1000 ? `$${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [range, setRange] = useState<"today" | "week" | "month">("week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDashboardStats(range)
      .then(setStats)
      .catch(() => toast.error("Error al cargar estadísticas"))
      .finally(() => setLoading(false));
  }, [range]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-muted-foreground text-sm">Error al cargar estadísticas</div>;
  }

  const statCards = [
    { label: "Turnos Hoy", value: stats.todayAppointments.toString(), change: "—", positive: true, icon: CalendarDays, color: "#0ea5e9", bg: "#e0f2fe" },
    { label: "Ingresos Hoy", value: `$${stats.todayRevenue.toLocaleString()}`, change: "—", positive: true, icon: DollarSign, color: "#10b981", bg: "#dcfce7" },
    { label: "Clientes Nuevos", value: stats.newClientsThisWeek.toString(), change: `+${stats.newClientsThisWeek}`, positive: true, icon: UserCheck, color: "#6366f1", bg: "#ede9fe" },
    { label: "Tasa Confirmación", value: `${stats.confirmationRate}%`, change: `${stats.confirmationRate}%`, positive: stats.confirmationRate >= 50, icon: Star, color: "#f59e0b", bg: "#fef3c7" },
  ];

  const PIE_COLORS = ["#0ea5e9", "#6366f1", "#10b981", "#f59e0b", "#e2e8f0"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-foreground font-bold text-2xl tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Resumen del negocio</p>
        </div>
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${range === r.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: stat.positive ? "#16a34a" : "#dc2626" }}>
                  {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-foreground text-2xl font-bold tracking-tight">{stat.value}</div>
              <div className="text-muted-foreground text-xs font-medium">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Weekly bar chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-foreground text-sm font-semibold">Turnos de la Semana</h2>
              <p className="text-muted-foreground text-xs">Lunes a Domingo</p>
            </div>
            <div className="flex items-center gap-3">
              {[{ color: "#0ea5e9", label: "Confirmados" }, { color: "#fbbf24", label: "Pendientes" }, { color: "#fca5a5", label: "Cancelados" }].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span className="text-muted-foreground text-xs font-medium">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.weeklyAppointments} barSize={10} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="confirmados" name="Confirmados" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
              <Bar dataKey="pendientes" name="Pendientes" fill="#fbbf24" radius={[3, 3, 0, 0]} />
              <Bar dataKey="cancelados" name="Cancelados" fill="#fca5a5" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top services donut */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-foreground text-sm font-semibold">Top Servicios</h2>
            <p className="text-muted-foreground text-xs">Este período</p>
          </div>
          {stats.topServices.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={stats.topServices}
                    cx="50%" cy="50%"
                    innerRadius={45} outerRadius={70}
                    paddingAngle={2} dataKey="count"
                    nameKey="name"
                  >
                    {stats.topServices.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {stats.topServices.map((s, i) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-muted-foreground text-xs">{s.name}</span>
                    </div>
                    <span className="text-foreground text-xs font-semibold">{s.percentage}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">Sin datos</p>
          )}
        </div>
      </div>

      {/* Professional performance */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm mb-6">
        <h2 className="text-foreground text-sm font-semibold mb-4">Rendimiento de Profesionales</h2>
        {stats.professionalPerformance.length > 0 ? (
          <div className="space-y-3">
            {stats.professionalPerformance.map((p) => {
              const maxAppts = Math.max(...stats.professionalPerformance.map((x) => x.appointments));
              const pct = maxAppts > 0 ? (p.appointments / maxAppts) * 100 : 0;
              return (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-foreground text-sm font-medium">{p.name}</span>
                    <span className="text-muted-foreground text-xs">{p.appointments} turnos · ${p.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Sin datos</p>
        )}
      </div>

      {/* Today's timeline */}
      {stats.todayTimeline.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm mb-6">
          <h2 className="text-foreground text-sm font-semibold mb-4">Turnos de Hoy</h2>
          <div className="space-y-0">
            {stats.todayTimeline.map((t, i) => {
              const st = STATUS_MAP[t.status] ?? STATUS_MAP.PENDING;
              return (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-muted last:border-0">
                  <span className="text-foreground text-sm font-semibold tabular-nums w-12">{t.time}</span>
                  <div className="flex-1">
                    <span className="text-foreground text-sm font-medium">{t.client}</span>
                    <span className="text-muted-foreground text-xs ml-2">{t.service}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: st.bg, color: st.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming appointments */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-foreground text-sm font-semibold">Próximos Turnos</h2>
            <p className="text-muted-foreground text-xs">{stats.upcomingAppointments.length} turnos</p>
          </div>
          <Link to="/dashboard/turnos" className="flex items-center gap-1 text-primary hover:text-sky-600 transition-colors text-sm font-semibold">
            Ver todos <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {stats.upcomingAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-muted">
                  {["Fecha", "Hora", "Cliente", "Servicio", "Profesional", "Estado"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-muted-foreground text-xs font-semibold tracking-wider uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.upcomingAppointments.map((a) => {
                  const st = STATUS_MAP[a.status] ?? STATUS_MAP.PENDING;
                  return (
                    <tr key={a.id} className="border-b border-muted hover:bg-muted transition-colors">
                      <td className="px-5 py-3 text-foreground text-sm font-medium">{new Date(a.date).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-foreground text-sm font-semibold tabular-nums">{a.startTime}</td>
                      <td className="px-5 py-3 text-foreground text-sm">{a.user.name}</td>
                      <td className="px-5 py-3 text-muted-foreground text-sm">{a.service.name}</td>
                      <td className="px-5 py-3 text-muted-foreground text-sm">{a.professional.name}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: st.bg, color: st.color }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5 text-muted-foreground text-sm">No hay próximos turnos</div>
        )}
      </div>
    </div>
  );
}
