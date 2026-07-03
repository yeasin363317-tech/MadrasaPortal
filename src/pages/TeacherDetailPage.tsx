// ============================================================
// TeacherDetailPage — Modern profile, light theme
// ============================================================

import { useState, useEffect, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, GraduationCap, BookOpen, FileText } from "lucide-react";
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

  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [id]);
  useEffect(() => { if (id) loadTeacher(id); }, [id]);

  const loadTeacher = async (teacherId: string) => {
    setLoading(true);
    const { data } = await supabase.from("teachers").select("*").eq("id", teacherId).single();
    if (data) setTeacher(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fafafa", paddingTop: "5rem" }}>
        <div className="w-10 h-10 border-4 border-edu-green-200 border-t-edu-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fafafa", paddingTop: "5rem" }}>
        <div className="text-center">
          <div className="text-5xl mb-4">👤</div>
          <div className="text-edu-slate-500 text-lg mb-4">শিক্ষক পাওয়া যায়নি</div>
          <button onClick={() => navigate("/teachers")} className="btn-primary">শিক্ষক তালিকায় ফিরুন</button>
        </div>
      </div>
    );
  }

  const initials = teacher.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const contactItems = [
    teacher.phone && { icon: Phone, label: "ফোন নম্বর", value: teacher.phone, href: `tel:${teacher.phone.replace(/[^+\d]/g, "")}`, color: "#15803d" },
    teacher.email && { icon: Mail, label: "ইমেইল", value: teacher.email, href: `mailto:${teacher.email}`, color: "#1d4ed8" },
    teacher.education && { icon: GraduationCap, label: "শিক্ষাগত যোগ্যতা", value: teacher.education, href: null, color: "#7c3aed" },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string; href: string | null; color: string }[];

  return (
    <div className="min-h-screen page-enter" style={{ background: "#fafafa", paddingTop: "5rem" }}>

      {/* Back Header */}
      <div className="sticky top-0 z-40 px-4 py-3 border-b border-edu-slate-100"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", top: "4.5rem" }}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-edu-slate-100"
            style={{ border: "1.5px solid #e2e8f0" }}>
            <ArrowLeft size={18} className="text-edu-slate-600" />
          </button>
          <div>
            <div className="text-edu-slate-800 font-bold text-base">{teacher.name}</div>
            <div className="text-edu-slate-400 text-xs">শিক্ষক প্রোফাইল</div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Profile Card */}
        <div className="edu-card p-8 mb-5 text-center overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-32 rounded-t-3xl"
            style={{ background: "linear-gradient(135deg, #15803d, #22c55e)" }} />
          <div className="relative z-10">
            {/* Photo */}
            <div className="relative inline-block mb-4">
              {teacher.photo_url ? (
                <img src={teacher.photo_url} alt={teacher.name}
                  className="w-28 h-28 rounded-full object-cover mx-auto"
                  style={{ border: "4px solid #ffffff", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-28 h-28 rounded-full items-center justify-center text-3xl font-bold mx-auto"
                style={{
                  background: "#dcfce7", border: "4px solid #ffffff",
                  color: "#15803d", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  display: teacher.photo_url ? "none" : "flex",
                }}
              >
                {initials}
              </div>
              {teacher.is_active && (
                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white bg-edu-green-500" />
              )}
            </div>

            <h1 className="text-2xl font-bold text-edu-slate-800 mb-2">{teacher.name}</h1>

            {teacher.subject && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-2"
                style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac" }}>
                <BookOpen size={14} /> {teacher.subject}
              </div>
            )}

            <p className="text-edu-slate-400 text-xs">গাজীর চট মদিনাতুল উলুম ফাজিল মাদরাসা</p>
          </div>
        </div>

        {/* About */}
        {teacher.about && (
          <div className="edu-card p-6 mb-5">
            <h2 className="text-edu-green-700 font-bold text-base mb-3 flex items-center gap-2">
              <FileText size={16} /> পরিচিতি
            </h2>
            <div className="h-px bg-edu-slate-100 mb-4" />
            <p className="text-edu-slate-600 text-sm leading-relaxed whitespace-pre-line">{teacher.about}</p>
          </div>
        )}

        {/* Contact */}
        {contactItems.length > 0 && (
          <div className="edu-card p-6 mb-8">
            <h2 className="text-edu-green-700 font-bold text-base mb-3 flex items-center gap-2">
              <Phone size={16} /> তথ্য ও যোগাযোগ
            </h2>
            <div className="h-px bg-edu-slate-100 mb-4" />
            <div className="space-y-4">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                    <item.icon size={17} style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="text-edu-slate-400 text-xs font-semibold uppercase tracking-wider mb-0.5">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-edu-slate-700 hover:text-edu-green-600 transition-colors text-sm font-semibold">
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-edu-slate-700 text-sm">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => navigate("/teachers")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-edu-slate-600 hover:bg-edu-slate-100 transition-colors"
          style={{ border: "1.5px solid #e2e8f0" }}>
          <ArrowLeft size={15} /> সব শিক্ষকের তালিকায় ফিরুন
        </button>
      </div>
    </div>
  );
}
