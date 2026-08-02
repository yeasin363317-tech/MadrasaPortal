// ============================================================
// NoticesPage — Timeline style, light theme
// ============================================================

import { useState, useEffect, useLayoutEffect } from "react";
import { Bell, Pin, Search, AlertTriangle, Info, CheckCircle, AlertCircle, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";
import { useNotifications } from "@/contexts/NotificationContext";

interface Notice {
  id: string;
  title: string;
  content: string;
  type: string;
  is_pinned: boolean;
  created_at: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; Icon: React.ElementType }> = {
  urgent:  { label: "জরুরি",    color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", Icon: AlertTriangle },
  warning: { label: "সতর্কতা", color: "#d97706", bg: "#fffbeb", border: "#fcd34d", Icon: AlertCircle },
  success: { label: "সফলতা",   color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", Icon: CheckCircle },
  info:    { label: "তথ্য",    color: "#15803d", bg: "#f0fdf4", border: "#86efac", Icon: Info },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { markNoticesSeen } = useNotifications();

  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  useEffect(() => {
    loadNotices();
    markNoticesSeen(); // clear badge when page opens
  }, []);

  const loadNotices = async () => {
    setLoading(true);
    const { data } = await supabase.from("notices").select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    if (data) setNotices(data);
    setLoading(false);
  };

  const filters = [
    { id: "all", label: "সব", emoji: "📋" },
    { id: "urgent", label: "জরুরি", emoji: "🚨" },
    { id: "info", label: "তথ্য", emoji: "ℹ️" },
    { id: "warning", label: "সতর্কতা", emoji: "⚠️" },
    { id: "success", label: "সফলতা", emoji: "✅" },
  ];

  const filtered = notices.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || n.type === filter;
    return matchSearch && matchFilter;
  });

  const pinned = filtered.filter((n) => n.is_pinned);
  const regular = filtered.filter((n) => !n.is_pinned);

  return (
    <div className="min-h-screen" style={{ background: "#fafafa", paddingTop: "5rem" }}>

      {/* ── Hero Banner ── */}
      <div className="relative py-12 px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #15803d, #22c55e)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            📢
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">নোটিশ বোর্ড</h1>
          <p className="text-white/75 text-sm">মাদরাসার সকল গুরুত্বপূর্ণ বিজ্ঞপ্তি ও নোটিশ</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 page-enter">

        {/* Search */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-edu-slate-400" />
          <input
            type="text"
            placeholder="নোটিশ খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="edu-input pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {filters.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                background: filter === f.id ? "#15803d" : "#ffffff",
                color: filter === f.id ? "#ffffff" : "#64748b",
                border: filter === f.id ? "1px solid #15803d" : "1px solid #e2e8f0",
                boxShadow: filter === f.id ? "0 4px 12px rgba(21,128,61,0.25)" : "none",
              }}>
              {f.emoji} {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="edu-card p-5 animate-pulse" style={{ height: 100 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="edu-card p-20 text-center">
            <div className="text-5xl mb-4">📭</div>
            <div className="text-edu-slate-400 text-lg">কোনো নোটিশ পাওয়া যায়নি</div>
          </div>
        ) : (
          <>
            {/* Pinned */}
            {pinned.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Pin size={14} className="text-edu-gold-500" />
                  <span className="text-edu-gold-600 text-xs font-bold uppercase tracking-wider">পিন করা</span>
                </div>
                <div className="space-y-3">
                  {pinned.map((n, i) => <NoticeCard key={n.id} notice={n} index={i} pinned />)}
                </div>
              </div>
            )}

            {/* Regular */}
            {regular.length > 0 && (
              <div>
                {pinned.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <Bell size={14} className="text-edu-slate-400" />
                    <span className="text-edu-slate-400 text-xs font-bold uppercase tracking-wider">সকল নোটিশ</span>
                  </div>
                )}
                <div className="space-y-3">
                  {regular.map((n, i) => <NoticeCard key={n.id} notice={n} index={i} />)}
                </div>
              </div>
            )}

            <div className="text-center mt-10 text-edu-slate-400 text-xs">মোট {filtered.length}টি নোটিশ</div>
          </>
        )}
      </div>
    </div>
  );
}

function NoticeCard({ notice, index, pinned }:
  { notice: Notice; index: number; expanded?: string | null; onToggle?: (id: string | null) => void; pinned?: boolean }) {
  const cfg = TYPE_CONFIG[notice.type] || TYPE_CONFIG.info;
  const { Icon } = cfg;
  const navigate = useNavigate();

  return (
    <div
      className="edu-card overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 animate-slide-up"
      style={{
        animationDelay: `${index * 50}ms`,
        border: pinned ? `1px solid #fcd34d` : undefined,
      }}
      onClick={() => navigate(`/notices/${notice.id}`)}
    >
      {/* Type accent line */}
      <div className="h-1" style={{ background: cfg.color }} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            <Icon size={19} style={{ color: cfg.color }} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap mb-2">
              {pinned && <Pin size={12} className="text-edu-gold-500 flex-shrink-0 mt-1" />}
              <h3 className="text-edu-slate-800 font-bold text-sm leading-snug flex-1">{notice.title}</h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="chip text-xs px-2.5 py-0.5 font-semibold rounded-full"
                style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                {cfg.label}
              </span>
              {pinned && (
                <span className="chip text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  style={{ color: "#92400e", background: "#fef3c7", border: "1px solid #fcd34d" }}>
                  পিন করা
                </span>
              )}
            </div>

            <p className="text-edu-slate-600 text-sm leading-relaxed line-clamp-2">
              {notice.content}
            </p>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5 text-edu-slate-400 text-xs">
                <Calendar size={11} /> {formatDate(notice.created_at)}
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: cfg.color }}>
                বিস্তারিত পড়ুন
                <ArrowRight size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
