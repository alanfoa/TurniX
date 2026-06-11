import { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  ChevronRight,
  Scissors,
  Sparkles,
  Star,
  ArrowRight,
  LayoutDashboard,
  ChevronLeft,
} from "lucide-react";

const SERVICES = [
  { id: 1, name: "Corte de Cabello", duration: 30, price: 2500, icon: Scissors, category: "Cabello" },
  { id: 2, name: "Barba & Perfilado", duration: 20, price: 1500, icon: Sparkles, category: "Barba" },
  { id: 3, name: "Corte + Barba", duration: 50, price: 3500, icon: Star, category: "Combo" },
  { id: 4, name: "Coloración", duration: 90, price: 6000, icon: Sparkles, category: "Cabello" },
  { id: 5, name: "Keratina", duration: 120, price: 9000, icon: Star, category: "Tratamiento" },
  { id: 6, name: "Depilación Cejas", duration: 15, price: 800, icon: Scissors, category: "Estética" },
];

const PROFESSIONALS = [
  { id: 1, name: "Carlos Méndez", specialty: "Barbero Senior", initials: "CM", color: "#0ea5e9", rating: 4.9, reviews: 312 },
  { id: 2, name: "Valeria Torres", specialty: "Estilista & Color", initials: "VT", color: "#8b5cf6", rating: 4.8, reviews: 287 },
  { id: 3, name: "Diego Ramos", specialty: "Barbero Clásico", initials: "DR", color: "#10b981", rating: 4.7, reviews: 198 },
  { id: 4, name: "Luciana Paz", specialty: "Especialista Tratamientos", initials: "LP", color: "#f59e0b", rating: 4.9, reviews: 421 },
];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "14:00", "14:30", "15:00", "15:30", "16:00",
  "16:30", "17:00", "17:30", "18:00",
];
const UNAVAILABLE = ["10:30", "12:00", "15:00", "17:00"];

