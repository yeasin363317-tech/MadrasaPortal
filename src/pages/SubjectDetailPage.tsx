// ============================================================
// SubjectDetailPage — Light theme with homework & suggestions
// ============================================================

import { useParams, useNavigate } from "react-router-dom";
import { useLayoutEffect, useState, useEffect } from "react";
import { ArrowLeft, User, BookOpen, ClipboardList, Lightbulb, AlertCircle, Clock, Star } from "lucide-react";
import type { Homework, Suggestion, Subject } from "@/types";
import supabase from "@/lib/supabase";

const TABS = [
  { id: "overview", label: "পরিচিতি", icon: BookOpen, emoji: "📖" },
  { id: "homework", label: "হোমওয়ার্ক", icon: ClipboardList, emoji: "📝" },
  { id: "suggestion", label: "সাজেশন", icon: Lightbulb, emoji: "💡" },
];

export default function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "homework" | "suggestion">("overview");

  // Safe fallback color so hero card never crashes on missing color
  const safeColor = (c?: string | null) => (c && c.startsWith("#") ? c : "#15803d");

  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [id]);
  useEffect(() => { if (id) loadData(id); }, [id]);

  const loadData = async (subjectId: string) => {
    setLoading(true);
    const [subjectRes, hwRes, sugRes] = await Promise.all([
      supabase.from("subjects").select("*").eq("id", subjectId).single(),
      supabase.from("homework").select("*").eq("subject_id", subjectId).order("created_at", { ascending: false }),
      supabase.from("suggestions").select("*").eq("subject_id", subjectId).order("created_at", { ascending: false }),
    ]);
    if (subjectRes.data) {
      const s = subjectRes.data;
      setSubject({
        id: s.id, name: s.name, nameEn: s.name_en, teacher: s.teacher,
        teacherDesignation: s.teacher_designation, icon: s.icon, color: s.color,
        description: s.description, totalClasses: s.total_classes,
        completedClasses: s.completed_classes, createdAt: s.created_at,
      });
    }
    if (hwRes.data) {
      setHomework(hwRes.data.map((h: any) => ({
        id: h.id, subjectId: h.subject_id, subjectName: h.subject_name,
        title: h.title, description: h.description, dueDate: h.due_date,
        isUrgent: h.is_urgent, createdAt: h.created_at,
      })));
    }
    if (sugRes.data) {
      setSuggestions(sugRes.data.map((s: any) => ({
        id: s.id, subjectId: s.subject_id, subjectName: s.subject_name,
        title: s.title, description: s.description, examType: s.exam_type,
        topics: s.topics || [], importance: s.importance, createdAt: s.created_at,
      })));
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fafafa", paddingTop: "5rem" }}>
        <div className="w-10 h-10 border-4 border-edu-green-200 border-t-edu-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fafafa", paddingTop: "5rem" }}>
        <div className="text-center">
          <div className="text-5xl mb-4">📚</div>
          <div className="text-edu-slate-500 text-xl mb-4">বিষয় পাওয়া যায়নি</div>
          <button onClick={() => navigate("/")} className="btn-primary">হোমে ফিরুন</button>
        </div>
      </div>
    );
  }

  const sc = safeColor(subject?.color);

  const getImportanceBadge = (imp: string) => {
    if (imp === "অতি গুরুত্বপূর্ণ") return { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" };
    if (imp === "গুরুত্বপূর্ণ") return { color: "#d97706", bg: "#fffbeb", border: "#fcd34d" };
    return { color: "#15803d", bg: "#f0fdf4", border: "#86efac" };
  };

  return (
    <div className="min-h-screen page-enter" style={{ background: "#fafafa", paddingTop: "5rem" }}>

      {/* Back header */}
      <div className="sticky top-0 z-40 px-4 py-3 border-b border-edu-slate-100"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", top: "4.5rem" }}>
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-edu-slate-100"
            style={{ border: "1.5px solid #e2e8f0" }}>
            <ArrowLeft size={18} className="text-edu-slate-600" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-edu-slate-800 font-bold text-base truncate">{subject.name}</div>
            <div className="text-edu-slate-400 text-xs">{subject.nameEn}</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Hero Card */}
        <div className="edu-card p-6 mb-6 overflow-hidden relative"
          style={{ background: `linear-gradient(135deg, ${sc}15, ${sc}08)`, border: `1px solid ${sc}30` }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
            style={{ background: sc }} />
          <div className="relative flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.9)", border: `2px solid ${sc}30`, boxShadow: `0 4px 16px ${sc}20` }}>
              {subject.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-edu-slate-800 mb-2">{subject.name}</h1>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${sc}15` }}>
                  <User size={14} style={{ color: sc }} />
                </div>
                <div>
                  <div className="text-edu-slate-700 text-sm font-semibold">{subject.teacher}</div>
                  <div className="text-edu-slate-400 text-xs">{subject.teacherDesignation}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1.5 rounded-2xl bg-edu-slate-100">
          {TABS.map((tab) => {
            const count = tab.id === "homework" ? homework.length : tab.id === "suggestion" ? suggestions.length : null;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-edu-green-700 shadow-card"
                    : "text-edu-slate-500 hover:text-edu-slate-700"
                }`}>
                <span>{tab.emoji}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {count !== null && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.id ? "bg-edu-green-100 text-edu-green-700" : "bg-edu-slate-200 text-edu-slate-500"
                  }`}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4 animate-fade-in">
            <div className="edu-card p-6">
              <h3 className="text-edu-green-700 font-bold text-base mb-3 flex items-center gap-2">
                <BookOpen size={16} /> বিষয় পরিচিতি
              </h3>
              <div className="h-px bg-edu-slate-100 mb-4" />
              <p className="text-edu-slate-600 leading-relaxed text-sm">{subject.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="edu-card p-5 text-center">
                <div className="text-3xl mb-2">📝</div>
                <div className="text-2xl font-bold text-edu-slate-800 mb-1">{homework.length}</div>
                <div className="text-edu-slate-500 text-xs">হোমওয়ার্ক</div>
              </div>
              <div className="edu-card p-5 text-center">
                <div className="text-3xl mb-2">💡</div>
                <div className="text-2xl font-bold text-edu-slate-800 mb-1">{suggestions.length}</div>
                <div className="text-edu-slate-500 text-xs">সাজেশন</div>
              </div>
            </div>
          </div>
        )}

        {/* Homework Tab */}
        {activeTab === "homework" && (
          <div className="space-y-4 animate-fade-in">
            {homework.length === 0 ? (
              <div className="edu-card p-16 text-center">
                <div className="text-5xl mb-4">📝</div>
                <div className="text-edu-slate-400 text-lg">কোনো হোমওয়ার্ক নেই</div>
              </div>
            ) : homework.map((hw, i) => (
              <div key={hw.id} className="edu-card p-5 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: hw.isUrgent ? "#fef2f2" : "#f0fdf4", border: hw.isUrgent ? "1px solid #fca5a5" : "1px solid #86efac" }}>
                    {hw.isUrgent
                      ? <AlertCircle size={18} className="text-red-500" />
                      : <ClipboardList size={18} className="text-edu-green-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-edu-slate-800 font-bold text-sm">{hw.title}</h4>
                      {hw.isUrgent && <span className="badge-red text-xs flex-shrink-0">জরুরি</span>}
                    </div>
                    <p className="text-edu-slate-600 text-sm leading-relaxed mb-3">{hw.description}</p>
                    {hw.dueDate && (
                      <div className="flex items-center gap-1.5 text-xs text-edu-slate-400">
                        <Clock size={12} /> জমার তারিখ: {hw.dueDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === "suggestion" && (
          <div className="space-y-4 animate-fade-in">
            {suggestions.length === 0 ? (
              <div className="edu-card p-16 text-center">
                <div className="text-5xl mb-4">💡</div>
                <div className="text-edu-slate-400 text-lg">কোনো সাজেশন নেই</div>
              </div>
            ) : suggestions.map((sug, i) => {
              const badge = getImportanceBadge(sug.importance);
              return (
                <div key={sug.id} className="edu-card p-6 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-edu-slate-800 font-bold text-lg mb-2">{sug.title}</h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac" }}>
                          {sug.examType}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
                          {sug.importance}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl flex-shrink-0">💡</div>
                  </div>
                  {sug.description && (
                    <p className="text-edu-slate-600 text-sm mb-4 leading-relaxed">{sug.description}</p>
                  )}
                  {sug.topics.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-edu-slate-700 text-sm font-semibold mb-2">
                        <Star size={14} className="text-edu-gold-500" /> গুরুত্বপূর্ণ টপিক:
                      </div>
                      <div className="space-y-1.5">
                        {sug.topics.map((topic, j) => (
                          <div key={j} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                            style={{ background: "#f0fdf4", border: "1px solid #dcfce7" }}>
                            <div className="w-1.5 h-1.5 rounded-full bg-edu-green-500 flex-shrink-0" />
                            <span className="text-edu-slate-700 text-sm">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
