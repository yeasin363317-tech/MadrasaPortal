// ============================================================
// AdminTeachersPage — Premium Light Theme
// ============================================================

import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Save, X, Menu, User, Phone, Mail, GraduationCap, Upload, Image } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

interface Teacher {
  id: string; name: string; subject: string; phone: string; email: string;
  education: string; photo_url: string; about: string; is_active: boolean; created_at: string;
}

export default function AdminTeachersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [fName, setFName] = useState("");
  const [fSubject, setFSubject] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fEducation, setFEducation] = useState("");
  const [fAbout, setFAbout] = useState("");
  const [fPhotoUrl, setFPhotoUrl] = useState("");
  const [fActive, setFActive] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadTeachers(); }, []);

  const loadTeachers = async () => {
    setLoading(true);
    const { data } = await supabase.from("teachers").select("*").order("created_at", { ascending: true });
    if (data) setTeachers(data);
    setLoading(false);
  };

  const openAdd = () => { setEditingTeacher(null); setFName(""); setFSubject(""); setFPhone(""); setFEmail(""); setFEducation(""); setFAbout(""); setFPhotoUrl(""); setFActive(true); setModalOpen(true); };
  const openEdit = (t: Teacher) => { setEditingTeacher(t); setFName(t.name); setFSubject(t.subject); setFPhone(t.phone); setFEmail(t.email); setFEducation(t.education); setFAbout(t.about || ""); setFPhotoUrl(t.photo_url || ""); setFActive(t.is_active); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTeacher(null); };

  const handlePhotoUpload = async (file: File) => {
    if (file.size > 3 * 1024 * 1024) { toast.error("ছবির আকার ৩MB এর বেশি হবে না"); return; }
    setUploadingPhoto(true);
    const ext = file.name.split(".").pop();
    const fileName = `teacher_${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("teachers").upload(fileName, file, { upsert: true });
    if (uploadError) { toast.error("ছবি আপলোড হয়নি"); setUploadingPhoto(false); return; }
    const { data: urlData } = supabase.storage.from("teachers").getPublicUrl(fileName);
    setFPhotoUrl(urlData.publicUrl);
    toast.success("ছবি আপলোড হয়েছে ✓");
    setUploadingPhoto(false);
  };

  const handleSave = async () => {
    if (!fName.trim()) { toast.error("শিক্ষকের নাম আবশ্যক"); return; }
    setSaving(true);
    const payload = { name: fName.trim(), subject: fSubject.trim(), phone: fPhone.trim(), email: fEmail.trim(), education: fEducation.trim(), about: fAbout.trim(), photo_url: fPhotoUrl.trim(), is_active: fActive };
    if (editingTeacher) {
      const { error } = await supabase.from("teachers").update(payload).eq("id", editingTeacher.id);
      if (error) { toast.error("আপডেট হয়নি"); setSaving(false); return; }
      toast.success("শিক্ষকের তথ্য আপডেট হয়েছে ✓");
    } else {
      const { error } = await supabase.from("teachers").insert(payload);
      if (error) { toast.error("যোগ করা যায়নি"); setSaving(false); return; }
      toast.success("শিক্ষক যোগ হয়েছে ✓");
    }
    setSaving(false); closeModal(); loadTeachers();
  };

  const handleDelete = async (id: string, tname: string) => {
    if (!window.confirm(`"${tname}" কে মুছবেন?`)) return;
    const { error } = await supabase.from("teachers").delete().eq("id", id);
    if (error) { toast.error("মুছে ফেলা যায়নি"); return; }
    toast.success("শিক্ষক মুছে ফেলা হয়েছে");
    loadTeachers();
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from("teachers").update({ is_active: !current }).eq("id", id);
    if (error) { toast.error("আপডেট হয়নি"); return; }
    toast.success(current ? "নিষ্ক্রিয় করা হয়েছে" : "সক্রিয় করা হয়েছে");
    loadTeachers();
  };

  const renderFormFields = () => (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-edu-slate-500 text-xs mb-2 font-medium">শিক্ষকের ছবি</label>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{ background: "#f0fdf4", border: "2px solid #bbf7d0" }}>
              {fPhotoUrl ? <img src={fPhotoUrl} alt="preview" className="w-full h-full object-cover" /> : <Image size={22} className="text-edu-slate-300" />}
            </div>
            <div className="flex-1">
              <input type="file" ref={fileInputRef} accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }} />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-all disabled:opacity-60"
                style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d" }}>
                {uploadingPhoto ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Upload size={14} />}
                {uploadingPhoto ? "আপলোড হচ্ছে..." : "ছবি আপলোড করুন"}
              </button>
              <p className="text-edu-slate-400 text-[11px] mt-1">সর্বোচ্চ ৩MB • JPG/PNG</p>
            </div>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">নাম *</label>
          <input type="text" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="শিক্ষকের পুরো নাম..." className="edu-input text-sm w-full" style={{ fontSize: "16px" }} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">বিষয়</label>
          <input type="text" value={fSubject} onChange={(e) => setFSubject(e.target.value)} placeholder="যেমন: গণিত, আরবি" className="edu-input text-sm w-full" style={{ fontSize: "16px" }} />
        </div>
        <div>
          <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">ফোন নম্বর</label>
          <input type="tel" value={fPhone} onChange={(e) => setFPhone(e.target.value)} placeholder="০১৮০০-১২৩৪৫৬" className="edu-input text-sm w-full" style={{ fontSize: "16px" }} />
        </div>
        <div>
          <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">ইমেইল</label>
          <input type="email" value={fEmail} onChange={(e) => setFEmail(e.target.value)} placeholder="teacher@madrasa.edu" className="edu-input text-sm w-full" style={{ fontSize: "16px" }} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">শিক্ষাগত যোগ্যতা</label>
          <input type="text" value={fEducation} onChange={(e) => setFEducation(e.target.value)} placeholder="যেমন: কামিল (হাদিস)" className="edu-input text-sm w-full" style={{ fontSize: "16px" }} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-edu-slate-500 text-xs mb-1.5 font-medium">পরিচিতি / About</label>
          <textarea value={fAbout} onChange={(e) => setFAbout(e.target.value)} placeholder="শিক্ষক সম্পর্কে সংক্ষিপ্ত পরিচিতি..."
            rows={3} className="edu-input text-sm w-full resize-none" />
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all border border-edu-slate-200 hover:bg-edu-slate-50">
            <input type="checkbox" checked={fActive} onChange={(e) => setFActive(e.target.checked)} className="w-4 h-4 accent-green-500" />
            <span className="text-edu-slate-600 text-sm">সক্রিয় শিক্ষক হিসেবে চিহ্নিত করুন</span>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${fActive ? "text-edu-green-700 bg-edu-green-50" : "text-edu-slate-400 bg-edu-slate-100"}`}>
              {fActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
            </span>
          </label>
        </div>
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
              <h1 className="text-edu-slate-800 font-bold text-xl">শিক্ষক ম্যানেজমেন্ট</h1>
              <p className="text-edu-slate-400 text-xs">{teachers.length}জন শিক্ষক</p>
            </div>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-4">
            <Plus size={16} /> নতুন শিক্ষক
          </button>
        </div>

        <div className="p-4 md:p-8 page-enter space-y-3">
          {loading ? (
            <div className="edu-card p-16 text-center">
              <div className="w-10 h-10 border-4 border-edu-green-200 border-t-edu-green-600 rounded-full animate-spin mx-auto mb-3" />
              <div className="text-edu-slate-400 text-sm">লোড হচ্ছে...</div>
            </div>
          ) : teachers.length === 0 ? (
            <div className="edu-card p-16 text-center">
              <User size={48} className="text-edu-slate-200 mx-auto mb-3" />
              <div className="text-edu-slate-400 mb-4">কোনো শিক্ষক নেই</div>
              <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2 mx-auto"><Plus size={14} /> প্রথম শিক্ষক যোগ করুন</button>
            </div>
          ) : (
            teachers.map((t, i) => (
              <div key={t.id} className="edu-card p-5 animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 overflow-hidden"
                    style={{ background: "#f0fdf4", border: "2px solid #bbf7d0" }}>
                    {t.photo_url ? <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover" /> : <span className="text-edu-green-700">{t.name.charAt(0)}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-edu-slate-800 font-bold text-sm">{t.name}</span>
                      <button onClick={() => toggleActive(t.id, t.is_active)}
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-all ${t.is_active ? "text-edu-green-700 bg-edu-green-50 border border-edu-green-200" : "text-edu-slate-400 bg-edu-slate-100"}`}>
                        {t.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </button>
                    </div>
                    <div className="text-edu-slate-400 text-xs mb-2">{t.subject || "বিষয় নির্ধারিত নয়"}</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-edu-slate-400">
                      {t.phone && <span className="flex items-center gap-1"><Phone size={11} />{t.phone}</span>}
                      {t.email && <span className="flex items-center gap-1"><Mail size={11} />{t.email}</span>}
                      {t.education && <span className="flex items-center gap-1"><GraduationCap size={11} />{t.education}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(t)} className="w-8 h-8 flex items-center justify-center rounded-xl transition-all" style={{ background: "#fef3c7", color: "#d97706" }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(t.id, t.name)} className="w-8 h-8 flex items-center justify-center rounded-xl transition-all" style={{ background: "#fef2f2", color: "#dc2626" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="w-full max-w-lg animate-scale-in rounded-3xl overflow-hidden"
            style={{ background: "#ffffff", boxShadow: "0 24px 64px rgba(0,0,0,0.15)", maxHeight: "92vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-edu-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "#f0fdf4" }}>
                  <User size={17} className="text-edu-green-600" />
                </div>
                <h2 className="text-edu-slate-800 font-bold text-base">{editingTeacher ? "শিক্ষকের তথ্য সম্পাদনা" : "নতুন শিক্ষক যোগ করুন"}</h2>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-edu-slate-100 transition-colors">
                <X size={17} className="text-edu-slate-400" />
              </button>
            </div>
            {renderFormFields()}
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm flex-1 justify-center disabled:opacity-60">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                {saving ? "সংরক্ষণ হচ্ছে..." : editingTeacher ? "আপডেট করুন" : "সংরক্ষণ করুন"}
              </button>
              <button onClick={closeModal} className="btn-outline flex items-center gap-2 text-sm px-5"><X size={14} /> বাতিল</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
