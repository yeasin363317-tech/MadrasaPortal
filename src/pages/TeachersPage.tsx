// ============================================================
// TeachersPage — Premium profile cards, light theme
// ============================================================

import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen } from "lucide-react";
import supabase from "@/lib/supabase";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  phone: string;
  email: string;
  education: string;
  photo_url: string;
  about: string;
  is_active: boolean;
}

const CARD_COLORS = [
  { bg: "linear-gradient(135deg,#dcfce7,#bbf7d0)", accent: "#15803d", border: "#86efac" },
  { bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", accent: "#1d4ed8", border: "#93c5fd" },
  { bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", accent: "#7c3aed", border: "#c4b5fd" },
  { bg: "linear-gradient(135deg,#ffedd5,#fed7aa)", accent: "#c2410c", border: "#fdba74" },
  { bg: "linear-gradient(135deg,#fce7f3,#fbcfe8)", accent: "#be185d", border: "#f9a8d4" },
  { bg: "linear-gradient(135deg,#ccfbf1,#99f6e4)", accent: "#0f766e", border: "#5eead4" },
];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  useEffect(() => { loadTeachers(); }, []);

  const loadTeachers = async () => {
    setLoading(true);
    const { data } = await supabase.from("teachers").select("*").eq("is_active", true).order("created_at", { ascending: true });
    if (data) setTeachers(data);
    setLoading(false);
  };

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "#fafafa", paddingTop: "5rem" }}>

      {/* Hero Banner */}
      <div className="relative py-12 px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            👨‍🏫
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">আমাদের শিক্ষকবৃন্দ</h1>
          <p className="text-white/75 text-sm">মাদরাসার অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকগণ</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 page-enter">
        {/* Search */}
        <div className="relative mb-8 max-w-lg mx-auto">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-edu-slate-400" />
          <input
            type="text"
            placeholder="শিক্ষকের নাম বা বিষয় খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="edu-input pl-10"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="edu-card p-6 animate-pulse" style={{ height: 220 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="edu-card p-20 text-center">
            <div className="text-5xl mb-4">👤</div>
            <div className="text-edu-slate-400 text-lg">কোনো শিক্ষক পাওয়া যায়নি</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((teacher, i) => {
              const col = CARD_COLORS[i % CARD_COLORS.length];
              const initials = teacher.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
              return (
                <div
                  key={teacher.id}
                  className="edu-card p-0 overflow-hidden transition-all duration-250 hover:scale-[1.02] animate-slide-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Card Header */}
                  <div className="p-6 text-center" style={{ background: col.bg }}>
                    <div className="relative inline-block mb-3">
                      {teacher.photo_url ? (
                        <img
                          src={teacher.photo_url}
                          alt={teacher.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto"
                          style={{ border: `3px solid ${col.accent}40` }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                            (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-20 h-20 rounded-full items-center justify-center text-2xl font-bold mx-auto"
                        style={{
                          background: `${col.accent}20`,
                          border: `3px solid ${col.accent}40`,
                          color: col.accent,
                          display: teacher.photo_url ? "none" : "flex",
                        }}
                      >
                        {initials}
                      </div>
                      <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white bg-edu-green-500" />
                    </div>
                    <h3 className="font-bold text-edu-slate-800 text-base leading-tight">{teacher.name}</h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    {teacher.subject && (
                      <div className="flex items-center justify-center gap-1.5 mb-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ background: `${col.accent}12`, color: col.accent, border: `1px solid ${col.accent}25` }}>
                          <BookOpen size={11} /> {teacher.subject}
                        </div>
                      </div>
                    )}
                    {teacher.education && (
                      <p className="text-edu-slate-500 text-xs text-center line-clamp-1 mb-4">{teacher.education}</p>
                    )}
                    <button
                      onClick={() => navigate(`/teachers/${teacher.id}`)}
                      className="w-full py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90"
                      style={{ background: col.accent, color: "#ffffff" }}
                    >
                      বিস্তারিত দেখুন →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="text-center mt-10 text-edu-slate-400 text-xs">মোট {filtered.length}জন সক্রিয় শিক্ষক</div>
        )}
      </div>
    </div>
  );
}
