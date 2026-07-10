// ============================================================
// HomeworkDetailPage — Dynamic homework detail by ID
// ============================================================

import { useParams, useNavigate } from "react-router-dom";
import { useLayoutEffect, useState, useEffect } from "react";
import { ArrowLeft, Clock, AlertCircle, ClipboardList, BookOpen, Calendar } from "lucide-react";
import supabase from "@/lib/supabase";

interface HomeworkDetail {
  id: string;
  subject_id: string;
  subject_name: string;
  title: string;
  description: string;
  due_date: string;
  is_urgent: boolean;
  created_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("bn-BD", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function HomeworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hw, setHw] = useState<HomeworkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [id]);

  useEffect(() => {
    if (id) loadHomework(id);
  }, [id]);

  const loadHomework = async (hwId: string) => {
    setLoading(true);
    setNotFound(false);
    const { data, error } = await supabase
      .from("homework")
      .select("*")
      .eq("id", hwId)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setHw(data);
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

  if (notFound || !hw) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#fafafa", paddingTop: "5rem" }}>
        <div className="text-center edu-card p-12 max-w-sm mx-auto">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-xl font-bold text-edu-slate-800 mb-2">হোমওয়ার্ক পাওয়া যায়নি</h2>
          <p className="text-edu-slate-400 text-sm mb-6">এই হোমওয়ার্কটি মুছে ফেলা হয়েছে বা বিদ্যমান নেই।</p>
          <button onClick={() => navigate(-1)} className="btn-primary text-sm">
            <ArrowLeft size={15} /> ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  const isUrgent = hw.is_urgent;

  return (
    <div className="min-h-screen page-enter" style={{ background: "#fafafa", paddingTop: "5rem" }}>

      {/* Back header */}
      <div className="sticky z-40 px-4 py-3 border-b border-edu-slate-100"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", top: "4.5rem" }}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-edu-slate-100"
            style={{ border: "1.5px solid #e2e8f0" }}>
            <ArrowLeft size={18} className="text-edu-slate-600" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-edu-slate-800 font-bold text-base truncate">হোমওয়ার্ক বিস্তারিত</div>
            <div className="text-edu-slate-400 text-xs">{hw.subject_name}</div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Hero Card */}
        <div className="edu-card overflow-hidden mb-6">
          <div className="h-2" style={{ background: isUrgent ? "#dc2626" : "#15803d" }} />
          <div className="p-6">

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {isUrgent && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626" }}>
                  <AlertCircle size={12} /> জরুরি হোমওয়ার্ক
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "#f0fdf4", border: "1px solid #86efac", color: "#15803d" }}>
                <BookOpen size={11} /> {hw.subject_name}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-edu-slate-800 leading-snug mb-4">
              {hw.title}
            </h1>

            {/* Meta info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 pb-5 border-b border-edu-slate-100">
              <div className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#f0fdf4" }}>
                  <Clock size={15} className="text-edu-green-600" />
                </div>
                <div>
                  <div className="text-xs text-edu-slate-400 font-semibold">জমার তারিখ</div>
                  <div className="text-edu-slate-800 text-sm font-bold">{hw.due_date || "নির্ধারিত নয়"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#f0fdf4" }}>
                  <Calendar size={15} className="text-edu-green-600" />
                </div>
                <div>
                  <div className="text-xs text-edu-slate-400 font-semibold">প্রদানের তারিখ</div>
                  <div className="text-edu-slate-800 text-sm font-bold">{formatDate(hw.created_at)}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {hw.description ? (
              <div>
                <div className="flex items-center gap-2 text-edu-slate-700 text-sm font-bold mb-3">
                  <ClipboardList size={15} className="text-edu-green-600" />
                  হোমওয়ার্কের বিবরণ
                </div>
                <div
                  className="text-edu-slate-700 leading-relaxed text-base whitespace-pre-wrap"
                  style={{ lineHeight: 1.85, wordBreak: "break-word" }}
                >
                  {hw.description}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-edu-slate-400 text-sm">বিস্তারিত বিবরণ নেই।</div>
              </div>
            )}
          </div>
        </div>

        {/* Subject link */}
        {hw.subject_id && (
          <button
            onClick={() => navigate(`/subject/${hw.subject_id}`)}
            className="w-full edu-card p-4 flex items-center gap-4 text-left mb-4 transition-all hover:shadow-md"
          >
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
              <BookOpen size={18} className="text-edu-green-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-edu-slate-400 font-semibold">বিষয়ের পেজে যান</div>
              <div className="text-edu-slate-800 font-bold text-sm">{hw.subject_name}</div>
            </div>
            <div className="text-edu-green-600 text-sm font-semibold">→</div>
          </button>
        )}

        <div className="text-center">
          <button onClick={() => navigate(-1)} className="btn-outline flex items-center gap-2 mx-auto text-sm">
            <ArrowLeft size={15} />
            ফিরে যান
          </button>
        </div>
      </div>
    </div>
  );
}
