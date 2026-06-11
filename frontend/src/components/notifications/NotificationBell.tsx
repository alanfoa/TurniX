import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function NotificationBell() {
  const { user } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = (n: { id: number; read: boolean; appointmentId: number | null }) => {
    if (!n.read) markRead(n.id);
    setOpen(false);
    if (n.appointmentId && user?.role === "ADMIN") {
      navigate("/dashboard/turnos");
    } else if (n.appointmentId) {
      navigate("/mis-turnos");
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-muted border border-border hover:bg-accent transition-colors"
      >
        <Bell className="w-4 h-4 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-card">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-foreground text-sm font-semibold">Notificaciones</span>
            {unreadCount > 0 && (
              <button
                onClick={() => { markAllRead(); }}
                className="flex items-center gap-1 text-xs text-primary hover:text-sky-600 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Marcar todas leídas
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-xs">Sin notificaciones</div>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className="w-full text-left px-4 py-3 border-b border-border hover:bg-muted transition-colors flex gap-3"
                  style={{ background: n.read ? "transparent" : "var(--color-accent)" }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground text-xs font-semibold">{n.title}</div>
                    <div className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{n.message}</div>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
