// ============================================================
// AdminNoticesPage - Full CRUD with Modal Form (Notices)
// ============================================================

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Menu, Bell, Pin } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import IslamicPattern from "@/components/layout/IslamicPattern";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

interface Notice {
  id: string;
  title: string;
  content: string;
  type: string;
  is_pinned: boolean;
  created_at: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  info:    { label: "তথ্য",    color: "#2d9d64" },
  urgent:  { label: "জরুরি",  color: "#ef4444" },
  warning: { label: "সতর্কতা", color: "#f59e0b" },
  success: { label: "সফলতা",  color: "#10b981" },
};

export default function AdminNoticesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // Form fields (independent state — no shared render fn issue)
  const [fTitle, setFTitle] = useState("");
  const [fContent, setFContent] = useState("");
  const [fType, setFType] = useState("info");
  const [fPinned, setFPinned] = useState(false);

  useEffect(() => { loadNotices(); }, []);

  const loadNotices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) console.error("Load notices error:", error);
    if (data) setNotices(data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditingNotice(null);
    setFTitle("");
    setFContent("");
    setFType("info");
    setFPinned(false);
    setModalOpen(true);
  };

  const openEdit = (n: Notice) => {
    setEditingNotice(n);
    setFTitle(n.title);
    setFContent(n.content);
    setFType(n.type);
    setFPinned(n.is_pinned);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingNotice(null);
  };

  const handleSave = async () => {
    if (!fTitle.trim() || !fContent.trim()) {
      toast.error("শিরোনাম ও বিষয়বস্তু আবশ্যক");
      return;
    }
    setSaving(true);
    const payload = { title: fTitle.trim(), content: fContent.trim(), type: fType, is_pinned: fPinned };

    if (editingNotice) {
      const { error } = await supabase.from("notices").update(payload).eq("id", editingNotice.id);
      if (error) { console.error("Update notice error:", error); toast.error("আপডেট হয়নি"); setSaving(false); return; }
      toast.success("নোটিশ আপডেট হয়েছে ✓");
    } else {
      const { error } = await supabase.from("notices").insert(payload);
      if (error) { console.error("Add notice error:", error); toast.error("যোগ করা যায়নি"); setSaving(false); return; }
      toast.success("নোটিশ যোগ করা হয়েছে ✓");
    }

    setSaving(false);
    closeModal();
    loadNotices();
  };

  const handleDelete = async (id: string, ntitle: string) => {
    if (!window.confirm(`"${ntitle}" মুছে ফেলবেন?`)) return;
    const { error } = await supabase.from("notices").delete().eq("id", id);
    if (error) { console.error("Delete notice error:", error); toast.error("মুছে ফেলা যায়নি"); return; }
    toast.success("নোটিশ মুছে ফেলা হয়েছে");
    loadNotices();
  };

  return (
    <div className="min-h-screen islamic-bg">
      <IslamicPattern opacity={0.04} />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-72 min-h-screen">

        {/* ── Header ── */}
        <div className="sticky top-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ background: "rgba(7,26,14,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 rounded-xl hover:bg-white/10 text-warm-white/70">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-warm-white font-bold text-xl">নোটিশ ম্যানেজমেন্ট</h1>
              <p className="text-warm-white/40 text-xs">{notices.length}টি নোটিশ • Supabase</p>
            </div>
          </div>
          <button onClick={openAdd} className="btn-gold flex items-center gap-2 text-sm py-2.5 px-4">
            <Plus size={16} /> নতুন নোটিশ
          </button>
        </div>

        {/* ── List ── */}
        <div className="p-4 md:p-8 page-enter space-y-3">
          {loading ? (
            <div className="glass-card p-16 text-center">
              <div className="w-10 h-10 border-4 border-islamic-gold-400/30 border-t-islamic-gold-400 rounded-full animate-spin mx-auto mb-3" />
              <div className="text-warm-white/30 text-sm">লোড হচ্ছে...</div>
            </div>
          ) : notices.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <Bell size={48} className="text-warm-white/10 mx-auto mb-3" />
              <div className="text-warm-white/30 mb-4">কোনো নোটিশ নেই</div>
              <button onClick={openAdd} className="btn-gold text-sm flex items-center gap-2 mx-auto">
                <Plus size={14} /> প্রথম নোটিশ যোগ করুন
              </button>
            </div>
          ) : (
            notices.map((n, i) => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
              return (
                <div key={n.id} className="glass-card p-5 animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}30` }}>
                      <Bell size={18} style={{ color: cfg.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {n.is_pinned && <Pin size={12} className="text-yellow-400 flex-shrink-0" />}
                        <h4 className="text-warm-white font-bold text-sm leading-snug">{n.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: `${cfg.color}18`, color: cfg.color }}>
                          {cfg.label}
                        </span>
                        {n.is_pinned && (
                          <span className="text-xs px-2 py-0.5 rounded-full text-yellow-400 bg-yellow-400/10">পিন করা</span>
                        )}
                      </div>
                      <p className="text-warm-white/55 text-xs leading-relaxed line-clamp-2">{n.content}</p>
                      <div className="text-warm-white/25 text-xs mt-1.5">
                        {new Date(n.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-shrink-0 ml-2">
                      <button
                        onClick={() => openEdit(n)}
                        title="সম্পাদনা"
                        className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
                        style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)", color: "#c9a227" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,162,39,0.22)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(201,162,39,0.1)")}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(n.id, n.title)}
                        title="মুছুন"
                        className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.22)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ═══ MODAL ═══ */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="w-full max-w-lg animate-slide-up rounded-2xl overflow-hidden"
            style={{ background: "rgba(7,26,14,0.98)", border: "1px solid rgba(201,162,39,0.25)", maxHeight: "90vh", overflowY: "auto" }}>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(201,162,39,0.15)" }}>
                  <Bell size={17} className="text-islamic-gold-400" />
                </div>
                <h2 className="text-warm-white font-bold text-base">
                  {editingNotice ? "নোটিশ সম্পাদনা" : "নতুন নোটিশ যোগ করুন"}
                </h2>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg text-warm-white/40 hover:text-warm-white hover:bg-white/10 transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-warm-white/60 text-xs mb-1.5 font-medium">শিরোনাম *</label>
                <input
                  type="text"
                  value={fTitle}
                  onChange={(e) => setFTitle(e.target.value)}
                  placeholder="নোটিশের শিরোনাম লিখুন..."
                  className="input-islamic text-sm w-full"
                  autoFocus
                />
              </div>

              {/* Type + Pinned row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-warm-white/60 text-xs mb-1.5 font-medium">ধরন</label>
                  <select
                    value={fType}
                    onChange={(e) => setFType(e.target.value)}
                    className="input-islamic text-sm w-full"
                  >
                    {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                      <option key={k} value={k} style={{ background: "#071a0e" }}>{v.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <input
                      type="checkbox"
                      checked={fPinned}
                      onChange={(e) => setFPinned(e.target.checked)}
                      className="w-4 h-4 accent-yellow-500 flex-shrink-0"
                    />
                    <span className="flex items-center gap-1.5 text-warm-white/70 text-sm">
                      <Pin size={13} className="text-yellow-400" /> পিন করুন
                    </span>
                  </label>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-warm-white/60 text-xs mb-1.5 font-medium">বিষয়বস্তু *</label>
                <textarea
                  value={fContent}
                  onChange={(e) => setFContent(e.target.value)}
                  placeholder="নোটিশের বিস্তারিত বিবরণ লিখুন..."
                  className="input-islamic text-sm w-full resize-none"
                  rows={5}
                />
              </div>

              {/* Preview badge */}
              {fType && (
                <div className="flex items-center gap-2">
                  <span className="text-warm-white/30 text-xs">প্রিভিউ:</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                    style={{ background: `${TYPE_CONFIG[fType]?.color}18`, color: TYPE_CONFIG[fType]?.color }}>
                    {TYPE_CONFIG[fType]?.label}
                  </span>
                  {fPinned && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full text-yellow-400 bg-yellow-400/10">📌 পিন করা</span>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-gold flex items-center gap-2 text-sm flex-1 justify-center disabled:opacity-60"
              >
                {saving
                  ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  : <Save size={15} />}
                {saving ? "সংরক্ষণ হচ্ছে..." : editingNotice ? "আপডেট করুন" : "সংরক্ষণ করুন"}
              </button>
              <button onClick={closeModal} className="btn-green flex items-center gap-2 text-sm px-5">
                <X size={15} /> বাতিল
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
