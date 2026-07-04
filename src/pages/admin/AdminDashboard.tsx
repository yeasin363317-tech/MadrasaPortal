// ============================================================
// AdminDashboard — Premium Light Theme
// ============================================================

import { useState, useEffect } from "react";
import { BookOpen, ClipboardList, Lightbulb, MessageCircle, Users, Bell, Plus, Save, Edit2, X, TrendingUp, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import AdminSidebar from "@/components/layout/AdminSidebar";
import supabase from "@/lib/supabase";
import { toast } from "sonner";

interface DashboardData {
  subjectsCount: number;
  homeworkCount: number;
  urgentHomeworkCount: number;
  suggestionsCount: number;
  teachersCount: number;
  noticesCount: number;
  messagesCount: number;
  urgentHomework: any[];
  recentMessages: any[];
}

// Reusable light-theme admin layout wrapper
function AdminLayout({ children, title, subtitle, action }: { children: React.ReactNode; title: string; subtitle?: string; action?: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-72 min-h-screen">
        {/* Topbar */}
        <div className="sticky top-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-edu-slate-100 transition-colors">
              <Menu size={20} className="text-edu-slate-600" />
            </button>
            <div>
              <h1 className="text-edu-slate-800 font-bold text-xl">{title}</h1>
              {subtitle && <p className="text-edu-slate-400 text-xs">{subtitle}</p>}
            </div>
          </div>
          {action}
        </div>
        <div className="p-4 md:p-8 page-enter">{children}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<DashboardData>({
    subjectsCount: 0, homeworkCount: 0, urgentHomeworkCount: 0,
    suggestionsCount: 0, teachersCount: 0, noticesCount: 0,
    messagesCount: 0, urgentHomework: [], recentMessages: [],
  });
  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState("156");
  const [session, setSession] = useState("২০২৫-২০২৬");
  const [editingSettings, setEditingSettings] = useState(false);
  const [tempStudentCount, setTempStudentCount] = useState("156");
  const [tempSession, setTempSession] = useState("২০২৫-২০২৬");
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => { loadDashboard(); loadSettings(); }, []);

  const loadSettings = async () => {
    const { data: s } = await supabase.from("settings").select("key,value").in("key", ["student_count", "session"]);
    if (s) {
      const sc = s.find((x: any) => x.key === "student_count");
      const ss = s.find((x: any) => x.key === "session");
      if (sc) setStudentCount(sc.value);
      if (ss) setSession(ss.value);
    }
  };

  const loadDashboard = async () => {
    setLoading(true);
    const [subjectsRes, hwRes, sugRes, msgRes, teachersRes, noticesRes] = await Promise.all([
      supabase.from("subjects").select("id", { count: "exact" }),
      supabase.from("homework").select("*").order("created_at", { ascending: false }),
      supabase.from("suggestions").select("id", { count: "exact" }),
      supabase.from("chat_messages").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("teachers").select("id", { count: "exact" }).eq("is_active", true),
      supabase.from("notices").select("id", { count: "exact" }),
    ]);
    const homework = hwRes.data || [];
    const messages = msgRes.data || [];
    setData({
      subjectsCount: subjectsRes.count || 0,
      homeworkCount: homework.length,
      urgentHomeworkCount: homework.filter((h: any) => h.is_urgent).length,
      suggestionsCount: sugRes.count || 0,
      teachersCount: teachersRes.count || 0,
      noticesCount: noticesRes.count || 0,
      messagesCount: messages.length,
      urgentHomework: homework.filter((h: any) => h.is_urgent).slice(0, 4),
      recentMessages: messages.slice(0, 5),
    });
    setLoading(false);
  };

  const saveSettings = async () => {
    if (!tempStudentCount.trim() || !tempSession.trim()) { toast.error("সব তথ্য পূরণ করুন"); return; }
    setSavingSettings(true);
    const { error } = await supabase.from("settings").upsert([
      { key: "student_count", value: tempStudentCount.trim(), updated_at: new Date().toISOString() },
      { key: "session", value: tempSession.trim(), updated_at: new Date().toISOString() },
    ]);
    if (error) { toast.error("সংরক্ষণ হয়নি"); setSavingSettings(false); return; }
    setStudentCount(tempStudentCount.trim());
    setSession(tempSession.trim());
    setSavingSettings(false);
    setEditingSettings(false);
    toast.success("তথ্য সংরক্ষিত হয়েছে ✓");
  };

  const stats = [
    { label: "মোট বিষয়", value: loading ? "..." : data.subjectsCount, icon: BookOpen, color: "#15803d", bg: "#f0fdf4", href: "/admin/subjects" },
    { label: "হোমওয়ার্ক", value: loading ? "..." : data.homeworkCount, icon: ClipboardList, color: "#1d4ed8", bg: "#dbeafe", href: "/admin/homework", sub: `${data.urgentHomeworkCount} জরুরি` },
    { label: "সাজেশন", value: loading ? "..." : data.suggestionsCount, icon: Lightbulb, color: "#d4af37", bg: "#fef3c7", href: "/admin/suggestions" },
    { label: "চ্যাট মেসেজ", value: loading ? "..." : data.messagesCount, icon: MessageCircle, color: "#0891b2", bg: "#ecfeff", href: "/admin/chat" },
    { label: "সক্রিয় শিক্ষক", value: loading ? "..." : data.teachersCount, icon: Users, color: "#7c3aed", bg: "#ede9fe", href: "/admin/teachers" },
    { label: "নোটিশ", value: loading ? "..." : data.noticesCount, icon: Bell, color: "#c2410c", bg: "#ffedd5", href: "/admin/notices" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-72 min-h-screen">
        {/* Topbar */}
        <div className="sticky top-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-edu-slate-100 transition-colors">
              <Menu size={20} className="text-edu-slate-600" />
            </button>
            <div>
              <h1 className="text-edu-slate-800 font-bold text-xl">ড্যাশবোর্ড</h1>
              <p className="text-edu-slate-400 text-xs">স্বাগতম, এডমিন!</p>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 page-enter">
          {/* Welcome Banner */}
          <div className="relative rounded-3xl p-7 mb-6 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #15803d, #22c55e)", boxShadow: "0 8px 32px rgba(21,128,61,0.25)" }}>
            <div className="absolute right-6 top-4 text-5xl opacity-20 select-none">🕌</div>
            <div className="relative z-10">
              <div className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">এডমিন কন্ট্রোল প্যানেল</div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1.5">আস-সালামু আলাইকুম! 👋</h2>
              <p className="text-white/70 text-sm">দাখিল ৮ম শ্রেণীর মাদরাসা পোর্টাল পরিচালনা করুন।</p>
            </div>
          </div>

          {/* Settings Card */}
          <div className="edu-card p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-edu-slate-800 font-bold flex items-center gap-2">
                <Users size={17} className="text-edu-green-600" /> সাইট তথ্য সেটিংস
              </h3>
              {!editingSettings ? (
                <button onClick={() => { setTempStudentCount(studentCount); setTempSession(session); setEditingSettings(true); }}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-all"
                  style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d" }}>
                  <Edit2 size={12} /> সম্পাদনা
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={saveSettings} disabled={savingSettings}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl btn-primary disabled:opacity-60">
                    {savingSettings ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={12} />}
                    সংরক্ষণ
                  </button>
                  <button onClick={() => setEditingSettings(false)}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl text-edu-slate-500 hover:bg-edu-slate-100 transition-all">
                    <X size={12} /> বাতিল
                  </button>
                </div>
              )}
            </div>
            {editingSettings ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">মোট শিক্ষার্থী</label>
                  <input type="text" value={tempStudentCount} onChange={(e) => setTempStudentCount(e.target.value)}
                    placeholder="যেমন: ১৫৬" className="edu-input text-sm" style={{ fontSize: "16px" }} />
                </div>
                <div>
                  <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">শিক্ষা সেশন</label>
                  <input type="text" value={tempSession} onChange={(e) => setTempSession(e.target.value)}
                    placeholder="যেমন: ২০২৫-২০২৬" className="edu-input text-sm" style={{ fontSize: "16px" }} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <div className="text-edu-slate-400 text-xs mb-1">মোট শিক্ষার্থী</div>
                  <div className="text-2xl font-bold text-edu-slate-800">{studentCount}</div>
                  <div className="text-edu-slate-400 text-xs mt-0.5">৮ম শ্রেণী</div>
                </div>
                <div className="p-4 rounded-2xl" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <div className="text-edu-slate-400 text-xs mb-1">শিক্ষা সেশন</div>
                  <div className="text-xl font-bold text-edu-slate-800">{session}</div>
                  <div className="text-edu-slate-400 text-xs mt-0.5">দাখিল</div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, i) => (
              <Link key={stat.label} to={stat.href}
                className="edu-card p-5 transition-all duration-200 hover:scale-[1.02] animate-slide-up"
                style={{ animationDelay: `${i * 70}ms` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: stat.bg }}>
                    <stat.icon size={20} style={{ color: stat.color }} />
                  </div>
                  {stat.sub && <span className="text-xs font-semibold px-2 py-1 rounded-full text-red-500 bg-red-50">{stat.sub}</span>}
                </div>
                <div className="text-3xl font-bold text-edu-slate-800 mb-1">{stat.value}</div>
                <div className="text-edu-slate-500 text-sm">{stat.label}</div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Homework */}
            <div className="edu-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-edu-slate-800 font-bold flex items-center gap-2">
                  <ClipboardList size={17} className="text-red-500" /> জরুরি হোমওয়ার্ক
                </h3>
                <Link to="/admin/homework" className="text-edu-green-600 text-xs hover:underline font-semibold">সব দেখুন</Link>
              </div>
              {data.urgentHomework.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">✅</div>
                  <div className="text-edu-slate-400 text-sm">কোনো জরুরি হোমওয়ার্ক নেই</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.urgentHomework.map((hw: any) => (
                    <div key={hw.id} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: "#fef2f2", border: "1px solid #fca5a5" }}>
                      <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
                      <div className="flex-1 min-w-0">
                        <div className="text-edu-slate-800 text-sm font-semibold truncate">{hw.title}</div>
                        <div className="text-edu-slate-400 text-xs">{hw.subject_name} • {hw.due_date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Chat */}
            <div className="edu-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-edu-slate-800 font-bold flex items-center gap-2">
                  <MessageCircle size={17} className="text-edu-green-600" /> সাম্প্রতিক চ্যাট
                </h3>
                <Link to="/admin/chat" className="text-edu-green-600 text-xs hover:underline font-semibold">মডারেট করুন</Link>
              </div>
              {data.recentMessages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">💬</div>
                  <div className="text-edu-slate-400 text-sm">কোনো মেসেজ নেই</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.recentMessages.map((msg: any) => (
                    <div key={msg.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>
                        {msg.sender_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-edu-slate-700 text-xs font-semibold">{msg.sender_name}</div>
                        <div className="text-edu-slate-400 text-xs truncate mt-0.5">{msg.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h3 className="text-edu-slate-800 font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={17} className="text-edu-green-600" /> দ্রুত অ্যাকশন
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { to: "/admin/subjects", label: "বিষয় যোগ করুন", emoji: "📚", color: "#15803d", bg: "#f0fdf4" },
                { to: "/admin/homework", label: "হোমওয়ার্ক দিন", emoji: "📝", color: "#1d4ed8", bg: "#dbeafe" },
                { to: "/admin/teachers", label: "শিক্ষক যোগ করুন", emoji: "👨‍🏫", color: "#7c3aed", bg: "#ede9fe" },
                { to: "/admin/notices", label: "নোটিশ দিন", emoji: "📢", color: "#c2410c", bg: "#ffedd5" },
              ].map((action) => (
                <Link key={action.to} to={action.to}
                  className="edu-card p-4 text-center transition-all duration-200 hover:scale-[1.02]"
                  style={{ background: action.bg, border: `1px solid ${action.color}20` }}>
                  <div className="text-2xl mb-2">{action.emoji}</div>
                  <div className="text-xs font-semibold" style={{ color: action.color }}>{action.label}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
