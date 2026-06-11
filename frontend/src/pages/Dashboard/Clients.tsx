import { useEffect, useState } from "react";
import { UserCheck } from "lucide-react";
import { fetchUsers } from "../../api/dashboard";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/ui/empty-state";
import type { UserRecord } from "../../api/dashboard";
import { toast } from "sonner";

export default function Clients() {
  const [list, setList] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchUsers().then(setList).catch(() => toast.error("Error al cargar")).finally(() => setLoading(false));
  }, []);

  const clients = list.filter((u) => u.role === "CLIENT");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl tracking-tight">Clientes</h1>
        <p className="text-muted-foreground text-sm">Lista de clientes registrados</p>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-5 space-y-4">
            {[1,2,3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-52" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : clients.length === 0 ? (
        <EmptyState icon={<UserCheck className="w-8 h-8" />} title="No hay clientes" description="Los clientes aparecerán cuando se registren" />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Nombre", "Email", "Rol"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-muted-foreground text-xs font-semibold tracking-wider uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((u) => (
                <tr key={u.id} className="border-b border-muted hover:bg-muted transition-colors">
                  <td className="px-5 py-3 text-foreground text-sm font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-muted-foreground text-sm">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
                      {u.role}
                    </span>
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
