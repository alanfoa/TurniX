import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/ui/empty-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { fetchProfessionals } from "../../api/appointments";
import { createProfessional, updateProfessional, deleteProfessional } from "../../api/dashboard";
import type { Professional } from "../../types/appointment";
import { toast } from "sonner";

export default function Professionals() {
  const [list, setList] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Professional | null>(null);
  const [form, setForm] = useState({ name: "", specialty: "", description: "" });

  const load = async () => {
    setLoading(true);
    try { setList(await fetchProfessionals()); } catch { toast.error("Error al cargar"); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", specialty: "", description: "" });
    setOpen(true);
  };

  const openEdit = (p: Professional) => {
    setEditing(p);
    setForm({ name: p.name, specialty: p.specialty ?? "", description: p.description ?? "" });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateProfessional(editing.id, form);
        toast.success("Actualizado");
      } else {
        await createProfessional(form);
        toast.success("Creado");
      }
      setOpen(false);
      load();
    } catch { toast.error("Error al guardar"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar profesional?")) return;
    try { await deleteProfessional(id); toast.success("Eliminado"); load(); }
    catch { toast.error("Error al eliminar"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-foreground font-bold text-2xl tracking-tight">Profesionales</h1>
          <p className="text-muted-foreground text-sm">Gestioná los profesionales del negocio</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>Nuevo Profesional</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar" : "Nuevo"} Profesional</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad</Label>
                <Input id="specialty" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Descripción</Label>
                <Input id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <Button onClick={handleSave} className="w-full" disabled={!form.name}>{editing ? "Actualizar" : "Crear"}</Button>
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
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : list.length === 0 ? (
        <EmptyState icon={<Users className="w-8 h-8" />} title="No hay profesionales" description="Agregá tu primer profesional para empezar" action={<Button onClick={openCreate}>Nuevo Profesional</Button>} />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
              {["", "Nombre", "Especialidad", "Activo", "Acciones"].map((h) => (
                  <th key={h} className={`px-5 py-3 text-left text-muted-foreground text-xs font-semibold tracking-wider uppercase ${h === "" ? "w-14" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b border-muted hover:bg-muted transition-colors">
                  <td className="px-5 py-3">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-foreground text-sm font-medium">{p.name}</td>
                  <td className="px-5 py-3 text-muted-foreground text-sm">{p.specialty ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.isActive ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-5 py-3 flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-primary hover:text-sky-600 text-sm font-medium">Editar</button>
                    <button onClick={() => handleDelete(p.id)} className="text-destructive hover:text-red-600 text-sm font-medium">Eliminar</button>
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
