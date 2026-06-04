// ============================================================
// TeachersPage - পাবলিক শিক্ষক তালিকা পেজ
// ============================================================

import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Search, GraduationCap, BookOpen } from "lucide-react";
import IslamicPattern, { IslamicBorder, StarOrnament } from "@/components/layout/IslamicPattern";
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

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true });
    if (error) console.error("Teachers load error:", error);
    if (data) setTeachers(data);
    setLoading(false);
  };

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen islamic-bg" style={{ paddingTop: "5rem" }}>
      <IslamicPattern opacity={0.04} />

      {/* ── Page Header ── */}
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
            <GraduationCap size={28} className="text-madrasa-dark" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-warm-white mb-3 font-bangla">
            আমাদের <span className="text-gold-gradient">শিক্ষকবৃন্দ</span>
          </h1>
          <p className="text-warm-white/50 text-sm leading-relaxed">
            মাদরাসার অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকদের সাথে পরিচিত হোন
          </p>
          <IslamicBorder />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20 page-enter">

        {/* ── Search ── */}
        <div className="relative mb-10 max-w-lg mx-auto">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-white/40" />
          <input
            type="text"
            placeholder="শিক্ষকের নাম বা বিষয় খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-islamic pl-10 text-sm w-full"
          />
        </div>

        {/* ── Loading ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="w-20 h-20 bg-white/5 rounded-full mx-auto mb-4" />
                <div className="h-4 bg-white/5 rounded w-2/3 mx-auto mb-2" />
                <div className="h-3 bg-white/5 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-20 text-center">
            <User size={48} className="text-warm-white/10 mx-auto mb-4" />
            <div className="text-warm-white/30 text-lg">কোনো শিক্ষক পাওয়া যায়নি</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((teacher, i) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                index={i}
                onViewDetails={() => navigate(`/teachers/${teacher.id}`)}
              />
            ))}
          </div>
        )}

        {/* Count */}
        {!loading && filtered.length > 0 && (
          <div className="text-center mt-10 text-warm-white/25 text-xs">
            মোট {filtered.length}জন সক্রিয় শিক্ষক
          </div>
        )}
      </div>
    </div>
  );
}

// ── Teacher Card ──────────────────────────────────────────────
interface TeacherCardProps {
  teacher: Teacher;
  index: number;
  onViewDetails: () => void;
}

function TeacherCard({ teacher, index, onViewDetails }: TeacherCardProps) {
  const initials = teacher.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div
      className="glass-card p-6 flex flex-col items-center text-center gap-4 animate-slide-up transition-all duration-200 hover:border-islamic-gold-400/25"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Photo */}
      <div className="relative">
        {teacher.photo_url ? (
          <img
            src={teacher.photo_url}
            alt={teacher.name}
            className="w-24 h-24 rounded-full object-cover"
            style={{ border: "2px solid rgba(201,162,39,0.3)" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-24 h-24 rounded-full items-center justify-center text-2xl font-bold flex-shrink-0"
          style={{
            background: "rgba(201,162,39,0.12)",
            border: "2px solid rgba(201,162,39,0.25)",
            color: "#c9a227",
            display: teacher.photo_url ? "none" : "flex",
          }}
        >
          {initials}
        </div>
        {/* Online dot */}
        <div
          className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2"
          style={{ background: "#2d9d64", borderColor: "rgba(7,26,14,0.9)" }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 w-full">
        <h3 className="text-warm-white font-bold text-base leading-tight mb-1">{teacher.name}</h3>
        {teacher.subject && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-1"
            style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)", color: "#c9a227" }}>
            <BookOpen size={11} />
            {teacher.subject}
          </div>
        )}
        {teacher.education && (
          <p className="text-warm-white/40 text-xs mt-2 line-clamp-1">{teacher.education}</p>
        )}
      </div>

      {/* Button */}
      <button
        onClick={onViewDetails}
        className="btn-gold w-full text-sm flex items-center justify-center gap-2"
      >
        বিস্তারিত দেখুন
      </button>
    </div>
  );
}
