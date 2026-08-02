// ============================================================
// NotificationContext — Realtime unread badges for chat, notices, homework
// Uses localStorage timestamps as "last seen" baselines
// ============================================================

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import supabase from "@/lib/supabase";

// LocalStorage keys
const LS_CHAT     = "madrasa_last_chat_seen";
const LS_NOTICES  = "madrasa_last_notices_seen";
const LS_HOMEWORK = "madrasa_last_homework_seen";

// Initialize timestamp to NOW if not set (so new users don't see badges for old content)
function initTimestamp(key: string) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, new Date().toISOString());
  }
}

interface NotificationContextValue {
  chatCount:     number;
  noticesCount:  number;
  homeworkCount: number;
  markChatSeen:     () => void;
  markNoticesSeen:  () => void;
  markHomeworkSeen: () => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  chatCount: 0, noticesCount: 0, homeworkCount: 0,
  markChatSeen: () => {}, markNoticesSeen: () => {}, markHomeworkSeen: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [chatCount,     setChatCount]     = useState(0);
  const [noticesCount,  setNoticesCount]  = useState(0);
  const [homeworkCount, setHomeworkCount] = useState(0);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const mountedRef = useRef(true);

  const loadCounts = useCallback(async () => {
    const chatSince  = localStorage.getItem(LS_CHAT)     || new Date().toISOString();
    const notSince   = localStorage.getItem(LS_NOTICES)  || new Date().toISOString();
    const hwSince    = localStorage.getItem(LS_HOMEWORK) || new Date().toISOString();

    const [chatRes, noticesRes, hwRes] = await Promise.all([
      supabase.from("chat_messages").select("*", { count: "exact", head: true }).gt("created_at", chatSince),
      supabase.from("notices").select("*", { count: "exact", head: true }).gt("created_at", notSince),
      supabase.from("homework").select("*", { count: "exact", head: true }).gt("created_at", hwSince),
    ]);

    if (!mountedRef.current) return;
    setChatCount(chatRes.count ?? 0);
    setNoticesCount(noticesRes.count ?? 0);
    setHomeworkCount(hwRes.count ?? 0);
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    // Initialize timestamps so users don't see stale badges
    initTimestamp(LS_CHAT);
    initTimestamp(LS_NOTICES);
    initTimestamp(LS_HOMEWORK);

    loadCounts();

    // Realtime subscriptions
    const channel = supabase
      .channel("notification_realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" },
        () => { if (mountedRef.current) loadCounts(); })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notices" },
        () => { if (mountedRef.current) loadCounts(); })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "homework" },
        () => { if (mountedRef.current) loadCounts(); })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_messages" },
        () => { if (mountedRef.current) loadCounts(); })
      .subscribe();

    channelRef.current = channel;

    return () => {
      mountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [loadCounts]);

  const markChatSeen = useCallback(() => {
    localStorage.setItem(LS_CHAT, new Date().toISOString());
    setChatCount(0);
  }, []);

  const markNoticesSeen = useCallback(() => {
    localStorage.setItem(LS_NOTICES, new Date().toISOString());
    setNoticesCount(0);
  }, []);

  const markHomeworkSeen = useCallback(() => {
    localStorage.setItem(LS_HOMEWORK, new Date().toISOString());
    setHomeworkCount(0);
  }, []);

  return (
    <NotificationContext.Provider value={{
      chatCount, noticesCount, homeworkCount,
      markChatSeen, markNoticesSeen, markHomeworkSeen,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
