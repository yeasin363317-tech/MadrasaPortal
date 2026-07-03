// ============================================================
// RoutinesPage — Light theme, download links, type badges
// ============================================================

import { useState, useEffect, useLayoutEffect } from "react";
import { Search, Download, Eye, Calendar, FileText } from "lucide-react";
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

const TYPE_CONFIG: Record<string, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  class:  { label: "ক্লাস রুটিন",  emoji: "📅", color: "#15803d", bg: "#f0fdf4", border: "#86efac" },
  exam:   { label: "পরীক্ষার রুটিন", emoji: "📝", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
};

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  useEffect(() => { loadRoutines(); }, []);

  const loadRoutines = async () => {
    setLoading(true);
    const { data } = await supabase.from("routines").select("*").eq("is_active", true).order("created_at", { ascending: false });
    if (data) setRoutines(data);
    setLoading(false);
  };

  const filtered = routines.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.routine_type === filter;
    return matchSearch && matchFilter;
  });

  const classRoutines = filtered.filter((r) => r.routine_type === "class");
  const examRoutines = filtered.filter((r) => r.routine_type === "exam");

  return (
    <div className="min-h-screen" style={{ background: "#fafafa", paddingTop: "5rem" }}>

      {/* Hero */}
      <div className="relative py-12 px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            📅
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">রুটিন</h1>
          <p className="text-white/75 text-sm">ক্লাস ও পরীক্ষার রুটিন ডাউনলোড করুন</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 page-enter">

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-edu-slate-400" />
            <input
              type="text"
              placeholder="রুটিন খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="edu-input pl-10"
            />
          </div>
          <div className="flex gap-2">
            {[
              { id: "all", label: "সব", emoji: "📋" },
              { id: "class", label: "ক্লাস", emoji: "📅" },
              { id: "exam", label: "পরীক্ষা", emoji: "📝" },
            ].map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  background: filter === f.id ? "#7c3aed" : "#ffffff",
                  color: filter === f.id ? "#ffffff" : "#64748b",
                  border: filter === f.id ? "1px solid #7c3aed" : "1px solid #e2e8f0",
                  boxShadow: filter === f.id ? "0 4px 12px rgba(124,58,237,0.25)" : "none",
                }}>
                {f.emoji} {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="edu-card p-6 animate-pulse" style={{ height: 100 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="edu-card p-20 text-center">
            <div className="text-5xl mb-4">📅</div>
            <div className="text-edu-slate-400 text-lg">কোনো রুটিন পাওয়া যায়নি</div>
          </div>
        ) : (
          <>
            {classRoutines.length > 0 && (
              <RoutineGroup title="ক্লাস রুটিন" emoji="📅" routines={classRoutines} />
            )}
            {examRoutines.length > 0 && (
              <RoutineGroup title="পরীক্ষার রুটিন" emoji="📝" routines={examRoutines} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function RoutineGroup({ title, emoji, routines }: { title: string; emoji: string; routines: Routine[] }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{emoji}</span>
        <h2 className="text-edu-slate-700 font-bold text-base">{title}</h2>
        <span className="badge-green ml-1">{routines.length}টি</span>
      </div>
      <div className="space-y-3">
        {routines.map((routine, i) => {
          const cfg = TYPE_CONFIG[routine.routine_type] || TYPE_CONFIG.class;
          return (
            <div key={routine.id} className="edu-card p-5 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  {cfg.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-edu-slate-800 font-bold text-sm mb-1">{routine.title}</h3>
                  {routine.description && (
                    <p className="text-edu-slate-500 text-xs mb-2">{routine.description}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      {cfg.label}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-edu-slate-400">
                      <Calendar size={10} />
                      {new Date(routine.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>
                {/* Action buttons */}
                {routine.file_url && (
                  <div className="flex gap-2 flex-shrink-0">
                    <a href={routine.file_url} target="_blank" rel="noopener noreferrer"
                      title="প্রিভিউ"
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: "#ede9fe", border: "1px solid #c4b5fd", color: "#7c3aed" }}>
                      <Eye size={15} />
                    </a>
                    <a href={routine.file_url} download
                      title="ডাউনলোড"
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: "#15803d", border: "1px solid #15803d", color: "#ffffff" }}>
                      <Download size={15} />
                    </a>
                  </div>
                )}
                {!routine.file_url && (
                  <div className="flex items-center gap-1.5 text-xs text-edu-slate-400 flex-shrink-0">
                    <FileText size={13} />
                    <span>ফাইল নেই</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
