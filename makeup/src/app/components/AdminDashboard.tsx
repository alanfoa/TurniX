import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Scissors,
  Clock,
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserCheck,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  BarChart3,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: CalendarDays, label: "Turnos", id: "turnos", badge: 8 },
  { icon: Users, label: "Profesionales", id: "profesionales" },
  { icon: Scissors, label: "Servicios", id: "servicios" },
  { icon: Clock, label: "Horarios", id: "horarios" },
  { icon: UserCheck, label: "Clientes", id: "clientes" },
  { icon: Settings, label: "Configuración", id: "config" },
];

const WEEKLY_DATA = [
  { day: "Lun", pendientes: 4, confirmados: 12, cancelados: 1 },
  { day: "Mar", pendientes: 6, confirmados: 15, cancelados: 2 },
  { day: "Mié", pendientes: 3, confirmados: 18, cancelados: 0 },
  { day: "Jue", pendientes: 8, confirmados: 14, cancelados: 3 },
  { day: "Vie", pendientes: 5, confirmados: 22, cancelados: 1 },
  { day: "Sáb", pendientes: 2, confirmados: 28, cancelados: 2 },
  { day: "Dom", pendientes: 1, confirmados: 8, cancelados: 0 },
];

const INCOME_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  ingresos: Math.floor(Math.random() * 15000) + 8000,
}));

const TOP_SERVICES = [
  { name: "Corte de Cabello", value: 38, fill: "#0ea5e9" },
  { name: "Corte + Barba", value: 27, fill: "#6366f1" },
  { name: "Coloración", value: 18, fill: "#10b981" },
  { name: "Barba", value: 12, fill: "#f59e0b" },
  { name: "Otros", value: 5, fill: "#e2e8f0" },
];

const UPCOMING_APPOINTMENTS = [
  { time: "09:00", client: "Matías Rodríguez", service: "Corte de Cabello", professional: "Carlos Méndez", status: "confirmed", avatar: "MR", color: "#0ea5e9" },
  { time: "09:30", client: "Sofía Blanco", service: "Coloración", professional: "Valeria Torres", status: "confirmed", avatar: "SB", color: "#8b5cf6" },
  { time: "10:00", client: "Tomás García", service: "Barba & Perfilado", professional: "Diego Ramos", status: "pending", avatar: "TG", color: "#10b981" },
  { time: "10:30", client: "Juliana Vega", service: "Keratina", professional: "Luciana Paz", status: "confirmed", avatar: "JV", color: "#f59e0b" },
  { time: "11:00", client: "Rodrigo Soto", service: "Corte + Barba", professional: "Carlos Méndez", status: "cancelled", avatar: "RS", color: "#ef4444" },
  { time: "11:30", client: "Laura Méndez", service: "Coloración", professional: "Valeria Torres", status: "pending", avatar: "LM", color: "#f97316" },
  { time: "12:00", client: "Andrés Ruiz", service: "Corte de Cabello", professional: "Diego Ramos", status: "confirmed", avatar: "AR", color: "#0ea5e9" },
  { time: "14:00", client: "Carolina Flores", service: "Depilación Cejas", professional: "Luciana Paz", status: "confirmed", avatar: "CF", color: "#ec4899" },
  { time: "14:30", client: "Emilio Torres", service: "Barba & Perfilado", professional: "Carlos Méndez", status: "pending", avatar: "ET", color: "#6366f1" },
  { time: "15:00", client: "Natalia Ortiz", service: "Keratina", professional: "Valeria Torres", status: "cancelled", avatar: "NO", color: "#64748b" },
];

const STATUS_CONFIG = {
  confirmed: { label: "Confirmado", bg: "#dcfce7", color: "#15803d", dot: "#16a34a" },
  pending: { label: "Pendiente", bg: "#fef9c3", color: "#854d0e", dot: "#ca8a04" },
  cancelled: { label: "Cancelado", bg: "#fee2e2", color: "#991b1b", dot: "#dc2626" },
};

