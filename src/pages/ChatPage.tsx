// ============================================================
// ChatPage — Modern light chat UI
// ============================================================

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Send, User, Hash, Users, MessageCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ChatMessage } from "@/types";
import supabase from "@/lib/supabase";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });
}
function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "আজ";
  const y = new Date(today);
  y.setDate(y.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "গতকাল";
  return d.toLocaleDateString("bn-BD");
}
function mapMessage(row: any): ChatMessage {
  return { id: row.id, senderName: row.sender_name, message: row.message, timestamp: row.created_at, isAdmin: row.is_admin };
}

const AVATAR_COLORS = ["#15803d","#1d4ed8","#7c3aed","#c2410c","#0f766e","#be185d"];
function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderName, setSenderName] = useState(() => localStorage.getItem("madrasa_chat_name") || "");
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState("");
  const [onlineCount] = useState(Math.floor(Math.random() * 15) + 5);
  const [sending, setSending] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstLoad = useRef(true);

  // Lock body scroll while chat is mounted so the fixed container always fills the viewport
  useLayoutEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    if (!senderName) setShowNameModal(true);
    loadMessages();
    const unsub = subscribeToMessages();
    return () => { unsub(); };
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const container = chatRef.current;
    if (!container) return;
    if (isFirstLoad.current) {
      container.scrollTop = container.scrollHeight;
      isFirstLoad.current = false;
    } else {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 180) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }
  }, [messages]);

  const loadMessages = async () => {
    const { data } = await supabase.from("chat_messages").select("*").order("created_at", { ascending: true }).limit(100);
    if (data) setMessages(data.map(mapMessage));
  };

  const subscribeToMessages = () => {
    const channel = supabase.channel("chat_rt")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => setMessages((prev) => [...prev, mapMessage(payload.new)]))
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_messages" },
        (payload) => setMessages((prev) => prev.filter((m) => m.id !== payload.old.id)))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  };

  const handleSetName = () => {
    if (!tempName.trim()) return;
    const name = tempName.trim();
    setSenderName(name);
    localStorage.setItem("madrasa_chat_name", name);
    setShowNameModal(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !senderName || sending) return;
    setSending(true);
    const msg = newMessage.trim();
    setNewMessage("");
    const { error } = await supabase.from("chat_messages").insert({ sender_name: senderName, message: msg, is_admin: false });
    if (error) setNewMessage(msg);
    setSending(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [newMessage, senderName, sending]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const grouped: { date: string; msgs: ChatMessage[] }[] = [];
  messages.forEach((msg) => {
    const date = formatDate(msg.timestamp);
    const last = grouped[grouped.length - 1];
    if (!last || last.date !== date) grouped.push({ date, msgs: [msg] });
    else last.msgs.push(msg);
  });

  return (
    <div className="flex flex-col" style={{ position: "fixed", inset: 0, background: "#f8fafc", overflow: "hidden", zIndex: 10 }}>

      {/* Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
          <div className="edu-card p-8 max-w-sm w-full text-center animate-scale-in">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl"
              style={{ background: "linear-gradient(135deg, #15803d, #22c55e)" }}>
              💬
            </div>
            <h2 className="text-2xl font-bold text-edu-slate-800 mb-2">চ্যাটে যোগ দিন</h2>
            <p className="text-edu-slate-500 text-sm mb-6">মেসেজ পাঠাতে আপনার নাম লিখুন</p>
            <input
              type="text"
              placeholder="আপনার নাম..."
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetName()}
              className="edu-input text-center mb-4 text-base"
              autoFocus
              maxLength={30}
              style={{ fontSize: "16px" }}
            />
            <button onClick={handleSetName} disabled={!tempName.trim()} className="btn-primary w-full">
              চ্যাটে প্রবেশ করুন
            </button>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="flex-shrink-0 border-b border-edu-slate-200 px-4 py-3"
        style={{ background: "#ffffff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", paddingTop: "calc(env(safe-area-inset-top, 0px) + 64px)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-edu-slate-100 transition-colors md:hidden"
              style={{ border: "1.5px solid #e2e8f0" }}>
              <ArrowLeft size={16} className="text-edu-slate-600" />
            </button>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: "linear-gradient(135deg, #15803d, #22c55e)" }}>
              💬
            </div>
            <div>
              <div className="text-edu-slate-800 font-bold text-sm">ক্লাস চ্যাট</div>
              <div className="flex items-center gap-1.5 text-xs text-edu-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-edu-green-500 animate-pulse" />
                {onlineCount} জন অনলাইনে
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold badge-green">
              <Users size={11} /> দাখিল ৮ম
            </div>
            {senderName && (
              <button onClick={() => { setSenderName(""); localStorage.removeItem("madrasa_chat_name"); setShowNameModal(true); setTempName(""); }}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-edu-slate-500 hover:bg-edu-slate-100 transition-colors"
                style={{ border: "1px solid #e2e8f0" }}>
                <User size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="max-w-3xl mx-auto space-y-1">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-edu-slate-500"
              style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
              <Hash size={11} /> দাখিল ৮ম শ্রেণীর গ্রুপ চ্যাট
            </div>
          </div>

          {grouped.map(({ date, msgs }) => (
            <div key={date}>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-edu-slate-200" />
                <span className="text-xs text-edu-slate-400 px-3 py-1 rounded-full bg-edu-slate-100 border border-edu-slate-200">
                  {date}
                </span>
                <div className="flex-1 h-px bg-edu-slate-200" />
              </div>

              {msgs.map((msg) => {
                const isOwn = msg.senderName === senderName;
                const color = getColor(msg.senderName);
                return (
                  <div key={msg.id} className={`flex items-end gap-2 mb-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                    {!isOwn && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mb-1 text-white"
                        style={{ background: color }}>
                        {msg.isAdmin ? "👑" : getInitials(msg.senderName)}
                      </div>
                    )}
                    <div className={`max-w-[75%] flex flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"}`}>
                      {!isOwn && (
                        <span className="text-xs font-semibold px-1" style={{ color }}>
                          {msg.isAdmin ? "👑 " : ""}{msg.senderName}
                        </span>
                      )}
                      <div
                        className="px-4 py-2.5 text-sm leading-relaxed break-words"
                        style={{
                          borderRadius: isOwn ? "1.25rem 1.25rem 0.25rem 1.25rem" : "1.25rem 1.25rem 1.25rem 0.25rem",
                          background: isOwn
                            ? "linear-gradient(135deg, #15803d, #22c55e)"
                            : "#ffffff",
                          color: isOwn ? "#ffffff" : "#1e293b",
                          border: isOwn ? "none" : "1px solid #e2e8f0",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          maxWidth: "18rem",
                        }}
                      >
                        {msg.message}
                      </div>
                      <span className="text-[10px] text-edu-slate-400 px-1">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{ height: 1 }} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-edu-slate-200 px-4 py-3"
        style={{ background: "#ffffff", boxShadow: "0 -2px 12px rgba(0,0,0,0.04)" }}>
        <div className="max-w-3xl mx-auto">
          {senderName && (
            <div className="flex items-center gap-1.5 mb-2 text-xs text-edu-slate-400">
              <User size={11} className="text-edu-green-600" />
              <span>{senderName} হিসেবে পাঠাচ্ছেন</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder={senderName ? "মেসেজ লিখুন..." : "আগে নাম দিন..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="edu-input flex-1 text-sm"
              disabled={!senderName || sending}
              maxLength={500}
              style={{ fontSize: "16px" }}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !senderName || sending}
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-40"
              style={{
                background: newMessage.trim() ? "linear-gradient(135deg, #15803d, #22c55e)" : "#f1f5f9",
                boxShadow: newMessage.trim() ? "0 4px 12px rgba(21,128,61,0.3)" : "none",
              }}
            >
              {sending
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Send size={16} className={newMessage.trim() ? "text-white" : "text-edu-slate-400"} />}
            </button>
          </div>
          <p className="text-edu-slate-400 text-xs mt-1.5 text-center">Enter চেপে পাঠান • সম্মানজনক ভাষায় কথা বলুন</p>
        </div>
      </div>
    </div>
  );
}
