// ============================================================
// AdminSubjectsPage — Premium Light Theme
// ============================================================

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Menu, BookOpen } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import type { Subject } from "@/types";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

const EMPTY_SUBJECT = {
  name: "", name_en: "", teacher: "", teacher_designation: "",
  icon: "📖", color: "#15803d", description: "",
  total_classes: 100, completed_classes: 0,
};

export default function AdminSubjectsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_SUBJECT });

  useEffect(() => { loadSubjects(); }, []);

  const loadSubjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("subjects").select("*").order("created_at", { ascending: true });
    if (error) { toast.error("ডেটা লোড হয়নি"); }
    if (data) {
      setSubjects(data.map((s: any) => ({
        id: s.id, name: s.name, nameEn: s.name_en, teacher: s.teacher,
        teacherDesignation: s.teacher_designation, icon: s.icon, color: s.color,
        description: s.description, totalClasses: s.total_classes,
        completedClasses: s.completed_classes, createdAt: s.created_at,
      })));
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.name || !form.teacher) { toast.error("নাম ও শিক্ষকের নাম আবশ্যক"); return; }
    const { error } = await supabase.from("subjects").insert(form).select().single();
    if (error) { toast.error("যোগ করা যায়নি"); return; }
    toast.success("বিষয় যোগ হয়েছে ✓");
    setForm({ ...EMPTY_SUBJECT }); setIsAdding(false); loadSubjects();
  };

  const handleUpdate = async () => {
    if (!form.name || !form.teacher) { toast.error("নাম ও শিক্ষকের নাম আবশ্যক"); return; }
    const { error } = await supabase.from("subjects").update(form).eq("id", editingId);
    if (error) { toast.error("আপডেট হয়নি"); return; }
    toast.success("বিষয় আপডেট হয়েছে ✓");
    setEditingId(null); loadSubjects();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" বিষয়টি মুছবেন?`)) return;
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) { toast.error("মুছে ফেলা যায়নি"); return; }
    toast.success("বিষয় মুছে ফেলা হয়েছে");
    loadSubjects();
  };

  const startEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setForm({
      name: subject.name, name_en: subject.nameEn, teacher: subject.teacher,
      teacher_designation: subject.teacherDesignation, icon: subject.icon, color: subject.color,
      description: subject.description, total_classes: subject.totalClasses,
      completed_classes: subject.completedClasses,
    });
  };

  const renderFormFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { label: "বিষয়ের নাম (বাংলা)*", key: "name", placeholder: "যেমন: গণিত" },
        { label: "বিষয়ের নাম (ইংরেজি)", key: "name_en", placeholder: "Mathematics" },
        { label: "শিক্ষকের নাম*", key: "teacher", placeholder: "যেমন: জনাব রফিকুল ইসলাম" },
        { label: "পদবি", key: "teacher_designation", placeholder: "বিষয় শিক্ষক" },
        { label: "আইকন (ইমোজি)", key: "icon", placeholder: "📖" },
        { label: "মোট ক্লাস", key: "total_classes", type: "number", placeholder: "100" },
      ].map(({ label, key, placeholder, type = "text" }) => (
        <div key={key}>
          <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">{label}</label>
          <input type={type} value={(form as any)[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: type === "number" ? parseInt(e.target.value) || 0 : e.target.value } as typeof form))}
            placeholder={placeholder} className="edu-input text-sm" style={{ fontSize: "16px" }} />
        </div>
      ))}
      <div className="md:col-span-2">
        <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">বিবরণ</label>
        <textarea value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="বিষয় সম্পর্কে সংক্ষিপ্ত বিবরণ..." className="edu-input text-sm resize-none" rows={3} />
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
              <h1 className="text-edu-slate-800 font-bold text-xl">বিষয় ম্যানেজমেন্ট</h1>
              <p className="text-edu-slate-400 text-xs">{subjects.length}টি বিষয় • Supabase</p>
            </div>
          </div>
          <button onClick={() => { setIsAdding(true); setEditingId(null); setForm({ ...EMPTY_SUBJECT }); }}
            className="btn-primary flex items-center gap-2 text-sm py-2.5 px-4">
            <Plus size={16} /> নতুন বিষয়
          </button>
        </div>

        <div className="p-4 md:p-8 page-enter">
          {isAdding && (
            <div className="edu-card p-6 mb-6 animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-edu-slate-800 font-bold">নতুন বিষয় যোগ করুন</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 rounded-xl hover:bg-edu-slate-100 transition-colors">
                  <X size={18} className="text-edu-slate-400" />
                </button>
              </div>
              {renderFormFields()}
              <div className="flex gap-3 mt-5">
                <button onClick={handleAdd} className="btn-primary flex items-center gap-2 text-sm"><Save size={15} /> সংরক্ষণ</button>
                <button onClick={() => setIsAdding(false)} className="btn-outline flex items-center gap-2 text-sm"><X size={15} /> বাতিল</button>
              </div>
            </div>
          )}

          <div className="edu-card overflow-hidden">
            {loading ? (
              <div className="p-16 text-center">
                <div className="w-10 h-10 border-4 border-edu-green-200 border-t-edu-green-600 rounded-full animate-spin mx-auto mb-3" />
                <div className="text-edu-slate-400 text-sm">লোড হচ্ছে...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-edu-slate-500 uppercase tracking-wider">আইকন</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-edu-slate-500 uppercase tracking-wider">বিষয়</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-edu-slate-500 uppercase tracking-wider">শিক্ষক</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-edu-slate-500 uppercase tracking-wider">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <>
                        {editingId === subject.id ? (
                          <tr key={`edit-${subject.id}`} style={{ background: "#f0fdf4" }}>
                            <td colSpan={4} className="p-5">
                              {renderFormFields()}
                              <div className="flex gap-3 mt-4">
                                <button onClick={handleUpdate} className="btn-primary flex items-center gap-2 text-sm py-2"><Save size={14} /> আপডেট</button>
                                <button onClick={() => setEditingId(null)} className="btn-outline flex items-center gap-2 text-sm py-2"><X size={14} /> বাতিল</button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr key={subject.id} style={{ borderBottom: "1px solid #f1f5f9" }}
                            className="hover:bg-edu-slate-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                                style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                                {subject.icon}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-semibold text-edu-slate-800">{subject.name}</div>
                              <div className="text-xs text-edu-slate-400">{subject.nameEn}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-edu-slate-700 text-sm">{subject.teacher}</div>
                              <div className="text-xs text-edu-slate-400">{subject.teacherDesignation}</div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => startEdit(subject)}
                                  className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
                                  style={{ background: "#fef3c7", color: "#d97706" }}>
                                  <Edit2 size={14} />
                                </button>
                                <button onClick={() => handleDelete(subject.id, subject.name)}
                                  className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
                                  style={{ background: "#fef2f2", color: "#dc2626" }}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!loading && subjects.length === 0 && (
              <div className="text-center py-16">
                <BookOpen size={48} className="text-edu-slate-200 mx-auto mb-3" />
                <div className="text-edu-slate-400">কোনো বিষয় নেই</div>
                <button onClick={() => setIsAdding(true)} className="btn-primary mt-4 text-sm flex items-center gap-2 mx-auto">
                  <Plus size={14} /> প্রথম বিষয় যোগ করুন
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
