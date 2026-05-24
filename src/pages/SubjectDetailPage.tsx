// ============================================================
// SubjectDetailPage - Supabase থেকে হোমওয়ার্ক ও সাজেশন দেখায়
// ============================================================

import { useParams, useNavigate } from "react-router-dom";
import { useLayoutEffect } from "react";
import { ArrowLeft, User, BookOpen, ClipboardList, Lightbulb, AlertCircle, Clock, Star } from "lucide-react";
import IslamicPattern, { IslamicBorder, StarOrnament } from "@/components/layout/IslamicPattern";
import type { Homework, Suggestion, Subject } from "@/types";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";

export default function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "homework" | "suggestion">("overview");

  // Fix: scroll to top when page loads (prevents jump-to-bottom on navigate)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

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

    console.log("Subject detail loaded:", subjectId);
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

  if (!subject) {
    return (
      <div className="min-h-screen islamic-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <div className="text-warm-white text-xl mb-4">বিষয় পাওয়া যায়নি</div>
          <button onClick={() => navigate("/")} className="btn-gold">হোমে ফিরুন</button>
        </div>
      </div>
    );
  }

  const progress = Math.round((subject.completedClasses / subject.totalClasses) * 100);

  const tabs = [
    { id: "overview", label: "পরিচিতি", icon: BookOpen },
    { id: "homework", label: `হোমওয়ার্ক (${homework.length})`, icon: ClipboardList },
    { id: "suggestion", label: `সাজেশন (${suggestions.length})`, icon: Lightbulb },
  ];

  const getImportanceBadge = (imp: string) => {
    if (imp === "অতি গুরুত্বপূর্ণ") return "text-red-400 bg-red-400/10 border-red-400/30";
    if (imp === "গুরুত্বপূর্ণ") return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    return "text-green-400 bg-green-400/10 border-green-400/30";
  };

  return (
    <div className="min-h-screen islamic-bg page-enter">
      <IslamicPattern />

      {/* Header */}
      <div className="sticky top-0 z-40 px-4 py-4 backdrop-blur-xl border-b border-white/10"
        style={{ background: "rgba(7,26,14,0.9)", paddingTop: "5.5rem" }}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl transition-all hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <ArrowLeft size={20} className="text-warm-white/70" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-warm-white font-bold text-lg truncate">{subject.name}</div>
            <div className="text-warm-white/40 text-xs">{subject.nameEn}</div>
          </div>
          <div className="text-sm font-bold px-3 py-1.5 rounded-full"
            style={{ background: `${subject.color}22`, color: subject.color, border: `1px solid ${subject.color}33` }}>
            {progress}% সম্পন্ন
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Subject Hero Card */}
        <div className="glass-card p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
            style={{ background: subject.color }} />
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-arabic shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${subject.color}22, ${subject.color}44)`,
                  border: `2px solid ${subject.color}44`, color: subject.color,
                }}>
                {subject.icon}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-warm-white mb-2">{subject.name}</h1>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(201,162,39,0.15)" }}>
                    <User size={14} className="text-islamic-gold-400" />
                  </div>
                  <div>
                    <div className="text-warm-white/80 text-sm font-semibold">{subject.teacher}</div>
                    <div className="text-warm-white/40 text-xs">{subject.teacherDesignation}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-warm-white/60">ক্লাস অগ্রগতি</span>
                <span className="text-warm-white/80 font-semibold">{subject.completedClasses} / {subject.totalClasses} ক্লাস</span>
              </div>
              <div className="w-full h-3 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${subject.color}, ${subject.color}cc)`,
                    boxShadow: `0 0 10px ${subject.color}66`,
                    transition: "width 1s ease",
                  }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id ? "bg-islamic-gold-400 text-madrasa-dark shadow-lg" : "text-warm-white/50 hover:text-warm-white"
              }`}>
              <tab.icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.id === "overview" ? "পরিচিতি" : tab.id === "homework" ? "HW" : "Sug"}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-islamic-gold-400 mb-4 flex items-center gap-2">
                <BookOpen size={18} /> বিষয় পরিচিতি
              </h3>
              <p className="text-warm-white/70 leading-relaxed">{subject.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "মোট ক্লাস", value: subject.totalClasses },
                { label: "সম্পন্ন ক্লাস", value: subject.completedClasses },
                { label: "বাকি ক্লাস", value: subject.totalClasses - subject.completedClasses },
                { label: "অগ্রগতি", value: `${progress}%` },
              ].map((item) => (
                <div key={item.label} className="glass-card p-4 text-center">
                  <div className="text-2xl font-bold text-warm-white mb-1">{item.value}</div>
                  <div className="text-warm-white/50 text-xs">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "homework" && (
          <div className="space-y-4 animate-fade-in">
            {homework.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-5xl mb-4">📝</div>
                <div className="text-warm-white/40 text-lg">কোনো হোমওয়ার্ক নেই</div>
              </div>
            ) : (
              homework.map((hw, i) => (
                <div key={hw.id} className="glass-card p-6 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: hw.isUrgent ? "rgba(239,68,68,0.15)" : "rgba(201,162,39,0.15)" }}>
                      {hw.isUrgent
                        ? <AlertCircle size={18} className="text-red-400" />
                        : <ClipboardList size={18} className="text-islamic-gold-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-warm-white font-bold">{hw.title}</h4>
                        {hw.isUrgent && <span className="badge-gold text-xs px-2 py-0.5 flex-shrink-0">জরুরি</span>}
                      </div>
                      <p className="text-warm-white/60 text-sm leading-relaxed mb-3">{hw.description}</p>
                      <div className="flex items-center gap-1.5 text-xs text-warm-white/40">
                        <Clock size={12} />
                        <span>জমার তারিখ: {hw.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "suggestion" && (
          <div className="space-y-4 animate-fade-in">
            {suggestions.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-5xl mb-4">💡</div>
                <div className="text-warm-white/40 text-lg">কোনো সাজেশন নেই</div>
              </div>
            ) : (
              suggestions.map((sug, i) => (
                <div key={sug.id} className="glass-card p-6 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-warm-white font-bold text-lg mb-1">{sug.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-islamic-green-500/30 text-islamic-green-300 border border-islamic-green-500/30">
                          {sug.examType}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${getImportanceBadge(sug.importance)}`}>
                          {sug.importance}
                        </span>
                      </div>
                    </div>
                    <Lightbulb size={24} className="text-islamic-gold-400 flex-shrink-0" />
                  </div>
                  <p className="text-warm-white/60 text-sm mb-4">{sug.description}</p>
                  <div className="space-y-2">
                    <div className="text-warm-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
                      <Star size={14} className="text-islamic-gold-400" /> গুরুত্বপূর্ণ টপিক:
                    </div>
                    {sug.topics.map((topic, j) => (
                      <div key={j} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.12)" }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-islamic-gold-400 flex-shrink-0" />
                        <span className="text-warm-white/70 text-sm">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
