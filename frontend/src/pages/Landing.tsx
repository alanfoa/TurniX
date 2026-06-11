import { Clock, ArrowRight, LayoutDashboard, CalendarDays, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookingFlow } from "../components/appointments/BookingFlow";
import { NotificationBell } from "../components/notifications/NotificationBell";

export default function Landing() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* NAVBAR */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-foreground font-extrabold tracking-tight">TurniX</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {["Cómo funciona", "Funciones", "Precios", "Blog"].map((item) => (
              <a key={item} href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-muted-foreground text-sm font-medium hidden sm:block">{user.name}</span>
                <NotificationBell />
                {user.role === "ADMIN" && (
                  <Link
                    to="/dashboard"
                    className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/mis-turnos"
                  className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                >
                  <CalendarDays className="w-4 h-4" />
                  Mis Turnos
                </Link>
                <Link
                  to="/perfil"
                  className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                >
                  <User className="w-4 h-4" />
                  Perfil
                </Link>
                <button
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground text-sm font-medium"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors text-sm font-semibold"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              PLATAFORMA DE GESTIÓN Nº 1
            </div>
            <h1 className="text-foreground mb-5 font-extrabold leading-tight tracking-tighter" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>
              Gestión de turnos
              <br />
              <span className="text-primary">sin fricción.</span>
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md text-lg leading-relaxed">
              Tus clientes reservan en segundos. Tú gestionas todo desde un panel intuitivo. Menos llamadas, más turnos confirmados.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#booking"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-sky-600 transition-all shadow-sm font-semibold text-sm"
              >
                Reservar Turno Gratis
                <ArrowRight className="w-4 h-4" />
              </a>
              <button className="bg-card text-foreground border border-border px-6 py-3 rounded-xl hover:border-primary hover:text-primary transition-all font-semibold text-sm">
                Ver Demo
              </button>
            </div>
            <div className="flex items-center gap-6 mt-8">
              {[["2.400+", "Negocios"], ["98%", "Satisfacción"], ["0$", "Comisiones"]].map(([val, label]) => (
                <div key={label}>
                  <div className="text-foreground font-bold text-xl">{val}</div>
                  <div className="text-muted-foreground text-xs font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BOOKING FLOW CARD */}
          <div id="booking">
            <BookingFlow />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-muted-foreground mb-2 text-center text-xs font-semibold tracking-widest">POR QUÉ TURNIX</p>
        <h2 className="text-foreground text-center mb-10 font-bold text-2xl tracking-tight">Todo lo que necesita tu negocio</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[
            { icon: "⚡", title: "Reservas en tiempo real", desc: "Disponibilidad sincronizada al instante. Sin dobles turnos, sin confusiones." },
            { icon: "📱", title: "100% Mobile-first", desc: "Tus clientes reservan desde cualquier dispositivo sin instalar nada." },
            { icon: "🔔", title: "Recordatorios automáticos", desc: "SMS y WhatsApp automáticos para reducir los no-shows hasta un 70%." },
            { icon: "📊", title: "Reportes y estadísticas", desc: "Panel de control con métricas clave de tu negocio en tiempo real." },
            { icon: "💳", title: "Pagos integrados", desc: "Acepta señas o pagos completos online. Cobros automáticos." },
            { icon: "🎨", title: "Tu marca, tu estilo", desc: "Página de reserva personalizable con los colores de tu negocio." },
          ].map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-sky-200 transition-all">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-foreground mb-1.5 font-semibold text-sm">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
