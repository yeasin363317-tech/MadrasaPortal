// ============================================================
// RoutinesPage - পাবলিক রুটিন বোর্ড (Supabase)
// ============================================================

import { useState, useEffect, useLayoutEffect } from "react";
import { Calendar, Download, Search, BookOpen, FileText, Clock, ExternalLink } from "lucide-react";
import IslamicPattern, { IslamicBorder, StarOrnament } from "@/components/layout/IslamicPattern";
import supabase from "@/lib/supabase";

interface Routine {
  id: string;
  title: string;
  description: string;
  file_url: string;
  routine_type: string;
  is_active: boolean;
  created_at: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  class: {
    label: "ক্লাস রুটিন",
    color: "#2d9d64",
    bg: "rgba(45,157,100,0.1)",
    border: "rgba(45,157,100,0.25)",
    icon: BookOpen,
  },
  exam: {
    label: "পরীক্ষার রুটিন",
    color: "#c9a227",
    bg: "rgba(201,162,39,0.1)",
    border: "rgba(201,162,39,0.25)",
    icon: FileText,
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("routines")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) console.error("Routines load error:", error);
    if (data) setRoutines(data);
    setLoading(false);
  };

  const filters = [
    { id: "all", label: "সব রুটিন" },
    { id: "class", label: "ক্লাস রুটিন" },
    { id: "exam", label: "পরীক্ষার রুটিন" },
  ];

  const filtered = routines.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.routine_type === filter;
    return matchSearch && matchFilter;
  });

  const classRoutines = filtered.filter((r) => r.routine_type === "class");
  const examRoutines = filtered.filter((r) => r.routine_type === "exam");

  return (
    <div className="min-h-screen islamic-bg" style={{ paddingTop: "5rem" }}>
      <IslamicPattern opacity={0.04} />

      {/* ===== PAGE HEADER ===== */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(45,157,100,0.06) 0%, transparent 100%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <StarOrnament size={18} />
            <span className="text-islamic-gold-400 text-xs uppercase tracking-widest font-semibold">
              মাদরাসা পোর্টাল
            </span>
            <StarOrnament size={18} />
          </div>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: "linear-gradient(135deg, #2d9d64, #1a6b3c)",
              boxShadow: "0 8px 32px rgba(45,157,100,0.3)",
            }}
          >
            <Calendar size={28} className="text-warm-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-warm-white mb-3 font-bangla">
            ক্লাস ও পরীক্ষার <span className="text-gold-gradient">রুটিন</span>
          </h1>
          <p className="text-warm-white/50 text-sm leading-relaxed">
            সকল ক্লাস রুটিন ও পরীক্ষার সময়সূচী এখানে পাওয়া যাবে। ডাউনলোড করুন এবং সংরক্ষণ করুন।
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
              placeholder="রুটিন খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-islamic pl-10 text-sm"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  filter === f.id ? "btn-gold" : "text-warm-white/60 hover:text-warm-white"
                }`}
                style={
                  filter !== f.id
                    ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }
                    : {}
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== LOADING ===== */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex-shrink-0" />
                  <div className="flex-1 space-y-2.5">
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
            <Calendar size={48} className="text-warm-white/10 mx-auto mb-4" />
            <div className="text-warm-white/30 text-lg mb-1">কোনো রুটিন পাওয়া যায়নি</div>
            <div className="text-warm-white/20 text-sm">পরবর্তীতে আবার চেক করুন</div>
          </div>
        ) : (
          <div className="space-y-8">

            {/* ── Class Routines ── */}
            {(filter === "all" || filter === "class") && classRoutines.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={15} className="text-islamic-green-400" />
                  <span className="text-islamic-green-400 text-xs font-semibold uppercase tracking-wider">
                    ক্লাস রুটিন
                  </span>
                  <span className="text-warm-white/25 text-xs">({classRoutines.length}টি)</span>
                </div>
                <div className="space-y-3">
                  {classRoutines.map((r, i) => (
                    <RoutineCard key={r.id} routine={r} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Exam Routines ── */}
            {(filter === "all" || filter === "exam") && examRoutines.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={15} className="text-islamic-gold-400" />
                  <span className="text-islamic-gold-400 text-xs font-semibold uppercase tracking-wider">
                    পরীক্ষার রুটিন
                  </span>
                  <span className="text-warm-white/25 text-xs">({examRoutines.length}টি)</span>
                </div>
                <div className="space-y-3">
                  {examRoutines.map((r, i) => (
                    <RoutineCard key={r.id} routine={r} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Count summary */}
            <div className="text-center pt-4 text-warm-white/25 text-xs">
              মোট {filtered.length}টি রুটিন প্রদর্শিত হচ্ছে
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Individual Routine Card ──────────────────────────────────
interface RoutineCardProps {
  routine: Routine;
  index: number;
}

function RoutineCard({ routine, index }: RoutineCardProps) {
  const cfg = TYPE_CONFIG[routine.routine_type] || TYPE_CONFIG.class;
  const { icon: Icon } = cfg;
  const hasFile = !!routine.file_url;

  return (
    <div
      className="glass-card p-5 animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Type Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
        >
          <Icon size={24} style={{ color: cfg.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Badge */}
          <span
            className="inline-block text-xs px-2.5 py-0.5 rounded-full font-semibold mb-2"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
          >
            {cfg.label}
          </span>

          {/* Title */}
          <h3 className="text-warm-white font-bold text-base leading-snug mb-1">
            {routine.title}
          </h3>

          {/* Description */}
          {routine.description && (
            <p className="text-warm-white/55 text-sm leading-relaxed mb-3">
              {routine.description}
            </p>
          )}

          {/* Date */}
          <div className="flex items-center gap-1.5 text-warm-white/30 text-xs mb-4">
            <Clock size={11} />
            <span>প্রকাশিত: {formatDate(routine.created_at)}</span>
          </div>

          {/* Download / View Button */}
          {hasFile ? (
            <div className="flex gap-2 flex-wrap">
              <a
                href={routine.file_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`,
                  color: routine.routine_type === "class" ? "#fff" : "#071a0e",
                  boxShadow: `0 4px 14px ${cfg.color}40`,
                }}
              >
                <Download size={15} />
                ডাউনলোড করুন
              </a>
              <a
                href={routine.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(248,244,232,0.7)",
                }}
              >
                <ExternalLink size={14} />
                দেখুন
              </a>
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(248,244,232,0.3)",
              }}
            >
              <Clock size={14} />
              ফাইল শীঘ্রই আসবে
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
