import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, CalendarDays, Users, Scissors, Clock, UserCheck,
  Menu, X, ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { NotificationBell } from "../notifications/NotificationBell";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: CalendarDays, label: "Turnos", path: "/dashboard/turnos" },
  { icon: Users, label: "Profesionales", path: "/dashboard/profesionales" },
  { icon: Scissors, label: "Servicios", path: "/dashboard/servicios" },
  { icon: Clock, label: "Horarios", path: "/dashboard/horarios" },
  { icon: UserCheck, label: "Clientes", path: "/dashboard/clientes" },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`flex-shrink-0 flex flex-col border-r border-border bg-card transition-all duration-300 z-40
          fixed lg:static inset-y-0 left-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ width: sidebarOpen ? 240 : 72 }}
      >
        <div className="h-16 flex items-center px-4 border-b border-border gap-3">
          <Link to="/" className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-primary-foreground" />
          </Link>
          <span
            className="text-foreground transition-opacity font-bold tracking-tight"
            style={{
              opacity: sidebarOpen ? 1 : 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            TurniX
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors hidden lg:block"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-all relative group"
                style={{ background: active ? "var(--color-accent)" : "transparent" }}
              >
                {active && <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary rounded-r-full" />}
                <Icon className="w-5 h-5 flex-shrink-0" style={{ color: active ? "var(--color-primary)" : "var(--color-muted-foreground)" }} />
                <span
                  className="transition-all text-sm"
                  style={{
                    fontWeight: active ? 600 : 500,
                    color: active ? "var(--color-primary)" : "var(--color-muted-foreground)",
                    opacity: sidebarOpen ? 1 : 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    width: sidebarOpen ? "auto" : 0,
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            <span style={{ opacity: sidebarOpen ? 1 : 0, whiteSpace: "nowrap", overflow: "hidden" }}>
              Ver Landing
            </span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-card border-b border-border flex items-center px-4 sm:px-6 gap-4 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <NotificationBell />
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">
                  {user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) ?? "AD"}
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="text-foreground text-sm font-semibold">{user?.name ?? "Admin"}</div>
                <div className="text-muted-foreground text-xs">Administrador</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-muted-foreground hover:text-foreground text-sm font-medium ml-2"
            >
              Salir
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
