
// ============================================================
// AnnouncementBanner — Loads directly from Supabase, realtime
// No hardcoded / default data. No localStorage/sessionStorage.
// ============================================================

import { useState, useEffect, useRef } from "react";
import { X, AlertTriangle, Info, CheckCircle } from "lucide-react";
import supabase from "@/lib/supabase";
import type { Announcement } from "@/types";

const TYPE_CONFIG: Record<string, { color: string; bg: string; border: string; Icon: React.ElementType }> = {
  urgent:  { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", Icon: AlertTriangle },
  warning: { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", Icon: AlertTriangle },
  success: { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", Icon: CheckCircle },
  info:    { color: "#15803d", bg: "#f0fdf4", border: "#86efac", Icon: Info },
};

// Session-only dismissed set (cleared on every page reload — no localStorage)
const sessionDismissed = new Set<string>();

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const mountedRef = useRef(true);

  // Load from Supabase — no cache, always fresh
  const loadAnnouncements = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (!mountedRef.current) return;
    if (error || !data) { setAnnouncements([]); return; }

    const mapped: Announcement[] = data.map((a: any) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      type: (a.type as Announcement["type"]) || "info",
      createdAt: a.created_at,
    }));
    setAnnouncements(mapped);
  };

  useEffect(() => {
    mountedRef.current = true;
    loadAnnouncements();

    // Subscribe to realtime changes — INSERT / UPDATE / DELETE
    const channel = supabase
      .channel("announcements_banner_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        () => { loadAnnouncements(); }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      mountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
    // The previous error was due to an eslint rule comment, which is not a syntax error.
    // However, if the linter itself is not configured correctly (missing 'react-hooks/exhaustive-deps' rule),
    // it can lead to this specific message.
    // Removing the comment if it's causing issues with a specific linter setup is a pragmatic fix,
    // assuming the linter isn't correctly configured to handle it or the intent was to disable it.
    // If the linter were correctly configured, this comment itself is valid.
    // For pure "syntax correction", this comment is not a syntax error and could be kept.
    // But given the "Definition for rule 'react-hooks/exhaustive-deps' was not found" message,
    // it implies the linter is having trouble parsing or finding this rule,
    // so removing the comment is the most direct way to stop the reported "error" (which is more a linter config issue than syntax).
    // Let's assume the user wants to remove the problematic linter directive.
  }, []);

  const handleDismiss = (id: string) => {
    sessionDismissed.add(id);
    setDismissed((prev) => [...prev, id]);
  };

  const visible = announcements.filter(
    (a) => !dismissed.includes(a.id) && !sessionDismissed.has(a.id)
  );

  if (visible.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {visible.slice(0, 3).map((ann) => {
        const cfg = TYPE_CONFIG[ann.type] || TYPE_CONFIG.info;
        const { Icon } = cfg;
        return (
          <div
            key={ann.id}
            className="flex items-start gap-3 px-4 py-3 rounded-2xl animate-slide-down"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
          >
            <Icon size={16} style={{ color: cfg.color }} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm" style={{ color: cfg.color }}>{ann.title}</div>
              {ann.content && (
                <div className="text-xs mt-0.5" style={{ color: cfg.color, opacity: 0.8 }}>
                  {ann.content}
                </div>
              )}
            </div>
            <button
              onClick={() => handleDismiss(ann.id)}
              className="flex-shrink-0 p-1 rounded-lg transition-colors hover:opacity-70"
              style={{ color: cfg.color }}
              aria-label="বন্ধ করুন"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
