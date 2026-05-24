// ============================================================
// AdminSuggestionsPage - Supabase CRUD for Suggestions
// ============================================================

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Menu, Lightbulb } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import type { Suggestion, Subject } from "@/types";
import IslamicPattern from "@/components/layout/IslamicPattern";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

const EMPTY_SUG = {
  subject_id: "", subject_name: "", title: "", description: "",
  exam_type: "বার্ষিক", topics: [""], importance: "গুরুত্বপূর্ণ",
};

export default function AdminSuggestionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_SUG });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [sugRes, subRes] = await Promise.all([
      supabase.from("suggestions").select("*").order("created_at", { ascending: false }),
      supabase.from("subjects").select("id, name").order("name"),
    ]);
    if (sugRes.data) {
      setSuggestions(sugRes.data.map((s: any) => ({
        id: s.id, subjectId: s.subject_id, subjectName: s.subject_name,
        title: s.title, description: s.description, examType: s.exam_type,
        topics: s.topics || [], importance: s.importance, createdAt: s.created_at,
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

  const handleTopicChange = (idx: number, val: string) => {
    const t = [...form.topics]; t[idx] = val;
    setForm((f) => ({ ...f, topics: t }));
  };
  const addTopic = () => setForm((f) => ({ ...f, topics: [...f.topics, ""] }));
  const removeTopic = (idx: number) => setForm((f) => ({ ...f, topics: f.topics.filter((_, i) => i !== idx) }));

  const handleAdd = async () => {
    if (!form.title || !form.subject_id) { toast.error("শিরোনাম ও বিষয় আবশ্যক"); return; }
    const payload = { ...form, topics: form.topics.filter((t) => t.trim()) };
    const { error } = await supabase.from("suggestions").insert(payload);
    if (error) { console.error("Add suggestion error:", error); toast.error("যোগ করা যায়নি"); return; }
    toast.success("সাজেশন যোগ হয়েছে");
    setForm({ ...EMPTY_SUG });
    setIsAdding(false);
    loadData();
  };

  const handleUpdate = async () => {
    const payload = { ...form, topics: form.topics.filter((t) => t.trim()) };
    const { error } = await supabase.from("suggestions").update(payload).eq("id", editingId);
    if (error) { console.error("Update suggestion error:", error); toast.error("আপডেট হয়নি"); return; }
    toast.success("সাজেশন আপডেট হয়েছে");
    setEditingId(null);
    loadData();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`"${title}" মুছবেন?`)) return;
    const { error } = await supabase.from("suggestions").delete().eq("id", id);
    if (error) { console.error("Delete suggestion error:", error); toast.error("মুছে ফেলা যায়নি"); return; }
    toast.success("সাজেশন মুছে ফেলা হয়েছে");
    loadData();
  };

  const startEdit = (sug: Suggestion) => {
    setEditingId(sug.id);
    setForm({
      subject_id: sug.subjectId, subject_name: sug.subjectName,
      title: sug.title, description: sug.description,
      exam_type: sug.examType, topics: [...sug.topics, ""], importance: sug.importance,
    });
  };

  // ✅ Render function — NOT a nested component, prevents keyboard/focus loss on mobile
  const renderFormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-warm-white/60 text-xs mb-1.5">বিষয়*</label>
          <select value={form.subject_id} onChange={(e) => handleSubjectChange(e.target.value)} className="input-islamic text-sm">
            <option value="">বিষয় বেছে নিন...</option>
            {subjects.map((s) => <option key={s.id} value={s.id} style={{ background: "#071a0e" }}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-warm-white/60 text-xs mb-1.5">পরীক্ষার ধরন</label>
          <select value={form.exam_type} onChange={(e) => setForm((f) => ({ ...f, exam_type: e.target.value }))} className="input-islamic text-sm">
            {["অর্ধবার্ষিক", "বার্ষিক", "টেস্ট", "সাপ্তাহিক"].map((t) => <option key={t} value={t} style={{ background: "#071a0e" }}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-warm-white/60 text-xs mb-1.5">গুরুত্ব</label>
          <select value={form.importance} onChange={(e) => setForm((f) => ({ ...f, importance: e.target.value }))} className="input-islamic text-sm">
            {["অতি গুরুত্বপূর্ণ", "গুরুত্বপূর্ণ", "সাধারণ"].map((t) => <option key={t} value={t} style={{ background: "#071a0e" }}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-warm-white/60 text-xs mb-1.5">শিরোনাম*</label>
        <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="সাজেশনের শিরোনাম..." className="input-islamic text-sm" />
      </div>
      <div>
        <label className="block text-warm-white/60 text-xs mb-1.5">বিবরণ</label>
        <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="সাজেশন সম্পর্কে..." className="input-islamic text-sm resize-none" rows={2} />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-warm-white/60 text-xs">গুরুত্বপূর্ণ টপিক</label>
          <button onClick={addTopic} className="text-islamic-gold-400 text-xs flex items-center gap-1 hover:underline">
            <Plus size={12} /> টপিক যোগ
          </button>
        </div>
        <div className="space-y-2">
          {form.topics.map((topic, idx) => (
            <div key={idx} className="flex gap-2">
              <input value={topic} onChange={(e) => handleTopicChange(idx, e.target.value)}
                placeholder={`টপিক ${idx + 1}...`} className="input-islamic text-sm flex-1" />
              {form.topics.length > 1 && (
                <button onClick={() => removeTopic(idx)} className="p-2.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0">
                  <X size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getImpColor = (imp: string) =>
    imp === "অতি গুরুত্বপূর্ণ" ? "text-red-400 bg-red-400/10" :
    imp === "গুরুত্বপূর্ণ" ? "text-yellow-400 bg-yellow-400/10" : "text-green-400 bg-green-400/10";

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
              <h1 className="text-warm-white font-bold text-xl">সাজেশন ম্যানেজমেন্ট</h1>
              <p className="text-warm-white/40 text-xs">{suggestions.length}টি সাজেশন • Supabase</p>
            </div>
          </div>
          <button onClick={() => { setIsAdding(true); setEditingId(null); setForm({ ...EMPTY_SUG }); }}
            className="btn-gold flex items-center gap-2 text-sm py-2.5 px-4">
            <Plus size={16} /> নতুন সাজেশন
          </button>
        </div>

        <div className="p-4 md:p-8 page-enter space-y-4">
          {isAdding && (
            <div className="glass-card p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-warm-white font-bold">নতুন সাজেশন</h3>
                <button onClick={() => setIsAdding(false)}><X size={20} className="text-warm-white/40" /></button>
              </div>
              {renderFormFields()}
              <div className="flex gap-3 mt-5">
                <button onClick={handleAdd} className="btn-gold text-sm flex items-center gap-2"><Save size={14} /> সংরক্ষণ</button>
                <button onClick={() => setIsAdding(false)} className="btn-green text-sm flex items-center gap-2"><X size={14} /> বাতিল</button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="glass-card p-16 text-center">
              <div className="w-10 h-10 border-4 border-islamic-gold-400/30 border-t-islamic-gold-400 rounded-full animate-spin mx-auto mb-3" />
              <div className="text-warm-white/30 text-sm">লোড হচ্ছে...</div>
            </div>
          ) : suggestions.map((sug, i) => (
            <div key={sug.id} className="glass-card p-5 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
              {editingId === sug.id ? (
                <div>
                  {renderFormFields()}
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleUpdate} className="btn-gold text-sm flex items-center gap-2"><Save size={14} /> আপডেট</button>
                    <button onClick={() => setEditingId(null)} className="btn-green text-sm flex items-center gap-2"><X size={14} /> বাতিল</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(201,162,39,0.15)" }}>
                    <Lightbulb size={18} className="text-islamic-gold-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-warm-white font-bold text-sm">{sug.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getImpColor(sug.importance)}`}>{sug.importance}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full text-islamic-green-300 bg-islamic-green-500/20">{sug.examType}</span>
                    </div>
                    <div className="text-warm-white/50 text-xs mb-2">{sug.subjectName}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {sug.topics.slice(0, 3).map((t, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded-full text-warm-white/60"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          {t}
                        </span>
                      ))}
                      {sug.topics.length > 3 && <span className="text-xs text-warm-white/30">+{sug.topics.length - 3} আরও</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(sug)} className="p-2 rounded-lg text-islamic-gold-400/70 hover:text-islamic-gold-400 hover:bg-islamic-gold-400/10 transition-all">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(sug.id, sug.title)} className="p-2 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {!loading && suggestions.length === 0 && (
            <div className="glass-card p-16 text-center">
              <Lightbulb size={48} className="text-warm-white/10 mx-auto mb-3" />
              <div className="text-warm-white/30">কোনো সাজেশন নেই</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
