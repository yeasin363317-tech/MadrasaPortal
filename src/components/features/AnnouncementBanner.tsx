// ============================================================
// AnnouncementBanner — Light theme version
// ============================================================

import { useState, useEffect } from "react";
import { X, Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";
import type { Announcement } from "@/types";

interface Props {
  announcements: Announcement[];
}

const TYPE_CONFIG: Record<string, { color: string; bg: string; border: string; Icon: React.ElementType }> = {
  urgent:  { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", Icon: AlertTriangle },
  warning: { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", Icon: AlertTriangle },
  success: { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", Icon: CheckCircle },
  info:    { color: "#15803d", bg: "#f0fdf4", border: "#86efac", Icon: Info },
};

export default function AnnouncementBanner({ announcements }: Props) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const visible = announcements.filter((a) => !dismissed.includes(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {visible.slice(0, 2).map((ann) => {
        const cfg = TYPE_CONFIG[ann.type] || TYPE_CONFIG.info;
        const { Icon } = cfg;
        return (
          <div key={ann.id}
            className="flex items-start gap-3 px-4 py-3 rounded-2xl animate-slide-down"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            <Icon size={16} style={{ color: cfg.color }} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm" style={{ color: cfg.color }}>{ann.title}</div>
              <div className="text-xs mt-0.5" style={{ color: cfg.color, opacity: 0.8 }}>{ann.content}</div>
            </div>
            <button onClick={() => setDismissed((d) => [...d, ann.id])}
              className="flex-shrink-0 p-1 rounded-lg transition-colors hover:opacity-70"
              style={{ color: cfg.color }}>
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
