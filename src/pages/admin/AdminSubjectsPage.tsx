// ============================================================
// AdminSubjectsPage - Supabase CRUD for Subjects
// ============================================================

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Menu, BookOpen } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import type { Subject } from "@/types";
import IslamicPattern from "@/components/layout/IslamicPattern";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

const EMPTY_SUBJECT = {
  name: "", name_en: "", teacher: "", teacher_designation: "",
  icon: "📖", color: "#c9a227", description: "",
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
    if (error) { console.error("Load subjects error:", error); toast.error("ডেটা লোড হয়নি"); }
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
    const { data, error } = await supabase.from("subjects").insert(form).select().single();
    if (error) { console.error("Add subject error:", error); toast.error("যোগ করা যায়নি"); return; }
    toast.success("বিষয় সফলভাবে যোগ করা হয়েছে");
    setForm({ ...EMPTY_SUBJECT });
    setIsAdding(false);
    loadSubjects();
  };

  const handleUpdate = async () => {
    if (!form.name || !form.teacher) { toast.error("নাম ও শিক্ষকের নাম আবশ্যক"); return; }
    const { error } = await supabase.from("subjects").update(form).eq("id", editingId);
    if (error) { console.error("Update subject error:", error); toast.error("আপডেট হয়নি"); return; }
    toast.success("বিষয় আপডেট হয়েছে");
    setEditingId(null);
    loadSubjects();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" বিষয়টি মুছে ফেলবেন?`)) return;
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) { console.error("Delete subject error:", error); toast.error("মুছে ফেলা যায়নি"); return; }
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

  // ✅ Render function — NOT a nested component, prevents keyboard/focus loss on mobile
  const renderFormFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { label: "বিষয়ের নাম (বাংলা)*", key: "name", placeholder: "যেমন: গণিত" },
        { label: "বিষয়ের নাম (ইংরেজি)", key: "name_en", placeholder: "Mathematics" },
        { label: "শিক্ষকের নাম*", key: "teacher", placeholder: "যেমন: জনাব রফিকুল ইসলাম" },
        { label: "পদবি", key: "teacher_designation", placeholder: "যেমন: বিষয় শিক্ষক" },
        { label: "আইকন (ইমোজি)", key: "icon", placeholder: "📖" },
        { label: "মোট ক্লাস", key: "total_classes", type: "number", placeholder: "100" },
      ].map(({ label, key, placeholder, type = "text" }) => (
        <div key={key}>
          <label className="block text-warm-white/60 text-xs mb-1.5">{label}</label>
          <input type={type} value={(form as any)[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: type === "number" ? parseInt(e.target.value) || 0 : e.target.value } as typeof form))}
            placeholder={placeholder} className="input-islamic text-sm" />
        </div>
      ))}
      <div className="md:col-span-2">
        <label className="block text-warm-white/60 text-xs mb-1.5">বিবরণ</label>
        <textarea value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="বিষয় সম্পর্কে সংক্ষিপ্ত বিবরণ..." className="input-islamic text-sm resize-none" rows={3} />
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
              <h1 className="text-warm-white font-bold text-xl">বিষয় ম্যানেজমেন্ট</h1>
              <p className="text-warm-white/40 text-xs">{subjects.length}টি বিষয় • Supabase</p>
            </div>
          </div>
          <button onClick={() => { setIsAdding(true); setEditingId(null); setForm({ ...EMPTY_SUBJECT }); }}
            className="btn-gold flex items-center gap-2 text-sm py-2.5 px-4">
            <Plus size={16} /> নতুন বিষয়
          </button>
        </div>

        <div className="p-4 md:p-8 page-enter">
          {isAdding && (
            <div className="glass-card p-6 mb-6 animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-warm-white font-bold">নতুন বিষয় যোগ করুন</h3>
                <button onClick={() => setIsAdding(false)}><X size={20} className="text-warm-white/40" /></button>
              </div>
              {renderFormFields()}
              <div className="flex gap-3 mt-5">
                <button onClick={handleAdd} className="btn-gold flex items-center gap-2 text-sm"><Save size={16} /> সংরক্ষণ করুন</button>
                <button onClick={() => setIsAdding(false)} className="btn-green flex items-center gap-2 text-sm"><X size={16} /> বাতিল</button>
              </div>
            </div>
          )}

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-16 text-center">
                  <div className="w-10 h-10 border-4 border-islamic-gold-400/30 border-t-islamic-gold-400 rounded-full animate-spin mx-auto mb-3" />
                  <div className="text-warm-white/30 text-sm">লোড হচ্ছে...</div>
                </div>
              ) : (
                <table className="table-islamic">
                  <thead>
                    <tr>
                      <th>আইকন</th>
                      <th>বিষয়ের নাম</th>
                      <th>শিক্ষক</th>
                      <th>ক্লাস অগ্রগতি</th>
                      <th className="text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <>
                        {editingId === subject.id ? (
                          <tr key={`edit-${subject.id}`}>
                            <td colSpan={5} className="p-4">
                              {renderFormFields()}
                              <div className="flex gap-3 mt-4">
                                <button onClick={handleUpdate} className="btn-gold flex items-center gap-2 text-sm py-2"><Save size={15} /> আপডেট</button>
                                <button onClick={() => setEditingId(null)} className="btn-green flex items-center gap-2 text-sm py-2"><X size={15} /> বাতিল</button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr key={subject.id}>
                            <td>
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                style={{ background: `${subject.color}22`, color: subject.color }}>
                                {subject.icon}
                              </div>
                            </td>
                            <td>
                              <div className="font-semibold text-warm-white">{subject.name}</div>
                              <div className="text-xs text-warm-white/40">{subject.nameEn}</div>
                            </td>
                            <td>
                              <div className="text-warm-white/80 text-sm">{subject.teacher}</div>
                              <div className="text-xs text-warm-white/40">{subject.teacherDesignation}</div>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)", minWidth: "60px" }}>
                                  <div className="h-full rounded-full" style={{
                                    width: `${Math.round((subject.completedClasses / subject.totalClasses) * 100)}%`,
                                    background: subject.color,
                                  }} />
                                </div>
                                <span className="text-xs text-warm-white/50">
                                  {Math.round((subject.completedClasses / subject.totalClasses) * 100)}%
                                </span>
                              </div>
                            </td>
                            <td className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => startEdit(subject)}
                                  className="p-2 rounded-lg text-islamic-gold-400/70 hover:text-islamic-gold-400 hover:bg-islamic-gold-400/10 transition-all">
                                  <Edit2 size={15} />
                                </button>
                                <button onClick={() => handleDelete(subject.id, subject.name)}
                                  className="p-2 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all">
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              )}
              {!loading && subjects.length === 0 && (
                <div className="text-center py-16">
                  <BookOpen size={48} className="text-warm-white/10 mx-auto mb-3" />
                  <div className="text-warm-white/30">কোনো বিষয় নেই</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
