import { useEffect, useRef, useState, useCallback } from "react";
import apiClient from "../api/client";
import { toast } from "sonner";

export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  appointmentId: number | null;
  read: boolean;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  const fetchInitial = useCallback(async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        apiClient.get<Notification[]>("/notifications"),
        apiClient.get<{ count: number }>("/notifications/unread-count"),
      ]);
      setNotifications(listRes.data);
      setUnreadCount(countRes.data.count);
    } catch {
      // ignore
    }
  }, []);

  const markRead = useCallback(async (id: number) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // ignore
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await apiClient.post("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetchInitial();

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const url = `${baseUrl}/notifications/stream?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    es.addEventListener("notification", (e: MessageEvent) => {
      try {
        const notif: Notification = JSON.parse(e.data);
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((prev) => prev + 1);

        if (document.hidden) {
          if (Notification.permission === "granted") {
            new Notification("TurniX", {
              body: notif.message,
              icon: "/favicon.ico",
            });
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission();
          }
        } else {
          toast(notif.title, {
            description: notif.message,
            duration: 5000,
          });
        }
      } catch {
        // ignore
      }
    });

    es.onerror = () => {
      es.close();
    };

    eventSourceRef.current = es;

    return () => {
      es.close();
    };
  }, [fetchInitial]);

  return { notifications, unreadCount, markRead, markAllRead };
}
