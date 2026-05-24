// ============================================================
// AdminHomeworkPage - Supabase CRUD for Homework
// ============================================================

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Menu, ClipboardList } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import type { Homework, Subject } from "@/types";
import IslamicPattern from "@/components/layout/IslamicPattern";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

const EMPTY_HW = {
  subject_id: "", subject_name: "", title: "", description: "",
  due_date: "", is_urgent: false,
};

export default function AdminHomeworkPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_HW });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [hwRes, subRes] = await Promise.all([
      supabase.from("homework").select("*").order("created_at", { ascending: false }),
      supabase.from("subjects").select("id, name").order("name"),
    ]);
    if (hwRes.data) {
      setHomework(hwRes.data.map((h: any) => ({
        id: h.id, subjectId: h.subject_id, subjectName: h.subject_name,
        title: h.title, description: h.description, dueDate: h.due_date,
        isUrgent: h.is_urgent, createdAt: h.created_at,
      })));
    }
    if (subRes.data) {
      setSubjects(subRes.data.map((s: any) => ({
        id: s.id, name: s.name, nameEn: "", teacher: "", teacherDesignation: "",
        icon: "", color: "", description: "", totalClasses: 0, completedClasses: 0, createdAt: "",
      })));
    }
    setLoading(false);
  };

  const handleSubjectChange = (id: string) => {
    const sub = subjects.find((s) => s.id === id);
    setForm((f) => ({ ...f, subject_id: id, subject_name: sub?.name || "" }));
  };

  const handleAdd = async () => {
    if (!form.title || !form.subject_id || !form.due_date) {
      toast.error("শিরোনাম, বিষয় ও জমার তারিখ আবশ্যক"); return;
    }
    const { error } = await supabase.from("homework").insert(form);
    if (error) { console.error("Add homework error:", error); toast.error("যোগ করা যায়নি"); return; }
    toast.success("হোমওয়ার্ক যোগ করা হয়েছে");
    setForm({ ...EMPTY_HW });
    setIsAdding(false);
    loadData();
  };

  const handleUpdate = async () => {
    const { error } = await supabase.from("homework").update(form).eq("id", editingId);
    if (error) { console.error("Update homework error:", error); toast.error("আপডেট হয়নি"); return; }
    toast.success("হোমওয়ার্ক আপডেট হয়েছে");
    setEditingId(null);
    loadData();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`"${title}" মুছে ফেলবেন?`)) return;
    const { error } = await supabase.from("homework").delete().eq("id", id);
    if (error) { console.error("Delete homework error:", error); toast.error("মুছে ফেলা যায়নি"); return; }
    toast.success("হোমওয়ার্ক মুছে ফেলা হয়েছে");
    loadData();
  };

  const startEdit = (hw: Homework) => {
    setEditingId(hw.id);
    setForm({
      subject_id: hw.subjectId, subject_name: hw.subjectName,
      title: hw.title, description: hw.description,
      due_date: hw.dueDate, is_urgent: hw.isUrgent,
    });
  };

  // ✅ Render function — NOT a nested component, prevents keyboard/focus loss on mobile
  const renderFormFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-warm-white/60 text-xs mb-1.5">বিষয় নির্বাচন*</label>
        <select value={form.subject_id} onChange={(e) => handleSubjectChange(e.target.value)} className="input-islamic text-sm">
          <option value="">বিষয় বেছে নিন...</option>
          {subjects.map((s) => <option key={s.id} value={s.id} style={{ background: "#071a0e" }}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-warm-white/60 text-xs mb-1.5">জমার তারিখ*</label>
        <input type="text" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
          placeholder="যেমন: ২০২৪-০১-২০" className="input-islamic text-sm" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-warm-white/60 text-xs mb-1.5">শিরোনাম*</label>
        <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="হোমওয়ার্কের শিরোনাম..." className="input-islamic text-sm" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-warm-white/60 text-xs mb-1.5">বিবরণ</label>
        <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="হোমওয়ার্কের বিস্তারিত..." className="input-islamic text-sm resize-none" rows={3} />
      </div>
      <div className="flex items-center gap-3">
        <input type="checkbox" id="urgent" checked={form.is_urgent}
          onChange={(e) => setForm((f) => ({ ...f, is_urgent: e.target.checked }))}
          className="w-4 h-4 accent-red-500" />
        <label htmlFor="urgent" className="text-warm-white/70 text-sm cursor-pointer">জরুরি হিসেবে চিহ্নিত করুন</label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen islamic-bg">
      <IslamicPattern opacity={0.04} />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-72 min-h-screen">
        <div className="sticky top-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ background: "rgba(7,26,14,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 rounded-xl hover:bg-white/10 text-warm-white/70">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-warm-white font-bold text-xl">হোমওয়ার্ক ম্যানেজমেন্ট</h1>
              <p className="text-warm-white/40 text-xs">{homework.length}টি হোমওয়ার্ক • Supabase</p>
            </div>
          </div>
          <button onClick={() => { setIsAdding(true); setEditingId(null); setForm({ ...EMPTY_HW }); }}
            className="btn-gold flex items-center gap-2 text-sm py-2.5 px-4">
            <Plus size={16} /> নতুন হোমওয়ার্ক
          </button>
        </div>

        <div className="p-4 md:p-8 page-enter space-y-4">
          {isAdding && (
            <div className="glass-card p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-warm-white font-bold">নতুন হোমওয়ার্ক</h3>
                <button onClick={() => setIsAdding(false)}><X size={20} className="text-warm-white/40" /></button>
              </div>
              {renderFormFields()}
              <div className="flex gap-3 mt-5">
                <button onClick={handleAdd} className="btn-gold flex items-center gap-2 text-sm"><Save size={15} /> সংরক্ষণ</button>
                <button onClick={() => setIsAdding(false)} className="btn-green flex items-center gap-2 text-sm"><X size={15} /> বাতিল</button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="glass-card p-16 text-center">
              <div className="w-10 h-10 border-4 border-islamic-gold-400/30 border-t-islamic-gold-400 rounded-full animate-spin mx-auto mb-3" />
              <div className="text-warm-white/30 text-sm">লোড হচ্ছে...</div>
            </div>
          ) : homework.map((hw, i) => (
            <div key={hw.id} className="glass-card p-5 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
              {editingId === hw.id ? (
                <div>
                  {renderFormFields()}
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleUpdate} className="btn-gold text-sm flex items-center gap-2"><Save size={14} /> আপডেট</button>
                    <button onClick={() => setEditingId(null)} className="btn-green text-sm flex items-center gap-2"><X size={14} /> বাতিল</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: hw.isUrgent ? "rgba(239,68,68,0.15)" : "rgba(201,162,39,0.15)" }}>
                    <ClipboardList size={18} className={hw.isUrgent ? "text-red-400" : "text-islamic-gold-400"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-warm-white font-bold text-sm">{hw.title}</h4>
                      {hw.isUrgent && <span className="badge-gold text-xs">জরুরি</span>}
                    </div>
                    <div className="text-warm-white/50 text-xs mb-2">{hw.subjectName} • জমা: {hw.dueDate}</div>
                    <p className="text-warm-white/60 text-xs leading-relaxed line-clamp-2">{hw.description}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(hw)} className="p-2 rounded-lg text-islamic-gold-400/70 hover:text-islamic-gold-400 hover:bg-islamic-gold-400/10 transition-all">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(hw.id, hw.title)} className="p-2 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {!loading && homework.length === 0 && (
            <div className="glass-card p-16 text-center">
              <ClipboardList size={48} className="text-warm-white/10 mx-auto mb-3" />
              <div className="text-warm-white/30">কোনো হোমওয়ার্ক নেই</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
