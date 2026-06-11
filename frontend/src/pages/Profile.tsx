import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { fetchProfile, updateProfile } from "../api/auth";
import { toast } from "sonner";

const PASSWORD_RE = /^.{6,}$/;

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile()
      .then((u) => { setName(u.name); setEmail(u.email); })
      .catch(() => toast.error("Error al cargar perfil"))
      .finally(() => setLoading(false));
  }, []);

  const passwordError = password && !PASSWORD_RE.test(password) ? "Mínimo 6 caracteres" : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data: { name: string; email: string; password?: string } = { name, email };
      if (password) data.password = password;
      await updateProfile(data);
      setPassword("");
      toast.success("Perfil actualizado");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Error al actualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm font-medium mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        <h1 className="text-foreground font-bold text-2xl tracking-tight mb-1">Mi Perfil</h1>
        <p className="text-muted-foreground text-sm mb-6">Actualizá tus datos personales</p>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <label className="text-foreground text-sm font-semibold block mb-1.5">Nombre</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="text-foreground text-sm font-semibold block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="text-foreground text-sm font-semibold block mb-1.5">Nueva Contraseña <span className="text-muted-foreground font-normal">(opcional)</span></label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Dejar vacío para mantener la actual"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {passwordError && <p className="text-xs text-destructive mt-1">{passwordError}</p>}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-sky-600 transition-colors text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
