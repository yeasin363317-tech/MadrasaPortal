// ============================================================
// AnnouncementBanner - ঘোষণা ব্যানার
// ============================================================

import { useState } from "react";
import { Bell, X, AlertTriangle, Info, CheckCircle } from "lucide-react";
import type { Announcement } from "@/types";

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export default function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const activeAnnouncements = announcements.filter((a) => !dismissed.includes(a.id));
  if (activeAnnouncements.length === 0) return null;

  const getIcon = (type: Announcement["type"]) => {
    switch (type) {
      case "urgent": return <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />;
      case "info": return <Info size={16} className="text-blue-400 flex-shrink-0" />;
      case "success": return <CheckCircle size={16} className="text-green-400 flex-shrink-0" />;
      default: return <Bell size={16} className="text-islamic-gold-400 flex-shrink-0" />;
    }
  };

  const getBg = (type: Announcement["type"]) => {
    switch (type) {
      case "urgent": return "rgba(239, 68, 68, 0.08)";
      case "info": return "rgba(59, 130, 246, 0.08)";
      case "success": return "rgba(34, 197, 94, 0.08)";
      default: return "rgba(201, 162, 39, 0.08)";
    }
  };

  const getBorder = (type: Announcement["type"]) => {
    switch (type) {
      case "urgent": return "rgba(239, 68, 68, 0.3)";
      case "info": return "rgba(59, 130, 246, 0.3)";
      case "success": return "rgba(34, 197, 94, 0.3)";
      default: return "rgba(201, 162, 39, 0.3)";
    }
  };

  return (
    <div className="space-y-2 mb-8">
      {activeAnnouncements.map((ann) => (
        <div
          key={ann.id}
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl animate-slide-up"
          style={{
            background: getBg(ann.type),
            border: `1px solid ${getBorder(ann.type)}`,
          }}
        >
          {getIcon(ann.type)}
          <div className="flex-1 min-w-0">
            <div className="text-warm-white font-semibold text-sm">{ann.title}</div>
            <div className="text-warm-white/60 text-xs mt-0.5 leading-relaxed">{ann.content}</div>
          </div>
          <button
            onClick={() => setDismissed((prev) => [...prev, ann.id])}
            className="text-warm-white/40 hover:text-warm-white transition-colors flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
