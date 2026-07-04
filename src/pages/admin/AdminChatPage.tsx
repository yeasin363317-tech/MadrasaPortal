// ============================================================
// AdminChatPage — Premium Light Theme
// ============================================================

import { useState, useEffect, useRef } from "react";
import { Trash2, Menu, MessageCircle, Send, Shield, Search, FilterX } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import type { ChatMessage } from "@/types";
import { toast } from "sonner";
import supabase from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("bn-BD", { dateStyle: "short", timeStyle: "short" });
}
function mapMessage(row: any): ChatMessage {
  return { id: row.id, senderName: row.sender_name, message: row.message, timestamp: row.created_at, isAdmin: row.is_admin };
}

export default function AdminChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminMsg, setAdminMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "admin" | "students">("all");
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMessages();
    const unsubscribe = subscribeToMessages();
    return () => { unsubscribe(); };
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const { data } = await supabase.from("chat_messages").select("*").order("created_at", { ascending: false }).limit(200);
    if (data) setMessages(data.map(mapMessage));
    setLoading(false);
  };

  const subscribeToMessages = () => {
    const channel = supabase.channel("admin_chat_realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => setMessages((prev) => [mapMessage(payload.new), ...prev]))
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_messages" },
        (payload) => setMessages((prev) => prev.filter((m) => m.id !== payload.old.id)))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("chat_messages").delete().eq("id", id);
    if (error) { toast.error("মুছে ফেলা যায়নি"); return; }
    toast.success("মেসেজ মুছে ফেলা হয়েছে");
  };

  const handleClearAll = async () => {
    if (!window.confirm("সব মেসেজ মুছবেন?")) return;
    const { error } = await supabase.from("chat_messages").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) { toast.error("মুছে ফেলা যায়নি"); return; }
    toast.success("সব মেসেজ মুছে ফেলা হয়েছে");
    setMessages([]);
  };

  const sendAdminMessage = async () => {
    if (!adminMsg.trim() || sending) return;
    setSending(true);
    const senderName = user?.email ? `শিক্ষক (${user.email.split("@")[0]})` : "শিক্ষক (Admin)";
    const { error } = await supabase.from("chat_messages").insert({ sender_name: senderName, message: adminMsg.trim(), is_admin: true });
    if (error) { toast.error("পাঠানো যায়নি"); setSending(false); return; }
    setAdminMsg(""); setSending(false);
    toast.success("বার্তা পাঠানো হয়েছে ✓");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAdminMessage(); }
  };

  const filteredMessages = messages.filter((m) => {
    const matchSearch = m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) || m.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filter === "all" || (filter === "admin" && m.isAdmin) || (filter === "students" && !m.isAdmin);
    return matchSearch && matchFilter;
  });

  const stats = { total: messages.length, admin: messages.filter((m) => m.isAdmin).length, students: messages.filter((m) => !m.isAdmin).length };

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-72 min-h-screen flex flex-col">
        <div className="sticky top-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-edu-slate-100 transition-colors">
              <Menu size={20} className="text-edu-slate-600" />
            </button>
            <div>
              <h1 className="text-edu-slate-800 font-bold text-xl">চ্যাট মডারেশন</h1>
              <p className="text-edu-slate-400 text-xs">{stats.total}টি মেসেজ</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={handleClearAll} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-500 text-sm hover:bg-red-50 transition-all" style={{ border: "1px solid #fca5a5" }}>
              <FilterX size={15} /> সব মুছুন
            </button>
          )}
        </div>

        <div className="p-4 md:p-8 flex-1 flex flex-col page-enter">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: "মোট মেসেজ", value: stats.total, color: "#15803d", bg: "#f0fdf4" },
              { label: "শিক্ষক", value: stats.admin, color: "#7c3aed", bg: "#ede9fe" },
              { label: "ছাত্র-ছাত্রী", value: stats.students, color: "#1d4ed8", bg: "#dbeafe" },
            ].map((stat) => (
              <div key={stat.label} className="edu-card p-4 text-center" style={{ background: stat.bg, border: `1px solid ${stat.color}22` }}>
                <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-edu-slate-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Admin Sender */}
          <div className="edu-card p-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={15} className="text-edu-green-600" />
              <span className="text-edu-slate-700 text-sm font-semibold">শিক্ষক হিসেবে বার্তা পাঠান</span>
              {user?.email && (
                <span className="ml-auto text-xs px-2.5 py-1 rounded-full badge-green">👑 {user.email.split("@")[0]}</span>
              )}
            </div>
            <div className="flex gap-3">
              <input ref={inputRef} value={adminMsg} onChange={(e) => setAdminMsg(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="ছাত্রদের উদ্দেশ্যে বার্তা লিখুন..." className="edu-input text-sm flex-1"
                style={{ fontSize: "16px" }} maxLength={1000} />
              <button onClick={sendAdminMessage} disabled={!adminMsg.trim() || sending}
                className="btn-primary flex items-center gap-2 text-sm px-5 disabled:opacity-40 flex-shrink-0">
                {sending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={14} />}
                {sending ? "..." : "পাঠান"}
              </button>
            </div>
            <p className="text-edu-slate-400 text-xs mt-2">Enter চেপে পাঠান • এই বার্তা সকল শিক্ষার্থীরা তাৎক্ষণিক দেখবে</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-edu-slate-400" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নাম বা মেসেজ খুঁজুন..." className="edu-input pl-10 text-sm" />
            </div>
            <div className="flex gap-2">
              {(["all", "admin", "students"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={filter === f
                    ? { background: "#15803d", color: "#ffffff" }
                    : { background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>
                  {f === "all" ? "সব" : f === "admin" ? "শিক্ষক" : "ছাত্র"}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-2 overflow-y-auto" style={{ maxHeight: "55vh" }}>
            {loading ? (
              <div className="edu-card p-16 text-center">
                <div className="w-10 h-10 border-4 border-edu-green-200 border-t-edu-green-600 rounded-full animate-spin mx-auto mb-3" />
                <div className="text-edu-slate-400 text-sm">লোড হচ্ছে...</div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="edu-card p-16 text-center">
                <MessageCircle size={48} className="text-edu-slate-200 mx-auto mb-3" />
                <div className="text-edu-slate-400">কোনো মেসেজ নেই</div>
              </div>
            ) : (
              filteredMessages.map((msg, i) => (
                <div key={msg.id} className="edu-card px-4 py-3 flex items-start gap-3 animate-slide-up"
                  style={{ animationDelay: `${i * 10}ms`, ...(msg.isAdmin ? { background: "#f0fdf4", border: "1px solid #bbf7d0" } : {}) }}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${msg.isAdmin ? "bg-edu-green-100 text-edu-green-700" : "bg-edu-slate-100 text-edu-slate-600"}`}>
                    {msg.isAdmin ? "👑" : msg.senderName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className={`text-xs font-bold ${msg.isAdmin ? "text-edu-green-700" : "text-edu-slate-700"}`}>{msg.senderName}</span>
                      {msg.isAdmin && <span className="text-xs px-1.5 py-0.5 rounded text-edu-green-700 bg-edu-green-100">Admin</span>}
                    </div>
                    <p className="text-edu-slate-600 text-sm break-words leading-relaxed">{msg.message}</p>
                    <span className="text-edu-slate-300 text-xs">{formatTime(msg.timestamp)}</span>
                  </div>
                  <button onClick={() => handleDelete(msg.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 transition-all flex-shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
