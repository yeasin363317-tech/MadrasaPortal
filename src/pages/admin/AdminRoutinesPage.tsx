// ============================================================
// AdminRoutinesPage — Premium Light Theme
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Edit2, Trash2, Save, X, Menu, Calendar, Upload, FileText, ExternalLink } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

interface Routine { id: string; title: string; description: string; file_url: string; routine_type: string; is_active: boolean; created_at: string; }

export default function AdminRoutinesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [rtitle, setRtitle] = useState("");
  const [rdescription, setRdescription] = useState("");
  const [rfileUrl, setRfileUrl] = useState("");
  const [rtype, setRtype] = useState("class");
  const [ractive, setRactive] = useState(true);

  useEffect(() => { loadRoutines(); }, []);

  const loadRoutines = async () => {
    setLoading(true);
    const { data } = await supabase.from("routines").select("*").order("created_at", { ascending: false });
    if (data) setRoutines(data);
    setLoading(false);
  };

  const resetForm = useCallback(() => { setRtitle(""); setRdescription(""); setRfileUrl(""); setRtype("class"); setRactive(true); }, []);
  const getPayload = () => ({ title: rtitle, description: rdescription, file_url: rfileUrl, routine_type: rtype, is_active: ractive });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `routines/${Date.now()}_${file.name.replace(/\s/g, "_")}`;
    const { data, error } = await supabase.storage.from("routines").upload(fileName, file, { upsert: true });
    if (error) { toast.error("আপলোড হয়নি"); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("routines").getPublicUrl(data.path);
    setRfileUrl(urlData.publicUrl);
    toast.success("ফাইল আপলোড সফল ✓");
    setUploading(false);
  };

  const handleAdd = async () => {
    if (!rtitle.trim()) { toast.error("শিরোনাম আবশ্যক"); return; }
    const { error } = await supabase.from("routines").insert(getPayload());
    if (error) { toast.error("যোগ করা যায়নি"); return; }
    toast.success("রুটিন যোগ হয়েছে ✓");
    resetForm(); setIsAdding(false); loadRoutines();
  };

  const handleUpdate = async () => {
    if (!rtitle.trim()) { toast.error("শিরোনাম আবশ্যক"); return; }
    const { error } = await supabase.from("routines").update(getPayload()).eq("id", editingId);
    if (error) { toast.error("আপডেট হয়নি"); return; }
    toast.success("রুটিন আপডেট হয়েছে ✓");
    setEditingId(null); loadRoutines();
  };

  const handleDelete = async (id: string, rtl: string) => {
    if (!window.confirm(`"${rtl}" মুছবেন?`)) return;
    const { error } = await supabase.from("routines").delete().eq("id", id);
    if (error) { toast.error("মুছে ফেলা যায়নি"); return; }
    toast.success("রুটিন মুছে ফেলা হয়েছে");
    loadRoutines();
  };

  const startEdit = (r: Routine) => { setEditingId(r.id); setIsAdding(false); setRtitle(r.title); setRdescription(r.description); setRfileUrl(r.file_url); setRtype(r.routine_type); setRactive(r.is_active); };
  const cancelForm = () => { setIsAdding(false); setEditingId(null); resetForm(); };

  const typeLabels: Record<string, string> = { class: "ক্লাস রুটিন", exam: "পরীক্ষার রুটিন", special: "বিশেষ রুটিন" };

  const renderFormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">শিরোনাম*</label>
          <input type="text" value={rtitle} onChange={(e) => setRtitle(e.target.value)}
            placeholder="যেমন: ক্লাস রুটিন ২০২৪-২৫" className="edu-input text-sm" style={{ fontSize: "16px" }} />
        </div>
        <div>
          <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">রুটিনের ধরন</label>
          <select value={rtype} onChange={(e) => setRtype(e.target.value)} className="edu-input text-sm">
            {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3 pt-5">
          <input type="checkbox" id="routine_active" checked={ractive} onChange={(e) => setRactive(e.target.checked)} className="w-4 h-4 accent-green-500" />
          <label htmlFor="routine_active" className="text-edu-slate-600 text-sm cursor-pointer">সক্রিয় হিসেবে দেখান</label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">বিবরণ</label>
          <textarea value={rdescription} onChange={(e) => setRdescription(e.target.value)}
            placeholder="রুটিন সম্পর্কে সংক্ষিপ্ত বিবরণ..." className="edu-input text-sm resize-none" rows={2} />
        </div>
      </div>
      <div>
        <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">ফাইল আপলোড (PDF/Image)</label>
        <div className="flex gap-3">
          <input type="text" value={rfileUrl} onChange={(e) => setRfileUrl(e.target.value)}
            placeholder="ফাইলের URL বা আপলোড করুন..." className="edu-input text-sm flex-1" style={{ fontSize: "16px" }} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d" }}>
            {uploading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Upload size={14} />}
            {uploading ? "আপলোড..." : "আপলোড"}
          </button>
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={handleFileUpload} className="hidden" />
        </div>
        {rfileUrl && (
          <a href={rfileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-edu-green-600 hover:underline mt-2">
            <ExternalLink size={11} /> ফাইল দেখুন
          </a>
        )}
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
              <h1 className="text-edu-slate-800 font-bold text-xl">রুটিন ম্যানেজমেন্ট</h1>
              <p className="text-edu-slate-400 text-xs">{routines.length}টি রুটিন</p>
            </div>
          </div>
          <button onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}
            className="btn-primary flex items-center gap-2 text-sm py-2.5 px-4">
            <Plus size={16} /> নতুন রুটিন
          </button>
        </div>

        <div className="p-4 md:p-8 page-enter space-y-4">
          {isAdding && (
            <div className="edu-card p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-edu-slate-800 font-bold">নতুন রুটিন যোগ করুন</h3>
                <button onClick={cancelForm} className="p-2 rounded-xl hover:bg-edu-slate-100 transition-colors">
                  <X size={18} className="text-edu-slate-400" />
                </button>
              </div>
              {renderFormFields()}
              <div className="flex gap-3 mt-5">
                <button onClick={handleAdd} className="btn-primary text-sm flex items-center gap-2"><Save size={14} /> সংরক্ষণ</button>
                <button onClick={cancelForm} className="btn-outline text-sm flex items-center gap-2"><X size={14} /> বাতিল</button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="edu-card p-16 text-center">
              <div className="w-10 h-10 border-4 border-edu-green-200 border-t-edu-green-600 rounded-full animate-spin mx-auto mb-3" />
              <div className="text-edu-slate-400 text-sm">লোড হচ্ছে...</div>
            </div>
          ) : routines.length === 0 ? (
            <div className="edu-card p-16 text-center">
              <Calendar size={48} className="text-edu-slate-200 mx-auto mb-3" />
              <div className="text-edu-slate-400">কোনো রুটিন নেই</div>
            </div>
          ) : (
            routines.map((r, i) => (
              <div key={r.id} className="edu-card p-5 animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                {editingId === r.id ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-edu-slate-800 font-bold text-sm">রুটিন সম্পাদনা</h3>
                      <button onClick={cancelForm} className="p-2 rounded-xl hover:bg-edu-slate-100 transition-colors">
                        <X size={16} className="text-edu-slate-400" />
                      </button>
                    </div>
                    {renderFormFields()}
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleUpdate} className="btn-primary text-sm flex items-center gap-2"><Save size={14} /> আপডেট</button>
                      <button onClick={cancelForm} className="btn-outline text-sm flex items-center gap-2"><X size={14} /> বাতিল</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#ede9fe" }}>
                      <Calendar size={18} style={{ color: "#7c3aed" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-edu-slate-800 font-bold text-sm">{r.title}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full text-purple-700 bg-purple-50 border border-purple-100">{typeLabels[r.routine_type] || r.routine_type}</span>
                        {!r.is_active && <span className="text-xs px-2 py-0.5 rounded-full text-edu-slate-400 bg-edu-slate-100">নিষ্ক্রিয়</span>}
                      </div>
                      {r.description && <p className="text-edu-slate-400 text-xs mb-2 line-clamp-1">{r.description}</p>}
                      {r.file_url && (
                        <a href={r.file_url} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-edu-green-600 hover:underline transition-colors">
                          <FileText size={12} /> রুটিন ডাউনলোড করুন <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => startEdit(r)} className="w-8 h-8 flex items-center justify-center rounded-xl transition-all" style={{ background: "#fef3c7", color: "#d97706" }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(r.id, r.title)} className="w-8 h-8 flex items-center justify-center rounded-xl transition-all" style={{ background: "#fef2f2", color: "#dc2626" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
