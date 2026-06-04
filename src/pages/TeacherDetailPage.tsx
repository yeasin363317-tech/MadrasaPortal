// ============================================================
// TeacherDetailPage - শিক্ষকের বিস্তারিত প্রোফাইল
// ============================================================

import { useState, useEffect, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, GraduationCap, BookOpen, User, FileText } from "lucide-react";
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

export default function TeacherDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  useEffect(() => {
    if (id) loadTeacher(id);
  }, [id]);

  const loadTeacher = async (teacherId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("id", teacherId)
      .single();
    if (error) console.error("Teacher load error:", error);
    if (data) setTeacher(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen islamic-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-islamic-gold-400/30 border-t-islamic-gold-400 rounded-full animate-spin mx-auto mb-4" />
          <div className="text-warm-white/50">লোড হচ্ছে...</div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen islamic-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <div className="text-warm-white text-xl mb-4">শিক্ষক পাওয়া যায়নি</div>
          <button onClick={() => navigate("/teachers")} className="btn-gold">শিক্ষক তালিকায় ফিরুন</button>
        </div>
      </div>
    );
  }

  const initials = teacher.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const contactItems = [
    teacher.phone && { icon: Phone, label: "ফোন নম্বর", value: teacher.phone, href: `tel:${teacher.phone.replace(/[^+\d]/g, "")}`, color: "#2d9d64" },
    teacher.email && { icon: Mail, label: "ইমেইল", value: teacher.email, href: `mailto:${teacher.email}`, color: "#c9a227" },
    teacher.education && { icon: GraduationCap, label: "শিক্ষাগত যোগ্যতা", value: teacher.education, href: null, color: "#c9a227" },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string; href: string | null; color: string }[];

  return (
    <div className="min-h-screen islamic-bg page-enter" style={{ paddingTop: "5rem" }}>
      <IslamicPattern opacity={0.04} />

      {/* ── Back Header ── */}
      <div
        className="sticky top-0 z-40 px-4 py-4 border-b border-white/10"
        style={{ background: "rgba(7,26,14,0.95)", backdropFilter: "blur(20px)", top: "5rem" }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl transition-all hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <ArrowLeft size={20} className="text-warm-white/70" />
          </button>
          <div>
            <div className="text-warm-white font-bold text-base">{teacher.name}</div>
            <div className="text-warm-white/40 text-xs">শিক্ষক প্রোফাইল</div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* ── Profile Card ── */}
        <div className="glass-card p-8 mb-6 text-center relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-5 -translate-y-1/2"
            style={{ background: "#c9a227" }} />

          <div className="relative z-10">
            {/* Photo */}
            <div className="relative inline-block mb-5">
              {teacher.photo_url ? (
                <img
                  src={teacher.photo_url}
                  alt={teacher.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto"
                  style={{ border: "3px solid rgba(201,162,39,0.4)", boxShadow: "0 8px 32px rgba(201,162,39,0.2)" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-32 h-32 rounded-full items-center justify-center text-4xl font-bold mx-auto"
                style={{
                  background: "rgba(201,162,39,0.12)",
                  border: "3px solid rgba(201,162,39,0.3)",
                  color: "#c9a227",
                  boxShadow: "0 8px 32px rgba(201,162,39,0.15)",
                  display: teacher.photo_url ? "none" : "flex",
                }}
              >
                {initials}
              </div>
              {/* Active badge */}
              {teacher.is_active && (
                <div
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{ background: "#2d9d64", borderColor: "rgba(7,26,14,0.9)" }}
                  title="সক্রিয় শিক্ষক"
                />
              )}
            </div>

            <h1 className="text-2xl font-bold text-warm-white mb-2">{teacher.name}</h1>

            {teacher.subject && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-3"
                style={{ background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.25)", color: "#c9a227" }}>
                <BookOpen size={14} />
                {teacher.subject}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-warm-white/40 text-xs">
              <StarOrnament size={12} />
              <span>গাজীর চট মদিনাতুল উলুম ফাজিল মাদরাসা</span>
              <StarOrnament size={12} />
            </div>
          </div>
        </div>

        {/* ── About Section ── */}
        {teacher.about && (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-islamic-gold-400 font-bold text-base mb-4 flex items-center gap-2">
              <FileText size={16} />
              পরিচিতি
            </h2>
            <IslamicBorder />
            <p className="text-warm-white/70 text-sm leading-relaxed mt-4 whitespace-pre-line">
              {teacher.about}
            </p>
          </div>
        )}

        {/* ── Contact & Info ── */}
        {contactItems.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-islamic-gold-400 font-bold text-base mb-4 flex items-center gap-2">
              <User size={16} />
              তথ্য ও যোগাযোগ
            </h2>
            <IslamicBorder />
            <div className="space-y-4 mt-4">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}
                  >
                    <item.icon size={17} style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="text-warm-white/40 text-xs font-semibold uppercase tracking-wider mb-0.5">
                      {item.label}
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-warm-white/80 hover:text-islamic-gold-400 transition-colors text-sm"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-warm-white/80 text-sm">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Back button ── */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/teachers")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-warm-white/60 hover:text-warm-white transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <ArrowLeft size={15} />
            সব শিক্ষকের তালিকায় ফিরুন
          </button>
        </div>
      </div>
    </div>
  );
}
