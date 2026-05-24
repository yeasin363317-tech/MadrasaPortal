// ============================================================
// AdminDashboard - Supabase থেকে রিয়েল স্ট্যাটিস্টিক্স + Settings
// ============================================================

import { useState, useEffect } from "react";
import { BookOpen, ClipboardList, Lightbulb, MessageCircle, Users, TrendingUp, Menu, Bell, Plus, Save, Edit2, X } from "lucide-react";
import { Link } from "react-router-dom";
import AdminSidebar from "@/components/layout/AdminSidebar";
import IslamicPattern, { StarOrnament, IslamicBorder } from "@/components/layout/IslamicPattern";
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

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<DashboardData>({
    subjectsCount: 0, homeworkCount: 0, urgentHomeworkCount: 0,
    suggestionsCount: 0, teachersCount: 0, noticesCount: 0,
    messagesCount: 0, urgentHomework: [], recentMessages: [],
  });
  const [loading, setLoading] = useState(true);

  // Settings state
  const [studentCount, setStudentCount] = useState("156");
  const [session, setSession] = useState("২০২৫-২০২৬");
  const [editingSettings, setEditingSettings] = useState(false);
  const [tempStudentCount, setTempStudentCount] = useState("156");
  const [tempSession, setTempSession] = useState("২০২৫-২০২৬");
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    loadDashboard();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data: settingsData } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", ["student_count", "session"]);

    if (settingsData) {
      const sc = settingsData.find((s: any) => s.key === "student_count");
      const sess = settingsData.find((s: any) => s.key === "session");
      if (sc) setStudentCount(sc.value);
      if (sess) setSession(sess.value);
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

    console.log("Dashboard loaded");
    setLoading(false);
  };

  const openEditSettings = () => {
    setTempStudentCount(studentCount);
    setTempSession(session);
    setEditingSettings(true);
  };

  const saveSettings = async () => {
    if (!tempStudentCount.trim() || !tempSession.trim()) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }
    setSavingSettings(true);

    // Upsert both settings
    const { error } = await supabase.from("settings").upsert([
      { key: "student_count", value: tempStudentCount.trim(), updated_at: new Date().toISOString() },
      { key: "session", value: tempSession.trim(), updated_at: new Date().toISOString() },
    ]);

    if (error) {
      console.error("Settings save error:", error);
      toast.error("সংরক্ষণ হয়নি");
      setSavingSettings(false);
      return;
    }

    setStudentCount(tempStudentCount.trim());
    setSession(tempSession.trim());
    setSavingSettings(false);
    setEditingSettings(false);
    toast.success("তথ্য সংরক্ষিত হয়েছে ✓");
  };

  const stats = [
    { label: "মোট বিষয়", value: loading ? "..." : data.subjectsCount, icon: BookOpen, color: "#c9a227", href: "/admin/subjects", change: "সকল বিষয়" },
    { label: "হোমওয়ার্ক", value: loading ? "..." : data.homeworkCount, icon: ClipboardList, color: "#2d9d64", href: "/admin/homework", change: `${data.urgentHomeworkCount} জরুরি` },
    { label: "সাজেশন", value: loading ? "..." : data.suggestionsCount, icon: Lightbulb, color: "#c9a227", href: "/admin/suggestions", change: "পরীক্ষা" },
    { label: "চ্যাট মেসেজ", value: loading ? "..." : data.messagesCount, icon: MessageCircle, color: "#1a6b3c", href: "/admin/chat", change: "সাম্প্রতিক" },
    { label: "সক্রিয় শিক্ষক", value: loading ? "..." : data.teachersCount, icon: TrendingUp, color: "#2d9d64", href: "/admin/teachers", change: "শিক্ষক" },
    { label: "নোটিশ", value: loading ? "..." : data.noticesCount, icon: Bell, color: "#c9a227", href: "/admin/notices", change: "বিজ্ঞপ্তি" },
  ];

  return (
    <div className="min-h-screen islamic-bg">
      <IslamicPattern opacity={0.04} />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:ml-72 min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ background: "rgba(7,26,14,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 rounded-xl hover:bg-white/10 text-warm-white/70 transition-all">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-warm-white font-bold text-xl">ড্যাশবোর্ড</h1>
              <p className="text-warm-white/40 text-xs">স্বাগতম, এডমিন!</p>
            </div>
          </div>
          <div className="relative">
            <div className="p-2.5 rounded-xl text-warm-white/50 hover:text-warm-white transition-colors cursor-pointer"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <Bell size={18} />
            </div>
            {data.urgentHomeworkCount > 0 && (
              <div className="notif-dot" />
            )}
          </div>
        </div>

        <div className="p-4 md:p-8 page-enter">
          {/* Welcome Banner */}
          <div className="relative rounded-3xl p-8 mb-8 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0d4a2e 0%, #1a6b3c 50%, #0d4a2e 100%)" }}>
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: "radial-gradient(circle at 70% 50%, #c9a227 0%, transparent 60%)"
              }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <StarOrnament size={16} />
                <span className="text-islamic-gold-400 text-sm font-semibold uppercase tracking-wider">এডমিন কন্ট্রোল প্যানেল</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-warm-white mb-2">
                আস-সালামু আলাইকুম! 👋
              </h2>
              <p className="text-warm-white/70 text-sm max-w-md">
                দাখিল ৮ম শ্রেণীর মাদরাসা পোর্টালে আপনাকে স্বাগতম। Supabase থেকে রিয়েল ডেটা লোড হচ্ছে।
              </p>
            </div>
          </div>

          {/* ══ Site Settings Card ══ */}
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-warm-white font-bold flex items-center gap-2">
                <Users size={18} className="text-islamic-gold-400" /> সাইট তথ্য সেটিংস
              </h3>
              {!editingSettings ? (
                <button
                  onClick={openEditSettings}
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl transition-all"
                  style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)", color: "#c9a227" }}>
                  <Edit2 size={13} /> সম্পাদনা
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={saveSettings}
                    disabled={savingSettings}
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl transition-all disabled:opacity-60"
                    style={{ background: "rgba(201,162,39,0.2)", border: "1px solid rgba(201,162,39,0.35)", color: "#c9a227" }}>
                    {savingSettings
                      ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      : <Save size={13} />}
                    সংরক্ষণ
                  </button>
                  <button
                    onClick={() => setEditingSettings(false)}
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl text-warm-white/50 hover:text-warm-white transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <X size={13} /> বাতিল
                  </button>
                </div>
              )}
            </div>

            {editingSettings ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-warm-white/60 text-xs mb-1.5 font-medium">মোট শিক্ষার্থী সংখ্যা</label>
                  <input
                    type="text"
                    value={tempStudentCount}
                    onChange={(e) => setTempStudentCount(e.target.value)}
                    placeholder="যেমন: ১৫৬"
                    className="input-islamic text-sm w-full"
                  />
                </div>
                <div>
                  <label className="block text-warm-white/60 text-xs mb-1.5 font-medium">শিক্ষা সেশন</label>
                  <input
                    type="text"
                    value={tempSession}
                    onChange={(e) => setTempSession(e.target.value)}
                    placeholder="যেমন: ২০২৫-২০২৬"
                    className="input-islamic text-sm w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{ background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.12)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={14} className="text-islamic-gold-400" />
                    <span className="text-warm-white/50 text-xs">মোট শিক্ষার্থী</span>
                  </div>
                  <div className="text-2xl font-bold text-warm-white">{studentCount}</div>
                  <div className="text-warm-white/30 text-xs mt-0.5">৮ম শ্রেণী</div>
                </div>
                <div className="p-4 rounded-xl" style={{ background: "rgba(45,157,100,0.06)", border: "1px solid rgba(45,157,100,0.12)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen size={14} className="text-islamic-green-400" />
                    <span className="text-warm-white/50 text-xs">শিক্ষা সেশন</span>
                  </div>
                  <div className="text-xl font-bold text-warm-white">{session}</div>
                  <div className="text-warm-white/30 text-xs mt-0.5">দাখিল</div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, i) => (
              <Link key={stat.label} to={stat.href}
                className="glass-card p-5 hover:scale-105 transition-transform duration-200 animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: `${stat.color}22`, border: `1px solid ${stat.color}33` }}>
                    <stat.icon size={20} style={{ color: stat.color }} />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full text-warm-white/40"
                    style={{ background: "rgba(255,255,255,0.05)" }}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-warm-white mb-1">{stat.value}</div>
                <div className="text-warm-white/50 text-sm">{stat.label}</div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Homework */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-warm-white font-bold flex items-center gap-2">
                  <ClipboardList size={18} className="text-red-400" /> জরুরি হোমওয়ার্ক
                </h3>
                <Link to="/admin/homework" className="text-islamic-gold-400 text-xs hover:underline">সব দেখুন</Link>
              </div>
              {data.urgentHomework.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">✅</div>
                  <div className="text-warm-white/40 text-sm">কোনো জরুরি হোমওয়ার্ক নেই</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.urgentHomework.map((hw: any) => (
                    <div key={hw.id} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                      <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
                      <div className="flex-1 min-w-0">
                        <div className="text-warm-white text-sm font-semibold truncate">{hw.title}</div>
                        <div className="text-warm-white/40 text-xs">{hw.subject_name} • {hw.due_date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Messages */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-warm-white font-bold flex items-center gap-2">
                  <MessageCircle size={18} className="text-islamic-gold-400" /> সাম্প্রতিক চ্যাট
                </h3>
                <Link to="/admin/chat" className="text-islamic-gold-400 text-xs hover:underline">মডারেট করুন</Link>
              </div>
              {data.recentMessages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">💬</div>
                  <div className="text-warm-white/40 text-sm">কোনো মেসেজ নেই</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.recentMessages.map((msg: any) => (
                    <div key={msg.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "rgba(201,162,39,0.2)", color: "#c9a227" }}>
                        {msg.sender_name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-warm-white/70 text-xs font-semibold">{msg.sender_name}</div>
                        <div className="text-warm-white/50 text-xs truncate mt-0.5">{msg.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <IslamicBorder />
            <h3 className="text-warm-white font-bold text-center mb-5 flex items-center justify-center gap-2">
              <StarOrnament size={14} /> দ্রুত অ্যাকশন
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { to: "/admin/subjects", label: "বিষয় যোগ করুন", icon: Plus, color: "#c9a227" },
                { to: "/admin/homework", label: "হোমওয়ার্ক দিন", icon: ClipboardList, color: "#2d9d64" },
                { to: "/admin/teachers", label: "শিক্ষক যোগ করুন", icon: TrendingUp, color: "#c9a227" },
                { to: "/admin/notices", label: "নোটিশ দিন", icon: Bell, color: "#1a6b3c" },
              ].map((action) => (
                <Link key={action.to} to={action.to}
                  className="glass-card p-4 text-center hover:scale-105 transition-transform duration-200">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                    style={{ background: `${action.color}22` }}>
                    <action.icon size={18} style={{ color: action.color }} />
                  </div>
                  <div className="text-warm-white/70 text-xs font-semibold">{action.label}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