const STEPS = ["Servicio", "Profesional", "Fecha", "Horario", "Confirmación"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS = ["Do","Lu","Ma","Mi","Ju","Vi","Sá"];

export function LandingPage({ onGoToDashboard }: { onGoToDashboard: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedPro, setSelectedPro] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const today = new Date();
  const [calYear] = useState(today.getFullYear());
  const [calMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const service = SERVICES.find((s) => s.id === selectedService);
  const pro = PROFESSIONALS.find((p) => p.id === selectedPro);

  const canNext = () => {
    if (step === 1) return selectedService !== null;
    if (step === 2) return selectedPro !== null;
    if (step === 3) return selectedDate !== null;
    if (step === 4) return selectedTime !== null;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-[#e2e8f0] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0ea5e9] flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#1e293b]" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>
              TurniX
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Cómo funciona", "Funciones", "Precios", "Blog"].map((item) => (
              <a key={item} href="#" className="text-[#64748b] hover:text-[#1e293b] transition-colors" style={{ fontSize: 14, fontWeight: 500 }}>
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onGoToDashboard}
              className="hidden sm:flex items-center gap-1.5 text-[#64748b] hover:text-[#1e293b] transition-colors"
              style={{ fontSize: 14, fontWeight: 500 }}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button className="bg-[#0ea5e9] text-white px-4 py-2 rounded-lg hover:bg-[#0284c7] transition-colors" style={{ fontSize: 14, fontWeight: 600 }}>
              Sacar Turno
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#e0f2fe] text-[#0369a1] px-3 py-1.5 rounded-full mb-6" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] inline-block" />
              PLATAFORMA DE GESTIÓN Nº 1
            </div>
            <h1 className="text-[#1e293b] mb-5" style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}>
              Gestión de turnos
              <br />
              <span className="text-[#0ea5e9]">sin fricción.</span>
            </h1>
            <p className="text-[#64748b] mb-8 max-w-md" style={{ fontSize: 17, lineHeight: 1.65 }}>
              Tus clientes reservan en segundos. Tú gestionas todo desde un panel intuitivo. Menos llamadas, más turnos confirmados.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-[#0ea5e9] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#0284c7] transition-all shadow-sm" style={{ fontWeight: 600, fontSize: 15 }}>
                Reservar Turno Gratis
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-white text-[#1e293b] border border-[#e2e8f0] px-6 py-3 rounded-xl hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition-all" style={{ fontWeight: 600, fontSize: 15 }}>
                Ver Demo
              </button>
            </div>
            <div className="flex items-center gap-6 mt-8">
              {[["2.400+", "Negocios"], ["98%", "Satisfacción"], ["0$", "Comisiones"]].map(([val, label]) => (
                <div key={label}>
                  <div className="text-[#1e293b]" style={{ fontWeight: 700, fontSize: 20 }}>{val}</div>
                  <div className="text-[#94a3b8]" style={{ fontSize: 12, fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BOOKING FLOW CARD */}
          <div>
            <BookingFlow
              step={step}
              setStep={setStep}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              selectedPro={selectedPro}
              setSelectedPro={setSelectedPro}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              confirmed={confirmed}
              setConfirmed={setConfirmed}
              canNext={canNext}
              service={service}
              pro={pro}
              calYear={calYear}
              calMonth={calMonth}
              daysInMonth={daysInMonth}
              firstDay={firstDay}
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-[#94a3b8] mb-2 text-center" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em" }}>POR QUÉ TURNIX</p>
        <h2 className="text-[#1e293b] text-center mb-10" style={{ fontWeight: 700, fontSize: 28, letterSpacing: "-0.02em" }}>Todo lo que necesita tu negocio</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[
            { icon: "⚡", title: "Reservas en tiempo real", desc: "Disponibilidad sincronizada al instante. Sin dobles turnos, sin confusiones." },
            { icon: "📱", title: "100% Mobile-first", desc: "Tus clientes reservan desde cualquier dispositivo sin instalar nada." },
            { icon: "🔔", title: "Recordatorios automáticos", desc: "SMS y WhatsApp automáticos para reducir los no-shows hasta un 70%." },
            { icon: "📊", title: "Reportes y estadísticas", desc: "Panel de control con métricas clave de tu negocio en tiempo real." },
            { icon: "💳", title: "Pagos integrados", desc: "Acepta señas o pagos completos online. Cobros automáticos." },
            { icon: "🎨", title: "Tu marca, tu estilo", desc: "Página de reserva personalizable con los colores de tu negocio." },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-[#e2e8f0] rounded-xl p-6 hover:shadow-md hover:border-[#bae6fd] transition-all">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-[#1e293b] mb-1.5" style={{ fontWeight: 600, fontSize: 15 }}>{f.title}</h3>
              <p className="text-[#64748b]" style={{ fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function BookingFlow({
  step, setStep,
  selectedService, setSelectedService,
  selectedPro, setSelectedPro,
  selectedDate, setSelectedDate,
  selectedTime, setSelectedTime,
  confirmed, setConfirmed,
  canNext, service, pro,
  calYear, calMonth, daysInMonth, firstDay,
}: any) {
  if (confirmed) {
    return (
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[#16a34a]" />
        </div>
        <h3 className="text-[#1e293b] mb-2" style={{ fontWeight: 700, fontSize: 20 }}>¡Turno Confirmado!</h3>
        <p className="text-[#64748b] mb-6" style={{ fontSize: 14 }}>
          Recibirás un recordatorio 24 hs antes por WhatsApp.
        </p>
        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 text-left mb-6 space-y-2">
          <Row label="Servicio" value={service?.name} />
          <Row label="Profesional" value={pro?.name} />
          <Row label="Fecha" value={`${selectedDate} de ${MONTHS[calMonth]}, ${calYear}`} />
          <Row label="Horario" value={selectedTime} />
          <Row label="Total" value={`$${service?.price?.toLocaleString()}`} accent />
        </div>
        <button
          onClick={() => { setStep(1); setSelectedService(null); setSelectedPro(null); setSelectedDate(null); setSelectedTime(null); setConfirmed(false); }}
          className="w-full bg-[#0ea5e9] text-white py-2.5 rounded-lg hover:bg-[#0284c7] transition-colors"
          style={{ fontWeight: 600, fontSize: 14 }}
        >
          Nueva Reserva
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden">
      {/* Progress bar */}
      <div className="px-6 pt-5 pb-4 border-b border-[#e2e8f0]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#64748b]" style={{ fontSize: 12, fontWeight: 500 }}>
            Paso {step} de {STEPS.length}
          </span>
          <span className="text-[#0ea5e9]" style={{ fontSize: 12, fontWeight: 600 }}>{STEPS[step - 1]}</span>
        </div>
        <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0ea5e9] rounded-full transition-all duration-500"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="flex mt-2.5">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all"
                style={{
                  background: i + 1 < step ? "#0ea5e9" : i + 1 === step ? "#e0f2fe" : "#f1f5f9",
                  color: i + 1 < step ? "#fff" : i + 1 === step ? "#0ea5e9" : "#94a3b8",
                  fontWeight: 600,
                  fontSize: 10,
                }}
              >
                {i + 1 < step ? <CheckCircle className="w-3 h-3" /> : i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-5" style={{ minHeight: 320 }}>
        {step === 1 && <ServiceSelector selected={selectedService} onSelect={setSelectedService} />}
        {step === 2 && <ProfessionalSelector selected={selectedPro} onSelect={setSelectedPro} />}
        {step === 3 && <DatePickerStep selected={selectedDate} onSelect={setSelectedDate} year={calYear} month={calMonth} daysInMonth={daysInMonth} firstDay={firstDay} />}
        {step === 4 && <TimeSlotPicker selected={selectedTime} onSelect={setSelectedTime} />}
        {step === 5 && <BookingConfirmation service={service} pro={pro} date={selectedDate} time={selectedTime} month={calMonth} year={calYear} />}
      </div>

      {/* Navigation */}
      <div className="px-5 pb-5 flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-[#e2e8f0] text-[#64748b] rounded-lg hover:bg-[#f8fafc] transition-colors"
            style={{ fontSize: 14, fontWeight: 500 }}
          >
            <ChevronLeft className="w-4 h-4" /> Atrás
          </button>
        )}
        {step < 5 ? (
          <button
            onClick={() => canNext() && setStep(step + 1)}
            disabled={!canNext()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all"
            style={{
              background: canNext() ? "#0ea5e9" : "#f1f5f9",
              color: canNext() ? "#fff" : "#94a3b8",
              fontWeight: 600,
              fontSize: 14,
              cursor: canNext() ? "pointer" : "not-allowed",
            }}
          >
            Continuar <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setConfirmed(true)}
            className="flex-1 bg-[#0ea5e9] text-white py-2.5 rounded-lg hover:bg-[#0284c7] transition-colors flex items-center justify-center gap-2"
            style={{ fontWeight: 600, fontSize: 14 }}
          >
            <CheckCircle className="w-4 h-4" /> Confirmar Turno
          </button>
        )}
      </div>
    </div>
  );
}

function ServiceSelector({ selected, onSelect }: { selected: number | null; onSelect: (id: number) => void }) {
  return (
    <div>
      <p className="text-[#1e293b] mb-3" style={{ fontWeight: 600, fontSize: 14 }}>¿Qué servicio necesitás?</p>
      <div className="grid grid-cols-2 gap-2">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          const active = selected === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="text-left p-3 rounded-xl border transition-all"
              style={{
                borderColor: active ? "#0ea5e9" : "#e2e8f0",
                background: active ? "#e0f2fe" : "#fff",
              }}
            >
              <div className="flex items-start justify-between mb-1">
                <Icon className="w-4 h-4" style={{ color: active ? "#0ea5e9" : "#94a3b8" }} />
                <span className="text-[#0ea5e9]" style={{ fontSize: 11, fontWeight: 700 }}>${s.price.toLocaleString()}</span>
              </div>
              <div className="text-[#1e293b]" style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{s.name}</div>
              <div className="text-[#94a3b8] flex items-center gap-1 mt-0.5" style={{ fontSize: 11 }}>
                <Clock className="w-3 h-3" /> {s.duration} min
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProfessionalSelector({ selected, onSelect }: { selected: number | null; onSelect: (id: number) => void }) {
  return (
    <div>
      <p className="text-[#1e293b] mb-3" style={{ fontWeight: 600, fontSize: 14 }}>¿Con quién querés reservar?</p>
      <div className="space-y-2">
        {PROFESSIONALS.map((p) => {
          const active = selected === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all"
              style={{
                borderColor: active ? "#0ea5e9" : "#e2e8f0",
                background: active ? "#e0f2fe" : "#fff",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: p.color + "22" }}
              >
                <span style={{ color: p.color, fontWeight: 700, fontSize: 13 }}>{p.initials}</span>
              </div>
              <div className="flex-1 text-left">
                <div className="text-[#1e293b]" style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div className="text-[#64748b]" style={{ fontSize: 11 }}>{p.specialty}</div>
              </div>
              <div className="text-right">
                <div className="text-[#f59e0b] flex items-center gap-0.5 justify-end" style={{ fontSize: 11, fontWeight: 600 }}>
                  ★ {p.rating}
                </div>
                <div className="text-[#94a3b8]" style={{ fontSize: 10 }}>{p.reviews} reseñas</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DatePickerStep({ selected, onSelect, year, month, daysInMonth, firstDay }: any) {
  const today = new Date().getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[#1e293b]" style={{ fontWeight: 600, fontSize: 14 }}>Elegí una fecha</p>
        <span className="text-[#64748b]" style={{ fontSize: 13, fontWeight: 500 }}>{MONTHS[month]} {year}</span>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[#94a3b8] py-1" style={{ fontSize: 11, fontWeight: 600 }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const past = day < today;
          const active = selected === day;
          return (
            <button
              key={i}
              disabled={past}
              onClick={() => !past && onSelect(day)}
              className="aspect-square rounded-lg flex items-center justify-center transition-all"
              style={{
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                background: active ? "#0ea5e9" : day === today ? "#e0f2fe" : "transparent",
                color: active ? "#fff" : past ? "#cbd5e1" : day === today ? "#0ea5e9" : "#1e293b",
                cursor: past ? "not-allowed" : "pointer",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimeSlotPicker({ selected, onSelect }: { selected: string | null; onSelect: (t: string) => void }) {
  return (
    <div>
      <p className="text-[#1e293b] mb-3" style={{ fontWeight: 600, fontSize: 14 }}>Elegí un horario disponible</p>
      <div className="grid grid-cols-4 gap-1.5">
        {TIME_SLOTS.map((t) => {
          const unavailable = UNAVAILABLE.includes(t);
          const active = selected === t;
          return (
            <button
              key={t}
              disabled={unavailable}
              onClick={() => !unavailable && onSelect(t)}
              className="py-2 rounded-lg text-center transition-all border"
              style={{
                fontSize: 12,
                fontWeight: 600,
                borderColor: active ? "#0ea5e9" : unavailable ? "#f1f5f9" : "#e2e8f0",
                background: active ? "#0ea5e9" : unavailable ? "#f8fafc" : "#fff",
                color: active ? "#fff" : unavailable ? "#cbd5e1" : "#1e293b",
                cursor: unavailable ? "not-allowed" : "pointer",
                textDecoration: unavailable ? "line-through" : "none",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
      <p className="text-[#94a3b8] mt-3" style={{ fontSize: 11 }}>
        <span className="inline-block w-2 h-2 rounded-sm bg-[#f1f5f9] border border-[#e2e8f0] mr-1" />
        Horario no disponible
      </p>
    </div>
  );
}

function BookingConfirmation({ service, pro, date, time, month, year }: any) {
  return (
    <div>
      <p className="text-[#1e293b] mb-4" style={{ fontWeight: 600, fontSize: 14 }}>Revisá tu reserva</p>
      <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 space-y-3 mb-4">
        <Row label="Servicio" value={service?.name ?? "—"} />
        <Row label="Duración" value={service ? `${service.duration} min` : "—"} />
        <Row label="Profesional" value={pro?.name ?? "—"} />
        <Row label="Fecha" value={date ? `${date} de ${MONTHS[month]}, ${year}` : "—"} />
        <Row label="Horario" value={time ?? "—"} />
        <div className="border-t border-[#e2e8f0] pt-3">
          <Row label="Total" value={service ? `$${service.price.toLocaleString()}` : "—"} accent />
        </div>
      </div>
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3 flex items-start gap-2">
        <CheckCircle className="w-4 h-4 text-[#16a34a] mt-0.5 flex-shrink-0" />
        <p className="text-[#15803d]" style={{ fontSize: 12, lineHeight: 1.5 }}>
          Recibirás confirmación por WhatsApp al instante y un recordatorio 24 hs antes.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#64748b]" style={{ fontSize: 13 }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: accent ? 700 : 600,
          color: accent ? "#0ea5e9" : "#1e293b",
        }}
      >
        {value}
      </span>
    </div>
  );
}
