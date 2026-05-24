// ============================================================
// AdminChatPage - Admin Live Chat with Real-time Supabase
// ============================================================

import { useState, useEffect, useRef } from "react";
import { Trash2, Menu, MessageCircle, Send, Shield, Search, FilterX } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import type { ChatMessage } from "@/types";
import IslamicPattern from "@/components/layout/IslamicPattern";
import { toast } from "sonner";
import supabase from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("bn-BD", { dateStyle: "short", timeStyle: "short" });
}

function mapMessage(row: any): ChatMessage {
  return {
    id: row.id,
    senderName: row.sender_name,
    message: row.message,
    timestamp: row.created_at,
    isAdmin: row.is_admin,
  };
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
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) { console.error("Load chat error:", error); }
    if (data) setMessages(data.map(mapMessage));
    setLoading(false);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel("admin_chat_realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prev) => [mapMessage(payload.new), ...prev]);
        })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("chat_messages").delete().eq("id", id);
    if (error) { console.error("Delete message error:", error); toast.error("মুছে ফেলা যায়নি"); return; }
    toast.success("মেসেজ মুছে ফেলা হয়েছে");
  };

  const handleClearAll = async () => {
    if (!window.confirm("সব মেসেজ মুছবেন? এটি পূর্বাবস্থায় ফেরানো যাবে না।")) return;
    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) { console.error("Clear all error:", error); toast.error("মুছে ফেলা যায়নি"); return; }
    toast.success("সব মেসেজ মুছে ফেলা হয়েছে");
    setMessages([]);
  };

  const sendAdminMessage = async () => {
    if (!adminMsg.trim() || sending) return;
    setSending(true);
    // Use admin's email username or fallback label
    const senderName = user?.email
      ? `শিক্ষক (${user.email.split("@")[0]})`
      : "শিক্ষক (Admin)";

    const { error } = await supabase.from("chat_messages").insert({
      sender_name: senderName,
      message: adminMsg.trim(),
      is_admin: true,
    });

    if (error) {
      console.error("Admin send error:", error);
      toast.error("পাঠানো যায়নি");
      setSending(false);
      return;
    }
    setAdminMsg("");
    setSending(false);
    toast.success("বার্তা পাঠানো হয়েছে ✓");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendAdminMessage();
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchSearch =
      m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "admin" && m.isAdmin) ||
      (filter === "students" && !m.isAdmin);
    return matchSearch && matchFilter;
  });

  const stats = {
    total: messages.length,
    admin: messages.filter((m) => m.isAdmin).length,
    students: messages.filter((m) => !m.isAdmin).length,
  };

  return (
    <div className="min-h-screen islamic-bg">
      <IslamicPattern opacity={0.04} />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:ml-72 min-h-screen flex flex-col">
        {/* ── Header ── */}
        <div
          className="sticky top-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{
            background: "rgba(7,26,14,0.95)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2.5 rounded-xl hover:bg-white/10 text-warm-white/70"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-warm-white font-bold text-xl">চ্যাট মডারেশন</h1>
              <p className="text-warm-white/40 text-xs">
                {stats.total}টি মেসেজ • Supabase Realtime
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 text-sm hover:bg-red-400/10 transition-all"
              style={{ border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <FilterX size={16} /> সব মুছুন
            </button>
          )}
        </div>

        <div className="p-4 md:p-8 flex-1 flex flex-col page-enter">
          {/* ── Stats ── */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "মোট মেসেজ", value: stats.total, color: "#c9a227" },
              { label: "শিক্ষক", value: stats.admin, color: "#2d9d64" },
              { label: "ছাত্র-ছাত্রী", value: stats.students, color: "#1a6b3c" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-warm-white/40 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* ── Admin Message Sender ── */}
          <div className="glass-card p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-islamic-gold-400" />
              <span className="text-warm-white/70 text-sm font-semibold">
                শিক্ষক হিসেবে বার্তা পাঠান
              </span>
              {user?.email && (
                <span
                  className="ml-auto text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(201,162,39,0.1)",
                    border: "1px solid rgba(201,162,39,0.2)",
                    color: "#c9a227",
                  }}
                >
                  👑 {user.email.split("@")[0]}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <input
                ref={inputRef}
                value={adminMsg}
                onChange={(e) => setAdminMsg(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ছাত্রদের উদ্দেশ্যে বার্তা লিখুন..."
                className="input-islamic text-sm flex-1"
                style={{ fontSize: "16px" }}
                maxLength={1000}
              />
              <button
                onClick={sendAdminMessage}
                disabled={!adminMsg.trim() || sending}
                className="btn-gold flex items-center gap-2 text-sm px-5 disabled:opacity-40 flex-shrink-0"
              >
                {sending
                  ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  : <Send size={15} />}
                {sending ? "..." : "পাঠান"}
              </button>
            </div>
            <p className="text-warm-white/25 text-xs mt-2">
              এই বার্তা সকল ছাত্র-ছাত্রীরা তাৎক্ষণিক দেখতে পাবে • Enter চেপে পাঠান
            </p>
          </div>

          {/* ── Filters ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-white/30" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নাম বা মেসেজ খুঁজুন..."
                className="input-islamic pl-10 text-sm"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "admin", "students"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    filter === f ? "btn-gold" : "text-warm-white/50 hover:text-warm-white"
                  }`}
                  style={
                    filter !== f
                      ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }
                      : {}
                  }
                >
                  {f === "all" ? "সব" : f === "admin" ? "শিক্ষক" : "ছাত্র"}
                </button>
              ))}
            </div>
          </div>

          {/* ── Messages List ── */}
          <div className="flex-1 space-y-2 overflow-y-auto" style={{ maxHeight: "55vh" }}>
            {loading ? (
              <div className="glass-card p-16 text-center">
                <div className="w-10 h-10 border-4 border-islamic-gold-400/30 border-t-islamic-gold-400 rounded-full animate-spin mx-auto mb-3" />
                <div className="text-warm-white/30 text-sm">লোড হচ্ছে...</div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="glass-card p-16 text-center">
                <MessageCircle size={48} className="text-warm-white/10 mx-auto mb-3" />
                <div className="text-warm-white/30">কোনো মেসেজ নেই</div>
              </div>
            ) : (
              filteredMessages.map((msg, i) => (
                <div
                  key={msg.id}
                  className="glass-card px-4 py-3 flex items-start gap-3 animate-slide-up"
                  style={{
                    animationDelay: `${i * 15}ms`,
                    ...(msg.isAdmin
                      ? { border: "1px solid rgba(201,162,39,0.15)", background: "rgba(201,162,39,0.03)" }
                      : {}),
                  }}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      msg.isAdmin
                        ? "bg-islamic-gold-400/20 text-islamic-gold-400"
                        : "bg-islamic-green-500/20 text-islamic-green-300"
                    }`}
                  >
                    {msg.isAdmin ? "👑" : msg.senderName.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span
                        className={`text-xs font-bold ${
                          msg.isAdmin ? "text-islamic-gold-400" : "text-warm-white/80"
                        }`}
                      >
                        {msg.senderName}
                      </span>
                      {msg.isAdmin && (
                        <span className="text-xs text-islamic-gold-400/60 px-1.5 py-0.5 rounded bg-islamic-gold-400/10">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-warm-white/70 text-sm break-words leading-relaxed">
                      {msg.message}
                    </p>
                    <span className="text-warm-white/25 text-xs">{formatTime(msg.timestamp)}</span>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
                    title="মুছুন"
                  >
                    <Trash2 size={14} />
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
