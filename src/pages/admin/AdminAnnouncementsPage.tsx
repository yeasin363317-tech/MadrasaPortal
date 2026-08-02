// ============================================================
// AdminAnnouncementsPage — CRUD for announcement banners
// ============================================================

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Megaphone, AlertTriangle, CheckCircle, Info, X, Save } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import supabase from "@/lib/supabase";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "urgent";
  created_at: string;
}

const TYPE_OPTIONS = [
  { value: "info",    label: "তথ্য",      color: "#15803d", bg: "#f0fdf4",   Icon: Info },
  { value: "urgent",  label: "জরুরি",     color: "#dc2626", bg: "#fef2f2",   Icon: AlertTriangle },
  { value: "warning", label: "সতর্কতা",   color: "#d97706", bg: "#fffbeb",   Icon: AlertTriangle },
  { value: "success", label: "সফলতা",     color: "#059669", bg: "#ecfdf5",   Icon: CheckCircle },
];

const EMPTY: Omit<Announcement, "id" | "created_at"> = { title: "", content: "", type: "info" };

export default function AdminAnnouncementsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    setLoading(true);
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    if (data) setItems(data as Announcement[]);
    setLoading(false);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setShowModal(true);
  };

  const openEdit = (item: Announcement) => {
    setEditing(item);
    setForm({ title: item.title, content: item.content, type: item.type });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); setForm({ ...EMPTY }); };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("শিরোনাম দিন"); return; }
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from("announcements")
        .update({ title: form.title.trim(), content: form.content.trim(), type: form.type })
        .eq("id", editing.id);
      if (error) { toast.error("আপডেট ব্যর্থ হয়েছে"); }
      else { toast.success("আপডেট হয়েছে"); loadItems(); closeModal(); }
    } else {
      const { error } = await supabase.from("announcements")
        .insert({ title: form.title.trim(), content: form.content.trim(), type: form.type });
      if (error) { toast.error("যোগ ব্যর্থ হয়েছে"); }
      else { toast.success("যোগ হয়েছে"); loadItems(); closeModal(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) { toast.error("মুছতে ব্যর্থ"); }
    else { toast.success("মুছে ফেলা হয়েছে"); loadItems(); }
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#f8fafc" }}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 md:ml-72">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-edu-slate-200"
          style={{ background: "#ffffff", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-xl hover:bg-edu-slate-100 transition-colors">
              <Megaphone size={18} className="text-edu-slate-600" />
            </button>
            <div>
              <h1 className="text-edu-slate-800 font-bold text-lg">ঘোষণা ব্যানার</h1>
              <p className="text-edu-slate-400 text-xs">হোমপেজে দেখানো ঘোষণা পরিচালনা করুন</p>
            </div>
          </div>
          <button onClick={openNew} className="btn-primary text-sm">
            <Plus size={16} /> নতুন ঘোষণা
          </button>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="edu-card p-5 animate-pulse" style={{ height: 80 }} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="edu-card p-20 text-center">
              <div className="text-5xl mb-4">📢</div>
              <h3 className="text-edu-slate-800 font-bold text-lg mb-2">কোনো ঘোষণা নেই</h3>
              <p className="text-edu-slate-400 text-sm mb-6">হোমপেজে ঘোষণা ব্যানার দেখাতে এখানে যোগ করুন।</p>
              <button onClick={openNew} className="btn-primary text-sm mx-auto">
                <Plus size={15} /> ঘোষণা যোগ করুন
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const typeCfg = TYPE_OPTIONS.find((t) => t.value === item.type) || TYPE_OPTIONS[0];
                const { Icon } = typeCfg;
                return (
                  <div key={item.id} className="edu-card p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: typeCfg.bg }}>
                      <Icon size={18} style={{ color: typeCfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-edu-slate-800 text-sm">{item.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: typeCfg.bg, color: typeCfg.color }}>{typeCfg.label}</span>
                      </div>
                      {item.content && (
                        <p className="text-edu-slate-500 text-xs truncate">{item.content}</p>
                      )}
                      <p className="text-edu-slate-400 text-xs mt-1">
                        {new Date(item.created_at).toLocaleDateString("bn-BD")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => openEdit(item)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-edu-slate-400 hover:bg-edu-slate-100 hover:text-edu-green-600 transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(item.id)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-edu-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
          <div className="edu-card p-6 w-full max-w-lg animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-edu-slate-800 font-bold text-lg">
                {editing ? "ঘোষণা সম্পাদনা" : "নতুন ঘোষণা"}
              </h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-edu-slate-100 transition-colors">
                <X size={16} className="text-edu-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-edu-slate-700 text-sm font-semibold mb-2">ধরন</label>
                <div className="grid grid-cols-2 gap-2">
                  {TYPE_OPTIONS.map((t) => {
                    const { Icon: TIcon } = t;
                    return (
                      <button key={t.value} onClick={() => setForm((f) => ({ ...f, type: t.value as any }))}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: form.type === t.value ? t.bg : "#f8fafc",
                          border: form.type === t.value ? `2px solid ${t.color}` : "1.5px solid #e2e8f0",
                          color: form.type === t.value ? t.color : "#64748b",
                        }}>
                        <TIcon size={14} /> {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-edu-slate-700 text-sm font-semibold mb-2">শিরোনাম *</label>
                <input type="text" placeholder="ঘোষণার শিরোনাম লিখুন" value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="edu-input" maxLength={100} />
              </div>

              <div>
                <label className="block text-edu-slate-700 text-sm font-semibold mb-2">বিবরণ (ঐচ্ছিক)</label>
                <textarea placeholder="বিস্তারিত বিবরণ (না দিলেও চলবে)" value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="edu-input resize-none" rows={3} maxLength={300} />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button onClick={closeModal} className="btn-outline flex-1 text-sm">বাতিল</button>
              <button onClick={handleSave} disabled={saving || !form.title.trim()} className="btn-primary flex-1 text-sm">
                {saving
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  : <><Save size={14} /> {editing ? "আপডেট" : "যোগ করুন"}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
          <div className="edu-card p-6 w-full max-w-sm text-center animate-scale-in">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-edu-slate-800 font-bold text-lg mb-2">মুছে ফেলবেন?</h3>
            <p className="text-edu-slate-500 text-sm mb-6">এই ঘোষণাটি স্থায়ীভাবে মুছে যাবে।</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1 text-sm">বাতিল</button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ background: "#dc2626" }}>
                মুছুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
