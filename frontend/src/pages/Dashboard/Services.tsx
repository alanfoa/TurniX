import { useEffect, useState } from "react";
import { Scissors } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/ui/empty-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { fetchServices } from "../../api/appointments";
import { createService, updateService, deleteService } from "../../api/dashboard";
import type { Service } from "../../types/appointment";
import { toast } from "sonner";

export default function Services() {
  const [list, setList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: "", description: "", durationMinutes: 30, price: 0 });

  const load = async () => {
    setLoading(true);
    try { setList(await fetchServices()); } catch { toast.error("Error al cargar"); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", durationMinutes: 30, price: 0 });
    setOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description ?? "", durationMinutes: s.durationMinutes, price: s.price });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateService(editing.id, form);
        toast.success("Actualizado");
      } else {
        await createService(form);
        toast.success("Creado");
      }
      setOpen(false);
      load();
    } catch { toast.error("Error al guardar"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar servicio?")) return;
    try { await deleteService(id); toast.success("Eliminado"); load(); }
    catch { toast.error("Error al eliminar"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-foreground font-bold text-2xl tracking-tight">Servicios</h1>
          <p className="text-muted-foreground text-sm">Gestioná los servicios ofrecidos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>Nuevo Servicio</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar" : "Nuevo"} Servicio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Descripción</Label>
                <Input id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (minutos)</Label>
                <Input id="duration" type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio ($)</Label>
                <Input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <Button onClick={handleSave} className="w-full" disabled={!form.name || form.durationMinutes <= 0 || form.price < 0}>{editing ? "Actualizar" : "Crear"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-5 space-y-4">
            {[1,2,3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : list.length === 0 ? (
        <EmptyState icon={<Scissors className="w-8 h-8" />} title="No hay servicios" description="Agregá tu primer servicio para empezar" action={<Button onClick={openCreate}>Nuevo Servicio</Button>} />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Nombre", "Duración", "Precio", "Activo", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-muted-foreground text-xs font-semibold tracking-wider uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className="border-b border-muted hover:bg-muted transition-colors">
                  <td className="px-5 py-3 text-foreground text-sm font-medium">{s.name}</td>
                  <td className="px-5 py-3 text-muted-foreground text-sm">{s.durationMinutes} min</td>
                  <td className="px-5 py-3 text-foreground text-sm font-semibold">${s.price.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${s.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {s.isActive ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-5 py-3 flex gap-2">
                    <button onClick={() => openEdit(s)} className="text-primary hover:text-sky-600 text-sm font-medium">Editar</button>
                    <button onClick={() => handleDelete(s.id)} className="text-destructive hover:text-red-600 text-sm font-medium">Eliminar</button>
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