const STATS = [
  { label: "Turnos Hoy", value: "28", change: "+12%", positive: true, icon: CalendarDays, color: "#0ea5e9", bg: "#e0f2fe" },
  { label: "Ingresos Hoy", value: "$47.200", change: "+8.5%", positive: true, icon: DollarSign, color: "#10b981", bg: "#dcfce7" },
  { label: "Clientes Nuevos", value: "6", change: "+3", positive: true, icon: UserCheck, color: "#6366f1", bg: "#ede9fe" },
  { label: "Tasa Confirmación", value: "87%", change: "-2%", positive: false, icon: Star, color: "#f59e0b", bg: "#fef3c7" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#e2e8f0] rounded-lg p-3 shadow-lg">
        <p className="text-[#64748b] mb-1" style={{ fontSize: 11, fontWeight: 600 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>
            {p.name}: {typeof p.value === "number" && p.value > 1000 ? `$${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AdminDashboard({ onGoToLanding }: { onGoToLanding: () => void }) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Sidebar */}
      <aside
        className="flex-shrink-0 flex flex-col border-r border-[#e2e8f0] bg-white transition-all duration-300 z-40"
        style={{ width: sidebarOpen || window.innerWidth >= 1024 ? 240 : 72 }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-[#e2e8f0] gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0ea5e9] flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <span className="text-[#1e293b] transition-opacity" style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", opacity: sidebarOpen ? 1 : 0, whiteSpace: "nowrap", overflow: "hidden" }}>
            TurniX
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-[#94a3b8] hover:text-[#1e293b] transition-colors lg:hidden"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-all relative group"
                style={{ background: active ? "#e0f2fe" : "transparent" }}
              >
                {active && <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#0ea5e9] rounded-r-full" />}
                <Icon className="w-5 h-5 flex-shrink-0" style={{ color: active ? "#0ea5e9" : "#94a3b8" }} />
                <span
                  className="transition-all"
                  style={{
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    color: active ? "#0ea5e9" : "#64748b",
                    opacity: sidebarOpen ? 1 : 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    width: sidebarOpen ? "auto" : 0,
                  }}
                >
                  {item.label}
                </span>
                {item.badge && sidebarOpen && (
                  <span className="ml-auto bg-[#0ea5e9] text-white rounded-full px-1.5" style={{ fontSize: 10, fontWeight: 700 }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Back to Landing */}
        <div className="p-4 border-t border-[#e2e8f0]">
          <button
            onClick={onGoToLanding}
            className="w-full flex items-center gap-2 text-[#94a3b8] hover:text-[#0ea5e9] transition-colors"
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            <span style={{ opacity: sidebarOpen ? 1 : 0, whiteSpace: "nowrap", overflow: "hidden" }}>
              Ver Landing
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center px-4 sm:px-6 gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#94a3b8] hover:text-[#1e293b] transition-colors lg:block"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar turnos, clientes..."
              className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#0ea5e9] transition-colors"
              style={{ fontSize: 13, color: "#1e293b" }}
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notifications */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#e0f2fe] transition-colors">
              <Bell className="w-4 h-4 text-[#64748b]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full border-2 border-white" />
            </button>
            {/* Avatar */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#6366f1] flex items-center justify-center">
                <span className="text-white" style={{ fontSize: 12, fontWeight: 700 }}>AD</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-[#1e293b]" style={{ fontSize: 13, fontWeight: 600 }}>Admin</div>
                <div className="text-[#94a3b8]" style={{ fontSize: 11 }}>Barbería Elite</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-[#1e293b]" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Dashboard</h1>
            <p className="text-[#64748b]" style={{ fontSize: 13 }}>Miércoles, 11 de junio 2025 · Barbería Elite</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                      <Icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                    <div
                      className="flex items-center gap-0.5"
                      style={{ fontSize: 11, fontWeight: 600, color: stat.positive ? "#16a34a" : "#dc2626" }}
                    >
                      {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-[#1e293b]" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>{stat.value}</div>
                  <div className="text-[#94a3b8]" style={{ fontSize: 12, fontWeight: 500 }}>{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Charts row */}
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            {/* Bar chart */}
            <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[#1e293b]" style={{ fontSize: 15, fontWeight: 600 }}>Turnos de la Semana</h2>
                  <p className="text-[#94a3b8]" style={{ fontSize: 12 }}>Lunes a Domingo</p>
                </div>
                <div className="flex items-center gap-3">
                  {[{ color: "#0ea5e9", label: "Confirmados" }, { color: "#fbbf24", label: "Pendientes" }, { color: "#fca5a5", label: "Cancelados" }].map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                      <span className="text-[#64748b]" style={{ fontSize: 11, fontWeight: 500 }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={WEEKLY_DATA} barSize={10} barGap={2}>
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

            {/* Donut chart */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-[#1e293b]" style={{ fontSize: 15, fontWeight: 600 }}>Top Servicios</h2>
                <p className="text-[#94a3b8]" style={{ fontSize: 12 }}>Este mes</p>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={TOP_SERVICES}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {TOP_SERVICES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {TOP_SERVICES.map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.fill }} />
                      <span className="text-[#64748b]" style={{ fontSize: 11 }}>{s.name}</span>
                    </div>
                    <span className="text-[#1e293b]" style={{ fontSize: 11, fontWeight: 600 }}>{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Line chart */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[#1e293b]" style={{ fontSize: 15, fontWeight: 600 }}>Ingresos — Últimos 30 días</h2>
                <p className="text-[#94a3b8]" style={{ fontSize: 12 }}>Mayo · Junio 2025</p>
              </div>
              <div className="flex items-center gap-1.5 text-[#16a34a]" style={{ fontSize: 12, fontWeight: 600 }}>
                <TrendingUp className="w-4 h-4" />
                +18% vs. mes anterior
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={INCOME_DATA}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  name="Ingresos"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#0ea5e9", strokeWidth: 2, stroke: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Upcoming Appointments Table */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0]">
              <div>
                <h2 className="text-[#1e293b]" style={{ fontSize: 15, fontWeight: 600 }}>Próximos Turnos</h2>
                <p className="text-[#94a3b8]" style={{ fontSize: 12 }}>Hoy · {UPCOMING_APPOINTMENTS.length} turnos</p>
              </div>
              <button className="flex items-center gap-1 text-[#0ea5e9] hover:text-[#0284c7] transition-colors" style={{ fontSize: 13, fontWeight: 600 }}>
                Ver todos <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f1f5f9]">
                    {["Hora", "Cliente", "Servicio", "Profesional", "Estado"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[#94a3b8]" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em" }}>
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {UPCOMING_APPOINTMENTS.map((appt, i) => {
                    const status = STATUS_CONFIG[appt.status as keyof typeof STATUS_CONFIG];
                    return (
                      <tr
                        key={i}
                        className="border-b border-[#f8fafc] hover:bg-[#f8fafc] transition-colors"
                      >
                        <td className="px-5 py-3">
                          <span className="text-[#1e293b]" style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                            {appt.time}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: appt.color + "22" }}
                            >
                              <span style={{ fontSize: 10, fontWeight: 700, color: appt.color }}>{appt.avatar}</span>
                            </div>
                            <span className="text-[#1e293b]" style={{ fontSize: 13, fontWeight: 500 }}>{appt.client}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-[#64748b]" style={{ fontSize: 13 }}>{appt.service}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-[#64748b]" style={{ fontSize: 13 }}>{appt.professional}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                            style={{ background: status.bg, color: status.color, fontSize: 11, fontWeight: 600 }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
