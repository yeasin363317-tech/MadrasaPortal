// ============================================================
// NoticeDetailPage — Dynamic notice detail by ID
// ============================================================

import { useParams, useNavigate } from "react-router-dom";
import { useLayoutEffect, useState, useEffect } from "react";
import { ArrowLeft, Pin, Bell, Calendar, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";
import supabase from "@/lib/supabase";

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
  return new Date(iso).toLocaleDateString("bn-BD", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [id]);

  useEffect(() => {
    if (id) loadNotice(id);
  }, [id]);

  const loadNotice = async (noticeId: string) => {
    setLoading(true);
    setNotFound(false);
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .eq("id", noticeId)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setNotice(data);
    }
    setLoading(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fafafa", paddingTop: "5rem" }}>
        <div className="w-10 h-10 border-4 border-edu-green-200 border-t-edu-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Not found state
  if (notFound || !notice) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#fafafa", paddingTop: "5rem" }}>
        <div className="text-center edu-card p-12 max-w-sm mx-auto">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-bold text-edu-slate-800 mb-2">নোটিশ পাওয়া যায়নি</h2>
          <p className="text-edu-slate-400 text-sm mb-6">এই নোটিশটি মুছে ফেলা হয়েছে বা বিদ্যমান নেই।</p>
          <button onClick={() => navigate("/notices")} className="btn-primary text-sm">
            <ArrowLeft size={15} /> নোটিশ বোর্ডে ফিরুন
          </button>
        </div>
      </div>
    );
  }

  const cfg = TYPE_CONFIG[notice.type] || TYPE_CONFIG.info;
  const { Icon } = cfg;

  return (
    <div className="min-h-screen page-enter" style={{ background: "#fafafa", paddingTop: "5rem" }}>

      {/* Back header */}
      <div className="sticky z-40 px-4 py-3 border-b border-edu-slate-100"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", top: "4.5rem" }}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate("/notices")}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-edu-slate-100"
            style={{ border: "1.5px solid #e2e8f0" }}>
            <ArrowLeft size={18} className="text-edu-slate-600" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-edu-slate-800 font-bold text-base truncate">নোটিশ বিস্তারিত</div>
            <div className="text-edu-slate-400 text-xs">নোটিশ বোর্ড</div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Type accent hero */}
        <div className="rounded-3xl overflow-hidden edu-card mb-6">
          <div className="h-2" style={{ background: cfg.color }} />
          <div className="p-6">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
                <Icon size={12} />
                {cfg.label}
              </div>
              {notice.is_pinned && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: "#fef3c7", border: "1px solid #fcd34d", color: "#92400e" }}>
                  <Pin size={11} /> পিন করা
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-edu-slate-800 leading-snug mb-4">
              {notice.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-2 text-edu-slate-400 text-xs mb-6 pb-5 border-b border-edu-slate-100">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: cfg.bg }}>
                <Bell size={13} style={{ color: cfg.color }} />
              </div>
              <div>
                <span className="font-semibold text-edu-slate-600">মাদরাসা নোটিশ</span>
                <span className="mx-2">•</span>
                <Calendar size={11} className="inline mb-0.5" />
                <span className="ml-1">{formatDate(notice.created_at)}</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-sm max-w-none">
              <div
                className="text-edu-slate-700 leading-relaxed text-base whitespace-pre-wrap"
                style={{ lineHeight: 1.85, wordBreak: "break-word" }}
              >
                {notice.content}
              </div>
            </div>
          </div>
        </div>

        {/* Back button at bottom */}
        <div className="text-center">
          <button
            onClick={() => navigate("/notices")}
            className="btn-outline flex items-center gap-2 mx-auto text-sm"
          >
            <ArrowLeft size={15} />
            সকল নোটিশ দেখুন
          </button>
        </div>
      </div>
    </div>
  );
}
