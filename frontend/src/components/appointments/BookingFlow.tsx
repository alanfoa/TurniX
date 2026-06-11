import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ServiceSelector } from "./ServiceSelector";
import { ProfessionalSelector } from "./ProfessionalSelector";
import { DatePicker } from "./DatePicker";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { BookingConfirmation } from "./BookingConfirmation";
import { fetchServices, fetchProfessionals, fetchAvailableSlots, createAppointment } from "../../api/appointments";
import type { Service, Professional, TimeSlot } from "../../types/appointment";
import { toast } from "sonner";

const STEPS = ["Servicio", "Profesional", "Fecha", "Horario", "Confirmación"];

export function BookingFlow() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingProfessionals, setLoadingProfessionals] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorServices, setErrorServices] = useState<string | null>(null);
  const [errorProfessionals, setErrorProfessionals] = useState<string | null>(null);
  const [errorSlots, setErrorSlots] = useState<string | null>(null);

  const today = new Date();
  const [calYear] = useState(today.getFullYear());
  const [calMonth] = useState(today.getMonth());

  const service = services.find((s) => s.id === selectedService) ?? null;
  const professional = professionals.find((p) => p.id === selectedProfessional) ?? null;

  const canNext = useCallback(() => {
    if (step === 1) return selectedService !== null;
    if (step === 2) return selectedProfessional !== null;
    if (step === 3) return selectedDate !== null;
    if (step === 4) return selectedTime !== null;
    return false;
  }, [step, selectedService, selectedProfessional, selectedDate, selectedTime]);

  useEffect(() => {
    setLoadingServices(true);
    fetchServices()
      .then(setServices)
      .catch(() => setErrorServices("Error al cargar servicios"))
      .finally(() => setLoadingServices(false));
  }, []);

  useEffect(() => {
    if (step >= 2 && professionals.length === 0) {
      setLoadingProfessionals(true);
      fetchProfessionals()
        .then(setProfessionals)
        .catch(() => setErrorProfessionals("Error al cargar profesionales"))
        .finally(() => setLoadingProfessionals(false));
    }
  }, [step, professionals.length]);

  useEffect(() => {
    if (step === 4 && selectedProfessional && selectedDate) {
      setLoadingSlots(true);
      setErrorSlots(null);
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
      fetchAvailableSlots(selectedProfessional, dateStr)
        .then((res) => setSlots(res.slots))
        .catch(() => setErrorSlots("Error al cargar horarios"))
        .finally(() => setLoadingSlots(false));
    }
  }, [step, selectedProfessional, selectedDate, calYear, calMonth]);

  const handleCreate = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!selectedProfessional || !service || !selectedTime || !selectedDate) return;

    setIsCreating(true);
    setCreateError(null);
    try {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
      await createAppointment({
        date: dateStr,
        startTime: selectedTime,
        professionalId: selectedProfessional,
        serviceId: service.id,
      });
      setConfirmed(true);
      toast.success("Turno creado con éxito");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Error al crear el turno";
      setCreateError(msg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedProfessional(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setConfirmed(false);
    setCreateError(null);
    setSlots([]);
  };

  if (confirmed) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
    return (
      <div className="bg-card border border-border rounded-2xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-foreground mb-2 font-bold text-xl">¡Turno Confirmado!</h3>
        <p className="text-muted-foreground mb-6 text-sm">
          Recibirás un recordatorio 24 hs antes por WhatsApp.
        </p>
        <div className="bg-muted border border-border rounded-xl p-4 text-left mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Servicio</span>
            <span className="text-foreground text-sm font-semibold">{service?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Profesional</span>
            <span className="text-foreground text-sm font-semibold">{professional?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Fecha</span>
            <span className="text-foreground text-sm font-semibold">{dateStr}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Horario</span>
            <span className="text-foreground text-sm font-semibold">{selectedTime}</span>
          </div>
          <div className="border-t border-border pt-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Total</span>
              <span className="text-primary text-sm font-bold">${service?.price?.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-sky-600 transition-colors font-semibold text-sm"
        >
          Nueva Reserva
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-muted-foreground text-xs font-medium">
            Paso {step} de {STEPS.length}
          </span>
          <span className="text-primary text-xs font-semibold">{STEPS[step - 1]}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="flex mt-2.5">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all"
                style={{
                  background: i + 1 < step ? "var(--color-primary)" : i + 1 === step ? "var(--color-accent)" : "var(--color-secondary)",
                  color: i + 1 < step ? "#fff" : i + 1 === step ? "var(--color-primary)" : "var(--color-muted-foreground)",
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

      <div className="p-5" style={{ minHeight: 320 }}>
        {step === 1 && (
          <ServiceSelector
            services={services}
            selected={selectedService}
            onSelect={setSelectedService}
            isLoading={loadingServices}
            error={errorServices}
          />
        )}
        {step === 2 && (
          <ProfessionalSelector
            professionals={professionals}
            selected={selectedProfessional}
            onSelect={setSelectedProfessional}
            isLoading={loadingProfessionals}
            error={errorProfessionals}
          />
        )}
        {step === 3 && (
          <DatePicker
            selected={selectedDate}
            onSelect={setSelectedDate}
            year={calYear}
            month={calMonth}
          />
        )}
        {step === 4 && (
          <TimeSlotPicker
            slots={slots}
            selected={selectedTime}
            onSelect={setSelectedTime}
            isLoading={loadingSlots}
            error={errorSlots}
          />
        )}
        {step === 5 && (
          <BookingConfirmation
            service={service}
            professional={professional}
            date={selectedDate}
            time={selectedTime}
            month={calMonth}
            year={calYear}
            isCreating={isCreating}
            error={createError}
          />
        )}
      </div>

      <div className="px-5 pb-5 flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Atrás
          </button>
        )}
        {step < 5 ? (
          <button
            onClick={() => canNext() && setStep(step + 1)}
            disabled={!canNext()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all text-sm font-semibold"
            style={{
              background: canNext() ? "var(--color-primary)" : "var(--color-muted)",
              color: canNext() ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)",
              cursor: canNext() ? "pointer" : "not-allowed",
            }}
          >
            Continuar <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-sky-600 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Creando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> Confirmar Turno
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
