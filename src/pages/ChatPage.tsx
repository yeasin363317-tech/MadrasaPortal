// ============================================================
// ChatPage - Supabase Realtime Live Chat (Fixed Scroll)
// ============================================================

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Send, User, Hash, Users, MessageCircle } from "lucide-react";
import IslamicPattern, { StarOrnament } from "@/components/layout/IslamicPattern";
import type { ChatMessage } from "@/types";
import supabase from "@/lib/supabase";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "আজ";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "গতকাল";
  return d.toLocaleDateString("bn-BD");
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

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderName, setSenderName] = useState(() =>
    localStorage.getItem("madrasa_chat_name") || ""
  );
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState("");
  const [onlineCount] = useState(Math.floor(Math.random() * 15) + 5);
  const [sending, setSending] = useState(false);

  // Scroll management — only the chat container scrolls, not the page
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstLoad = useRef(true);

  // Prevent page-level scroll jump on mount
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (!senderName) setShowNameModal(true);
    loadMessages();
    const unsubscribe = subscribeToMessages();
    return () => { unsubscribe(); };
  }, []);

  // Scroll chat container (NOT the page) after messages change
  useEffect(() => {
    if (messages.length === 0) return;
    const container = chatContainerRef.current;
    if (!container) return;

    if (isFirstLoad.current) {
      // First load: jump to bottom instantly inside the container
      container.scrollTop = container.scrollHeight;
      isFirstLoad.current = false;
    } else {
      // New message: smooth scroll only if user is already near the bottom
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      if (distanceFromBottom < 180) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }
  }, [messages]);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) {
      console.error("Chat load error:", error);
      return;
    }
    if (data) {
      setMessages(data.map(mapMessage));
      console.log("Chat messages loaded:", data.length);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel("chat_messages_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          console.log("New message received:", payload.new.id);
          setMessages((prev) => [...prev, mapMessage(payload.new)]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
        }
      )
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

    const { error } = await supabase.from("chat_messages").insert({
      sender_name: senderName,
      message: msg,
      is_admin: false,
    });

    if (error) {
      console.error("Send message error:", error);
      setNewMessage(msg); // restore on error
    }
    setSending(false);
    // Refocus input on mobile after send
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [newMessage, senderName, sending]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; msgs: ChatMessage[] }[] = [];
  messages.forEach((msg) => {
    const date = formatDate(msg.timestamp);
    const last = groupedMessages[groupedMessages.length - 1];
    if (!last || last.date !== date) {
      groupedMessages.push({ date, msgs: [msg] });
    } else {
      last.msgs.push(msg);
    }
  });

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const getColor = (name: string) => {
    const colors = ["#c9a227", "#2d9d64", "#1a6b3c", "#8a6c12", "#2d9d64", "#c9a227"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    // Key fix: use fixed viewport height so the page itself doesn't scroll
    <div
      className="islamic-bg flex flex-col"
      style={{
        height: "100dvh",
        paddingTop: "5rem", // navbar height
        overflow: "hidden", // prevent page-level scroll
      }}
    >
      <IslamicPattern opacity={0.04} />

      {/* ── Name Modal ── */}
      {showNameModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
        >
          <div className="glass-card p-8 max-w-sm w-full animate-slide-up text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "linear-gradient(135deg, #c9a227, #ecc138)" }}
            >
              <User size={28} className="text-madrasa-dark" />
            </div>
            <h2 className="text-2xl font-bold text-warm-white mb-2">চ্যাটে যোগ দিন</h2>
            <p className="text-warm-white/50 text-sm mb-6">মেসেজ পাঠাতে আপনার নাম লিখুন</p>
            <input
              type="text"
              placeholder="আপনার নাম..."
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetName()}
              className="input-islamic text-center mb-4 text-lg"
              autoFocus
              maxLength={30}
            />
            <button
              onClick={handleSetName}
              className="btn-gold w-full"
              disabled={!tempName.trim()}
            >
              চ্যাটে প্রবেশ করুন
            </button>
          </div>
        </div>
      )}

      {/* ── Chat Header ── */}
      <div
        className="relative z-10 flex-shrink-0 border-b border-white/10 px-4 py-3"
        style={{ background: "rgba(7,26,14,0.95)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #c9a227, #ecc138)" }}
            >
              <MessageCircle size={18} className="text-madrasa-dark" />
            </div>
            <div>
              <div className="text-warm-white font-bold text-sm">ক্লাস চ্যাট</div>
              <div className="flex items-center gap-1.5 text-xs text-warm-white/50">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span>{onlineCount} জন অনলাইনে</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-islamic-gold-400"
              style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}
            >
              <Users size={12} />
              <span>দাখিল ৮ম</span>
            </div>
            {senderName && (
              <button
                onClick={() => {
                  setSenderName("");
                  localStorage.removeItem("madrasa_chat_name");
                  setShowNameModal(true);
                  setTempName("");
                }}
                className="p-2 rounded-xl text-warm-white/40 hover:text-warm-white transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                title="নাম পরিবর্তন"
              >
                <User size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Messages Area — only THIS div scrolls ── */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="max-w-3xl mx-auto space-y-1">
          {/* Channel badge */}
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-warm-white/50"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Hash size={11} />
              <span>দাখিল ৮ম শ্রেণীর ক্লাস গ্রুপ • Realtime</span>
            </div>
          </div>

          {/* Grouped messages */}
          {groupedMessages.map(({ date, msgs }) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                <span
                  className="text-xs text-warm-white/30 px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {date}
                </span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>

              {msgs.map((msg, i) => {
                const isOwn = msg.senderName === senderName;
                const color = getColor(msg.senderName);
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 mb-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar (other's messages only) */}
                    {!isOwn && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mb-1"
                        style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}
                      >
                        {msg.isAdmin ? "👑" : getInitials(msg.senderName)}
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] flex flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"}`}
                    >
                      {/* Sender name */}
                      {!isOwn && (
                        <span className="text-xs font-semibold px-1" style={{ color }}>
                          {msg.isAdmin ? "👑 " : ""}{msg.senderName}
                        </span>
                      )}
                      {/* Bubble */}
                      <div className={isOwn ? "chat-bubble-own" : "chat-bubble-other"}>
                        <p className="text-warm-white text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                      </div>
                      {/* Timestamp */}
                      <span className="text-[10px] text-warm-white/30 px-1">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Invisible scroll anchor */}
          <div ref={bottomRef} style={{ height: 1 }} />
        </div>
      </div>

      {/* ── Message Input ── */}
      <div
        className="relative z-10 flex-shrink-0 border-t border-white/10 px-4 py-3"
        style={{ background: "rgba(7,26,14,0.95)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-3xl mx-auto">
          {senderName && (
            <div className="flex items-center gap-1.5 mb-2">
              <User size={11} className="text-islamic-gold-400" />
              <span className="text-xs text-warm-white/40">{senderName} হিসেবে পাঠাচ্ছেন</span>
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
              className="input-islamic text-sm flex-1"
              disabled={!senderName || sending}
              maxLength={500}
              // Prevent mobile viewport jump from keyboard
              style={{ fontSize: "16px" }}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !senderName || sending}
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #c9a227, #ecc138)",
                boxShadow: newMessage.trim() ? "0 4px 12px rgba(201,162,39,0.35)" : "none",
              }}
            >
              {sending
                ? <div className="w-4 h-4 border-2 border-madrasa-dark border-t-transparent rounded-full animate-spin" />
                : <Send size={16} className="text-madrasa-dark" />}
            </button>
          </div>
          <p className="text-warm-white/20 text-xs mt-1.5 text-center">
            Enter চেপে পাঠান • সম্মানজনক ভাষায় কথা বলুন
          </p>
        </div>
      </div>
    </div>
  );
}
