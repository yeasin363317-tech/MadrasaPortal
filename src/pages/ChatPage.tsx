// ============================================================
// ChatPage — UUID identity + Messenger-style reply system
// ============================================================

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Send, User, Hash, Users, MessageCircle, ArrowLeft, Reply, X, CornerUpLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ChatMessage } from "@/types";
import supabase from "@/lib/supabase";
import { useGuestUser } from "@/hooks/useGuestUser";
import { useNotifications } from "@/contexts/NotificationContext";

// ── helpers ──────────────────────────────────────────────────
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
  let replyData: { name: string; text: string } | null = null;
  if (row.reply_preview) {
    try { replyData = JSON.parse(row.reply_preview); } catch { replyData = null; }
  }
  return {
    id: row.id,
    senderName: row.sender_name,
    message: row.message,
    timestamp: row.created_at,
    isAdmin: row.is_admin,
    userUuid: row.user_uuid || "",
    replyToId: row.reply_to_id || null,
    replyPreview: replyData
      ? `${replyData.name}: ${replyData.text}`
      : (row.reply_preview || ""),
  };
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

// ── Component ─────────────────────────────────────────────────
export default function ChatPage() {
  const navigate = useNavigate();
  const { guestUser, createUser, updateName } = useGuestUser();
  const { markChatSeen } = useNotifications();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showNameModal, setShowNameModal] = useState(!guestUser);
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [tempName, setTempName] = useState("");
  const [onlineCount] = useState(Math.floor(Math.random() * 15) + 5);
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  // Touch/swipe tracking per message
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const swipeTriggered = useRef(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstLoad = useRef(true);
  const highlightRef = useRef<string | null>(null);

  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  // Mark chat as seen whenever page is open
  useEffect(() => {
    markChatSeen();
  }, [markChatSeen]);

  useEffect(() => {
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
      if (scrollHeight - scrollTop - clientHeight < 200) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }
  }, [messages]);

  const loadMessages = async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(150);
    if (data) setMessages(data.map(mapMessage));
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel("chat_rt_v2")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prev) => [...prev, mapMessage(payload.new)]);
          markChatSeen(); // clear badge while chat is open
        })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_messages" },
        (payload) => setMessages((prev) => prev.filter((m) => m.id !== payload.old.id)))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  };

  // ── Name handlers ─────────────────────────────────────────
  const handleSetName = () => {
    if (!tempName.trim()) return;
    createUser(tempName.trim());
    setShowNameModal(false);
    setTempName("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleChangeName = () => {
    if (!tempName.trim()) return;
    updateName(tempName.trim());
    setShowChangeNameModal(false);
    setTempName("");
  };

  // ── Send message ──────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !guestUser || sending) return;
    setSending(true);
    const msg = newMessage.trim();
    setNewMessage("");
    setReplyingTo(null);

    const payload: Record<string, any> = {
      sender_name: guestUser.name,
      message: msg,
      is_admin: false,
      user_uuid: guestUser.uuid,
    };

    if (replyingTo) {
      payload.reply_to_id = replyingTo.id;
      payload.reply_preview = JSON.stringify({
        name: replyingTo.senderName,
        text: replyingTo.message.slice(0, 120),
      });
    }

    await supabase.from("chat_messages").insert(payload);
    setSending(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [newMessage, guestUser, sending, replyingTo]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    if (e.key === "Escape") setReplyingTo(null);
  };

  // ── Scroll to replied message ─────────────────────────────
  const scrollToMessage = (id: string) => {
    highlightRef.current = id;
    const el = document.getElementById(`msg-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("msg-highlight");
      setTimeout(() => { el.classList.remove("msg-highlight"); highlightRef.current = null; }, 1500);
    }
  };

  // ── Swipe-to-reply (mobile) ────────────────────────────────
  const onTouchStart = (e: React.TouchEvent, msg: ChatMessage) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swipeTriggered.current = false;
  };

  const onTouchEnd = (e: React.TouchEvent, msg: ChatMessage) => {
    if (swipeTriggered.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    // Right swipe ≥ 55px, with minimal vertical drift
    if (dx >= 55 && dy < 40) {
      swipeTriggered.current = true;
      setReplyingTo(msg);
      inputRef.current?.focus();
    }
  };

  // ── Group messages by date ────────────────────────────────
  const grouped: { date: string; msgs: ChatMessage[] }[] = [];
  messages.forEach((msg) => {
    const date = formatDate(msg.timestamp);
    const last = grouped[grouped.length - 1];
    if (!last || last.date !== date) grouped.push({ date, msgs: [msg] });
    else last.msgs.push(msg);
  });

  const isOwn = (msg: ChatMessage) => {
    if (!guestUser) return false;
    if (msg.userUuid && guestUser.uuid) return msg.userUuid === guestUser.uuid;
    return msg.senderName === guestUser.name; // fallback for legacy messages
  };

  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "#f8fafc", overflow: "hidden" }}>

      {/* ── Name Setup Modal ── */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
          <div className="edu-card p-8 max-w-sm w-full text-center animate-scale-in">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl"
              style={{ background: "linear-gradient(135deg, #15803d, #22c55e)" }}>💬</div>
            <h2 className="text-2xl font-bold text-edu-slate-800 mb-2">চ্যাটে যোগ দিন</h2>
            <p className="text-edu-slate-500 text-sm mb-6">মেসেজ পাঠাতে আপনার নাম লিখুন</p>
            <input type="text" placeholder="আপনার নাম..." value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetName()}
              className="edu-input text-center mb-4 text-base" autoFocus maxLength={30}
              style={{ fontSize: "16px" }} />
            <button onClick={handleSetName} disabled={!tempName.trim()} className="btn-primary w-full">
              চ্যাটে প্রবেশ করুন
            </button>
          </div>
        </div>
      )}

      {/* ── Change Name Modal ── */}
      {showChangeNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
          <div className="edu-card p-7 max-w-sm w-full text-center animate-scale-in">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl"
              style={{ background: "linear-gradient(135deg, #15803d, #22c55e)" }}>✏️</div>
            <h2 className="text-xl font-bold text-edu-slate-800 mb-1">নাম পরিবর্তন</h2>
            <p className="text-edu-slate-500 text-xs mb-5">শুধু নাম পরিবর্তন হবে, পুরনো চ্যাট ইতিহাস একই থাকবে।</p>
            <input type="text" placeholder="নতুন নাম..." value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChangeName()}
              className="edu-input text-center mb-4" autoFocus maxLength={30}
              style={{ fontSize: "16px" }} />
            <div className="flex gap-3">
              <button onClick={() => { setShowChangeNameModal(false); setTempName(""); }}
                className="btn-outline flex-1 text-sm">বাতিল</button>
              <button onClick={handleChangeName} disabled={!tempName.trim()} className="btn-primary flex-1 text-sm">
                পরিবর্তন করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Chat Header ── */}
      <div className="flex-shrink-0 border-b border-edu-slate-200 px-4 py-3"
        style={{ background: "#ffffff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-edu-slate-100 transition-colors md:hidden"
              style={{ border: "1.5px solid #e2e8f0" }}>
              <ArrowLeft size={16} className="text-edu-slate-600" />
            </button>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: "linear-gradient(135deg, #15803d, #22c55e)" }}>💬</div>
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
            {guestUser && (
              <button
                onClick={() => { setTempName(guestUser.name); setShowChangeNameModal(true); }}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-edu-slate-500 hover:bg-edu-slate-100 transition-colors flex items-center gap-1.5"
                style={{ border: "1px solid #e2e8f0" }}
                title="নাম পরিবর্তন করুন">
                <User size={12} />
                <span className="max-w-[80px] truncate">{guestUser.name}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
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
              {/* Date separator */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-edu-slate-200" />
                <span className="text-xs text-edu-slate-400 px-3 py-1 rounded-full bg-edu-slate-100 border border-edu-slate-200">{date}</span>
                <div className="flex-1 h-px bg-edu-slate-200" />
              </div>

              {msgs.map((msg) => {
                const own = isOwn(msg);
                const color = getColor(msg.senderName);
                return (
                  <div
                    key={msg.id}
                    id={`msg-${msg.id}`}
                    className={`flex items-end gap-2 mb-3 transition-colors duration-300 rounded-xl ${own ? "flex-row-reverse" : "flex-row"}`}
                    onTouchStart={(e) => onTouchStart(e, msg)}
                    onTouchEnd={(e) => onTouchEnd(e, msg)}
                  >
                    {/* Avatar */}
                    {!own && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mb-1 text-white"
                        style={{ background: color }}>
                        {msg.isAdmin ? "👑" : getInitials(msg.senderName)}
                      </div>
                    )}

                    {/* Bubble + desktop reply button */}
                    <div className={`group flex items-end gap-1.5 max-w-[78%] ${own ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`flex flex-col gap-0.5 ${own ? "items-end" : "items-start"}`}>
                        {/* Sender name */}
                        {!own && (
                          <span className="text-xs font-semibold px-1" style={{ color }}>
                            {msg.isAdmin ? "👑 " : ""}{msg.senderName}
                          </span>
                        )}

                        {/* Bubble */}
                        <div
                          className="px-4 py-2.5 text-sm leading-relaxed break-words"
                          style={{
                            borderRadius: own ? "1.25rem 1.25rem 0.25rem 1.25rem" : "1.25rem 1.25rem 1.25rem 0.25rem",
                            background: own ? "linear-gradient(135deg, #15803d, #22c55e)" : "#ffffff",
                            color: own ? "#ffffff" : "#1e293b",
                            border: own ? "none" : "1px solid #e2e8f0",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            maxWidth: "18rem",
                          }}
                        >
                          {/* Reply quote */}
                          {msg.replyPreview && (
                            <button
                              onClick={() => msg.replyToId && scrollToMessage(msg.replyToId)}
                              className="flex items-start gap-1.5 mb-2 px-2 py-1.5 rounded-lg w-full text-left transition-opacity hover:opacity-80"
                              style={{
                                background: own ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.05)",
                                borderLeft: `3px solid ${own ? "rgba(255,255,255,0.6)" : "#15803d"}`,
                              }}
                            >
                              <CornerUpLeft size={10} className="flex-shrink-0 mt-0.5 opacity-70" />
                              <span className="text-xs opacity-80 line-clamp-2 leading-snug">
                                {msg.replyPreview}
                              </span>
                            </button>
                          )}
                          {msg.message}
                        </div>
                        <span className="text-[10px] text-edu-slate-400 px-1">{formatTime(msg.timestamp)}</span>
                      </div>

                      {/* Desktop reply button — shows on hover */}
                      <button
                        onClick={() => { setReplyingTo(msg); inputRef.current?.focus(); }}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-5 transition-all duration-200 hover:scale-110"
                        style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}
                        title="উত্তর দিন"
                      >
                        <Reply size={13} className="text-edu-slate-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{ height: 1 }} />
        </div>
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 border-t border-edu-slate-200 px-4 pb-4 pt-2"
        style={{ background: "#ffffff", boxShadow: "0 -2px 12px rgba(0,0,0,0.04)" }}>
        <div className="max-w-3xl mx-auto">

          {/* Reply preview bar */}
          {replyingTo && (
            <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl animate-slide-down"
              style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
              <CornerUpLeft size={14} className="text-edu-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-edu-green-700">{replyingTo.senderName}-এর উত্তর</div>
                <div className="text-xs text-edu-slate-500 truncate">{replyingTo.message}</div>
              </div>
              <button onClick={() => setReplyingTo(null)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-edu-green-100 transition-colors flex-shrink-0">
                <X size={12} className="text-edu-green-600" />
              </button>
            </div>
          )}

          {guestUser && !replyingTo && (
            <div className="flex items-center gap-1.5 mb-2 text-xs text-edu-slate-400">
              <MessageCircle size={11} className="text-edu-green-600" />
              <span>{guestUser.name} হিসেবে পাঠাচ্ছেন</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder={guestUser ? "মেসেজ লিখুন..." : "আগে নাম দিন..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="edu-input flex-1 text-sm"
              disabled={!guestUser || sending}
              maxLength={500}
              style={{ fontSize: "16px" }}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !guestUser || sending}
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
          <p className="text-edu-slate-400 text-xs mt-1.5 text-center">
            Enter চেপে পাঠান • ডান দিকে Swipe করে Reply করুন • সম্মানজনক ভাষায় কথা বলুন
          </p>
        </div>
      </div>
    </div>
  );
}
