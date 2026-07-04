// ============================================================
// AdminNoticesPage — Premium Light Theme
// ============================================================

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Menu, Bell, Pin } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

interface Notice { id: string; title: string; content: string; type: string; is_pinned: boolean; created_at: string; }

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  info:    { label: "তথ্য",    color: "#1d4ed8", bg: "#dbeafe" },
  urgent:  { label: "জরুরি",  color: "#dc2626", bg: "#fef2f2" },
  warning: { label: "সতর্কতা", color: "#d97706", bg: "#fef3c7" },
  success: { label: "সফলতা",  color: "#15803d", bg: "#f0fdf4" },
};

export default function AdminNoticesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [fTitle, setFTitle] = useState("");
  const [fContent, setFContent] = useState("");
  const [fType, setFType] = useState("info");
  const [fPinned, setFPinned] = useState(false);

  useEffect(() => { loadNotices(); }, []);

  const loadNotices = async () => {
    setLoading(true);
    const { data } = await supabase.from("notices").select("*").order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
    if (data) setNotices(data);
    setLoading(false);
  };

  const openAdd = () => { setEditingNotice(null); setFTitle(""); setFContent(""); setFType("info"); setFPinned(false); setModalOpen(true); };
  const openEdit = (n: Notice) => { setEditingNotice(n); setFTitle(n.title); setFContent(n.content); setFType(n.type); setFPinned(n.is_pinned); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingNotice(null); };

  const handleSave = async () => {
    if (!fTitle.trim() || !fContent.trim()) { toast.error("শিরোনাম ও বিষয়বস্তু আবশ্যক"); return; }
    setSaving(true);
    const payload = { title: fTitle.trim(), content: fContent.trim(), type: fType, is_pinned: fPinned };
    if (editingNotice) {
      const { error } = await supabase.from("notices").update(payload).eq("id", editingNotice.id);
      if (error) { toast.error("আপডেট হয়নি"); setSaving(false); return; }
      toast.success("নোটিশ আপডেট হয়েছে ✓");
    } else {
      const { error } = await supabase.from("notices").insert(payload);
      if (error) { toast.error("যোগ করা যায়নি"); setSaving(false); return; }
      toast.success("নোটিশ যোগ হয়েছে ✓");
    }
    setSaving(false); closeModal(); loadNotices();
  };

  const handleDelete = async (id: string, ntitle: string) => {
    if (!window.confirm(`"${ntitle}" মুছবেন?`)) return;
    const { error } = await supabase.from("notices").delete().eq("id", id);
    if (error) { toast.error("মুছে ফেলা যায়নি"); return; }
    toast.success("নোটিশ মুছে ফেলা হয়েছে");
    loadNotices();
  };

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-72 min-h-screen">
        <div className="sticky top-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-edu-slate-100 transition-colors">
              <Menu size={20} className="text-edu-slate-600" />
            </button>
            <div>
              <h1 className="text-edu-slate-800 font-bold text-xl">নোটিশ ম্যানেজমেন্ট</h1>
              <p className="text-edu-slate-400 text-xs">{notices.length}টি নোটিশ</p>
            </div>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-4">
            <Plus size={16} /> নতুন নোটিশ
          </button>
        </div>

        <div className="p-4 md:p-8 page-enter space-y-3">
          {loading ? (
            <div className="edu-card p-16 text-center">
              <div className="w-10 h-10 border-4 border-edu-green-200 border-t-edu-green-600 rounded-full animate-spin mx-auto mb-3" />
              <div className="text-edu-slate-400 text-sm">লোড হচ্ছে...</div>
            </div>
          ) : notices.length === 0 ? (
            <div className="edu-card p-16 text-center">
              <Bell size={48} className="text-edu-slate-200 mx-auto mb-3" />
              <div className="text-edu-slate-400 mb-4">কোনো নোটিশ নেই</div>
              <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2 mx-auto"><Plus size={14} /> প্রথম নোটিশ যোগ করুন</button>
            </div>
          ) : (
            notices.map((n, i) => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
              return (
                <div key={n.id} className="edu-card p-5 animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: cfg.bg }}>
                      <Bell size={17} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        {n.is_pinned && <Pin size={12} className="text-yellow-500 flex-shrink-0" />}
                        <h4 className="text-edu-slate-800 font-bold text-sm">{n.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                        {n.is_pinned && <span className="text-xs px-2.5 py-0.5 rounded-full text-yellow-600 bg-yellow-50 border border-yellow-200">📌 পিন করা</span>}
                      </div>
                      <p className="text-edu-slate-500 text-xs leading-relaxed line-clamp-2">{n.content}</p>
                      <div className="text-edu-slate-300 text-xs mt-1.5">
                        {new Date(n.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => openEdit(n)} className="w-8 h-8 flex items-center justify-center rounded-xl transition-all" style={{ background: "#fef3c7", color: "#d97706" }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(n.id, n.title)} className="w-8 h-8 flex items-center justify-center rounded-xl transition-all" style={{ background: "#fef2f2", color: "#dc2626" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="w-full max-w-lg animate-scale-in rounded-3xl overflow-hidden"
            style={{ background: "#ffffff", boxShadow: "0 24px 64px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-edu-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "#f0fdf4" }}>
                  <Bell size={17} className="text-edu-green-600" />
                </div>
                <h2 className="text-edu-slate-800 font-bold text-base">{editingNotice ? "নোটিশ সম্পাদনা" : "নতুন নোটিশ"}</h2>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-edu-slate-100 transition-colors">
                <X size={17} className="text-edu-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">শিরোনাম *</label>
                <input type="text" value={fTitle} onChange={(e) => setFTitle(e.target.value)}
                  placeholder="নোটিশের শিরোনাম..." className="edu-input text-sm" autoFocus style={{ fontSize: "16px" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">ধরন</label>
                  <select value={fType} onChange={(e) => setFType(e.target.value)} className="edu-input text-sm">
                    {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border border-edu-slate-200 hover:bg-edu-slate-50 transition-colors">
                    <input type="checkbox" checked={fPinned} onChange={(e) => setFPinned(e.target.checked)} className="w-4 h-4 accent-yellow-500" />
                    <span className="flex items-center gap-1.5 text-edu-slate-600 text-sm"><Pin size={13} className="text-yellow-500" /> পিন করুন</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">বিষয়বস্তু *</label>
                <textarea value={fContent} onChange={(e) => setFContent(e.target.value)}
                  placeholder="নোটিশের বিস্তারিত বিবরণ..." className="edu-input text-sm resize-none" rows={5} />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm flex-1 justify-center disabled:opacity-60">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                {saving ? "সংরক্ষণ হচ্ছে..." : editingNotice ? "আপডেট করুন" : "সংরক্ষণ করুন"}
              </button>
              <button onClick={closeModal} className="btn-outline flex items-center gap-2 text-sm px-5"><X size={14} /> বাতিল</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
