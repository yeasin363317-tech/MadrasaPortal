// ============================================================
// NoticesPage - পাবলিক নোটিশ বোর্ড (Supabase)
// ============================================================

import { useState, useEffect, useLayoutEffect } from "react";
import { Bell, Pin, Search, AlertTriangle, Info, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import IslamicPattern, { IslamicBorder, StarOrnament } from "@/components/layout/IslamicPattern";
import supabase from "@/lib/supabase";

interface Notice {
  id: string;
  title: string;
  content: string;
  type: string;
  is_pinned: boolean;
  created_at: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; Icon: React.ElementType }> = {
  urgent:  { label: "জরুরি",    color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",   Icon: AlertTriangle },
  warning: { label: "সতর্কতা", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)",  Icon: AlertCircle },
  success: { label: "সফলতা",   color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)",  Icon: CheckCircle },
  info:    { label: "তথ্য",    color: "#2d9d64", bg: "rgba(45,157,100,0.1)",  border: "rgba(45,157,100,0.25)",  Icon: Info },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("bn-BD", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) console.error("Notices load error:", error);
    if (data) setNotices(data);
    setLoading(false);
  };

  const filters = [
    { id: "all", label: "সব" },
    { id: "urgent", label: "জরুরি" },
    { id: "info", label: "তথ্য" },
    { id: "warning", label: "সতর্কতা" },
    { id: "success", label: "সফলতা" },
  ];

  const filtered = notices.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || n.type === filter;
    return matchSearch && matchFilter;
  });

  const pinned = filtered.filter((n) => n.is_pinned);
  const regular = filtered.filter((n) => !n.is_pinned);

  return (
    <div className="min-h-screen islamic-bg" style={{ paddingTop: "5rem" }}>
      <IslamicPattern opacity={0.04} />

      {/* ===== PAGE HEADER ===== */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(201,162,39,0.06) 0%, transparent 100%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <StarOrnament size={18} />
            <span className="text-islamic-gold-400 text-xs uppercase tracking-widest font-semibold">মাদরাসা পোর্টাল</span>
            <StarOrnament size={18} />
          </div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, #c9a227, #ecc138)", boxShadow: "0 8px 32px rgba(201,162,39,0.3)" }}>
            <Bell size={28} className="text-madrasa-dark" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-warm-white mb-3 font-bangla">
            নোটিশ <span className="text-gold-gradient">বোর্ড</span>
          </h1>
          <p className="text-warm-white/50 text-sm leading-relaxed">
            মাদরাসার সকল গুরুত্বপূর্ণ বিজ্ঞপ্তি ও নোটিশ এখানে পাওয়া যাবে
          </p>
          <IslamicBorder />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-20 page-enter">

        {/* ===== SEARCH & FILTER ===== */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-white/40" />
            <input
              type="text"
              placeholder="নোটিশ খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-islamic pl-10 text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${filter === f.id ? "btn-gold" : "text-warm-white/60 hover:text-warm-white"}`}
                style={filter !== f.id ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" } : {}}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== LOADING ===== */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-20 text-center">
            <Bell size={48} className="text-warm-white/10 mx-auto mb-4" />
            <div className="text-warm-white/30 text-lg mb-1">কোনো নোটিশ পাওয়া যায়নি</div>
            <div className="text-warm-white/20 text-sm">পরবর্তীতে আবার চেক করুন</div>
          </div>
        ) : (
          <>
            {/* ===== PINNED NOTICES ===== */}
            {pinned.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Pin size={14} className="text-yellow-400" />
                  <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">পিন করা নোটিশ</span>
                </div>
                <div className="space-y-3">
                  {pinned.map((notice, i) => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      index={i}
                      expanded={expanded}
                      onToggle={setExpanded}
                      pinned
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ===== REGULAR NOTICES ===== */}
            {regular.length > 0 && (
              <div>
                {pinned.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <Bell size={14} className="text-warm-white/40" />
                    <span className="text-warm-white/40 text-xs font-semibold uppercase tracking-wider">সকল নোটিশ</span>
                  </div>
                )}
                <div className="space-y-3">
                  {regular.map((notice, i) => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      index={i}
                      expanded={expanded}
                      onToggle={setExpanded}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Count summary */}
            <div className="text-center mt-10 text-warm-white/25 text-xs">
              মোট {filtered.length}টি নোটিশ প্রদর্শিত হচ্ছে
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Individual Notice Card ──────────────────────────────────
interface NoticeCardProps {
  notice: Notice;
  index: number;
  expanded: string | null;
  onToggle: (id: string | null) => void;
  pinned?: boolean;
}

function NoticeCard({ notice, index, expanded, onToggle, pinned }: NoticeCardProps) {
  const cfg = TYPE_CONFIG[notice.type] || TYPE_CONFIG.info;
  const { Icon } = cfg;
  const isExpanded = expanded === notice.id;

  return (
    <div
      className="glass-card overflow-hidden animate-slide-up cursor-pointer transition-all duration-200"
      style={{
        animationDelay: `${index * 60}ms`,
        border: pinned ? `1px solid rgba(234,179,8,0.2)` : undefined,
        background: pinned ? "rgba(234,179,8,0.03)" : undefined,
      }}
      onClick={() => onToggle(isExpanded ? null : notice.id)}>

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            <Icon size={19} style={{ color: cfg.color }} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-start gap-2 flex-wrap mb-2">
              {pinned && (
                <Pin size={12} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              )}
              <h3 className="text-warm-white font-bold text-sm leading-snug flex-1">
                {notice.title}
              </h3>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                {cfg.label}
              </span>
              {pinned && (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20">
                  পিন করা
                </span>
              )}
            </div>

            {/* Preview or full content */}
            <p className={`text-warm-white/60 text-sm leading-relaxed transition-all duration-300 ${isExpanded ? "" : "line-clamp-2"}`}>
              {notice.content}
            </p>

            {/* Date & expand hint */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5 text-warm-white/30 text-xs">
                <Calendar size={11} />
                <span>{formatDate(notice.created_at)}</span>
              </div>
              <span className="text-xs font-semibold transition-colors"
                style={{ color: cfg.color }}>
                {isExpanded ? "সংক্ষিপ্ত করুন ▲" : "বিস্তারিত পড়ুন ▼"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded accent bar */}
      {isExpanded && (
        <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${cfg.color}60, transparent)` }} />
      )}
    </div>
  );
}
