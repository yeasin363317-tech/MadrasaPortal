// ============================================================
// AdminHomeworkPage — Premium Light Theme
// ============================================================

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Menu, ClipboardList } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import type { Homework, Subject } from "@/types";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

const EMPTY_HW = { subject_id: "", subject_name: "", title: "", description: "", due_date: "", is_urgent: false };

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
    if (!form.title || !form.subject_id || !form.due_date) { toast.error("শিরোনাম, বিষয় ও তারিখ আবশ্যক"); return; }
    const { error } = await supabase.from("homework").insert(form);
    if (error) { toast.error("যোগ করা যায়নি"); return; }
    toast.success("হোমওয়ার্ক যোগ হয়েছে ✓");
    setForm({ ...EMPTY_HW }); setIsAdding(false); loadData();
  };

  const handleUpdate = async () => {
    const { error } = await supabase.from("homework").update(form).eq("id", editingId);
    if (error) { toast.error("আপডেট হয়নি"); return; }
    toast.success("হোমওয়ার্ক আপডেট হয়েছে ✓");
    setEditingId(null); loadData();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`"${title}" মুছবেন?`)) return;
    const { error } = await supabase.from("homework").delete().eq("id", id);
    if (error) { toast.error("মুছে ফেলা যায়নি"); return; }
    toast.success("হোমওয়ার্ক মুছে ফেলা হয়েছে");
    loadData();
  };

  const startEdit = (hw: Homework) => {
    setEditingId(hw.id);
    setForm({ subject_id: hw.subjectId, subject_name: hw.subjectName, title: hw.title, description: hw.description, due_date: hw.dueDate, is_urgent: hw.isUrgent });
  };

  const renderFormFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">বিষয় নির্বাচন*</label>
        <select value={form.subject_id} onChange={(e) => handleSubjectChange(e.target.value)} className="edu-input text-sm">
          <option value="">বিষয় বেছে নিন...</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">জমার তারিখ*</label>
        <input type="text" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
          placeholder="যেমন: ২০২৪-০১-২০" className="edu-input text-sm" style={{ fontSize: "16px" }} />
      </div>
      <div className="md:col-span-2">
        <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">শিরোনাম*</label>
        <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="হোমওয়ার্কের শিরোনাম..." className="edu-input text-sm" style={{ fontSize: "16px" }} />
      </div>
      <div className="md:col-span-2">
        <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">বিবরণ</label>
        <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="হোমওয়ার্কের বিস্তারিত..." className="edu-input text-sm resize-none" rows={3} />
      </div>
      <div className="flex items-center gap-3">
        <input type="checkbox" id="urgent" checked={form.is_urgent}
          onChange={(e) => setForm((f) => ({ ...f, is_urgent: e.target.checked }))} className="w-4 h-4 accent-red-500" />
        <label htmlFor="urgent" className="text-edu-slate-600 text-sm cursor-pointer">জরুরি হিসেবে চিহ্নিত করুন</label>
      </div>
    </div>
  );

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
              <h1 className="text-edu-slate-800 font-bold text-xl">হোমওয়ার্ক ম্যানেজমেন্ট</h1>
              <p className="text-edu-slate-400 text-xs">{homework.length}টি হোমওয়ার্ক</p>
            </div>
          </div>
          <button onClick={() => { setIsAdding(true); setEditingId(null); setForm({ ...EMPTY_HW }); }}
            className="btn-primary flex items-center gap-2 text-sm py-2.5 px-4">
            <Plus size={16} /> নতুন হোমওয়ার্ক
          </button>
        </div>

        <div className="p-4 md:p-8 page-enter space-y-4">
          {isAdding && (
            <div className="edu-card p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-edu-slate-800 font-bold">নতুন হোমওয়ার্ক</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 rounded-xl hover:bg-edu-slate-100 transition-colors">
                  <X size={18} className="text-edu-slate-400" />
                </button>
              </div>
              {renderFormFields()}
              <div className="flex gap-3 mt-5">
                <button onClick={handleAdd} className="btn-primary flex items-center gap-2 text-sm"><Save size={14} /> সংরক্ষণ</button>
                <button onClick={() => setIsAdding(false)} className="btn-outline flex items-center gap-2 text-sm"><X size={14} /> বাতিল</button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="edu-card p-16 text-center">
              <div className="w-10 h-10 border-4 border-edu-green-200 border-t-edu-green-600 rounded-full animate-spin mx-auto mb-3" />
              <div className="text-edu-slate-400 text-sm">লোড হচ্ছে...</div>
            </div>
          ) : homework.map((hw, i) => (
            <div key={hw.id} className="edu-card p-5 animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
              {editingId === hw.id ? (
                <div>
                  {renderFormFields()}
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleUpdate} className="btn-primary text-sm flex items-center gap-2"><Save size={14} /> আপডেট</button>
                    <button onClick={() => setEditingId(null)} className="btn-outline text-sm flex items-center gap-2"><X size={14} /> বাতিল</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: hw.isUrgent ? "#fef2f2" : "#f0fdf4" }}>
                    <ClipboardList size={18} style={{ color: hw.isUrgent ? "#dc2626" : "#15803d" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-edu-slate-800 font-bold text-sm">{hw.title}</h4>
                      {hw.isUrgent && <span className="badge-red">জরুরি</span>}
                    </div>
                    <div className="text-edu-slate-400 text-xs mb-2">{hw.subjectName} • জমা: {hw.dueDate}</div>
                    {hw.description && <p className="text-edu-slate-500 text-xs leading-relaxed line-clamp-2">{hw.description}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(hw)} className="w-8 h-8 flex items-center justify-center rounded-xl transition-all" style={{ background: "#fef3c7", color: "#d97706" }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(hw.id, hw.title)} className="w-8 h-8 flex items-center justify-center rounded-xl transition-all" style={{ background: "#fef2f2", color: "#dc2626" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {!loading && homework.length === 0 && (
            <div className="edu-card p-16 text-center">
              <ClipboardList size={48} className="text-edu-slate-200 mx-auto mb-3" />
              <div className="text-edu-slate-400">কোনো হোমওয়ার্ক নেই</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
