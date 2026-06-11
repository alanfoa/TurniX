import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/ui/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { fetchProfessionals } from "../../api/appointments";
import { fetchAvailability, createAvailability, deleteAvailability } from "../../api/dashboard";
import type { Professional } from "../../types/appointment";
import type { AvailabilityBlock } from "../../api/dashboard";
import { toast } from "sonner";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default function AvailabilityPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProf, setSelectedProf] = useState<number | null>(null);
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" });

  useEffect(() => {
    fetchProfessionals().then(setProfessionals).catch(() => toast.error("Error al cargar profesionales"));
  }, []);

  useEffect(() => {
    if (!selectedProf) return;
    setLoading(true);
    fetchAvailability(selectedProf).then(setBlocks).catch(() => toast.error("Error al cargar horarios")).finally(() => setLoading(false));
  }, [selectedProf]);

  const handleCreate = async () => {
    if (!selectedProf) return;
    try {
      await createAvailability({ professionalId: selectedProf, ...form });
      toast.success("Bloque creado");
      setOpen(false);
      setBlocks(await fetchAvailability(selectedProf));
    } catch { toast.error("Error al crear"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar bloque?")) return;
    try {
      await deleteAvailability(id);
      toast.success("Eliminado");
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    } catch { toast.error("Error al eliminar"); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl tracking-tight">Horarios</h1>
        <p className="text-muted-foreground text-sm">Gestioná la disponibilidad de cada profesional</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-64">
          <Select value={selectedProf?.toString() ?? ""} onValueChange={(v) => setSelectedProf(Number(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar profesional" />
            </SelectTrigger>
            <SelectContent>
              {professionals.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedProf && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Agregar Bloque</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Bloque Horario</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Día</Label>
                  <Select value={form.dayOfWeek.toString()} onValueChange={(v) => setForm({ ...form, dayOfWeek: Number(v) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((d, i) => (
                        <SelectItem key={i} value={i.toString()}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Desde</Label>
                    <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card" />
                  </div>
                  <div className="space-y-2">
                    <Label>Hasta</Label>
                    <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card" />
                  </div>
                </div>
                <Button onClick={handleCreate} className="w-full" disabled={form.startTime >= form.endTime}>Crear Bloque</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!selectedProf ? (
        <EmptyState icon={<Clock className="w-8 h-8" />} title="Seleccioná un profesional" description="Elegí un profesional de la lista para ver y gestionar sus horarios" />
      ) : loading ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-5 space-y-4">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>
      ) : blocks.length === 0 ? (
        <EmptyState icon={<Clock className="w-8 h-8" />} title="Sin horarios" description="No hay bloques horarios para este profesional" action={<Button onClick={() => setOpen(true)}>Agregar Bloque</Button>} />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Día", "Desde", "Hasta", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-muted-foreground text-xs font-semibold tracking-wider uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blocks.map((b) => (
                <tr key={b.id} className="border-b border-muted hover:bg-muted transition-colors">
                  <td className="px-5 py-3 text-foreground text-sm font-medium">{DAYS[b.dayOfWeek]}</td>
                  <td className="px-5 py-3 text-muted-foreground text-sm">{b.startTime}</td>
                  <td className="px-5 py-3 text-muted-foreground text-sm">{b.endTime}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleDelete(b.id)} className="text-destructive hover:text-red-600 text-sm font-medium">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
