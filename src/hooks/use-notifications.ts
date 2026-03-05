import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "success" | "warning" | "info" | "error";
  read: boolean;
  link?: string;
  createdAt: string;
}

const READ_STORAGE_KEY = "erp_notifications_read";

function getReadIds(): Set<string> {
  try {
    const stored = localStorage.getItem(READ_STORAGE_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  try {
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...ids]));
  } catch { }
}

export function useNotifications() {
  const queryClient = useQueryClient();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Load read state from localStorage on mount and listen for changes in other tabs
  useEffect(() => {
    const update = () => setReadIds(getReadIds());
    update();

    window.addEventListener("storage", (e) => {
      if (e.key === READ_STORAGE_KEY) update();
    });
    return () => window.removeEventListener("storage", update);
  }, []);

  const { data: rawNotifications = [], isLoading, dataUpdatedAt } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await axios.get("/api/notifications");
      return response.data;
    },
    refetchInterval: 5000, // Poll every 5 seconds for a "live" feel
    staleTime: 2000,
  });

  // Apply read state from localStorage
  const notifications = rawNotifications.map((n) => ({
    ...n,
    read: readIds.has(n.id),
  }));

  const markAsRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    const allIds = new Set(rawNotifications.map((n) => n.id));
    setReadIds(allIds);
    saveReadIds(allIds);
  }, [rawNotifications]);

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch,
  };
}
