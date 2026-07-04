// ============================================================
// HomePage — Premium Light Theme
// ============================================================

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnnouncementBanner from "@/components/features/AnnouncementBanner";
import type { Announcement } from "@/types";
import { Search, ArrowRight, Bell, BookOpen, Star, Phone, MapPin, ExternalLink, Code2 } from "lucide-react";
import type { Subject } from "@/types";
import supabase from "@/lib/supabase";

const PALETTES = [
  { bg: "linear-gradient(135deg,#dcfce7,#bbf7d0)", icon: "#15803d", border: "#86efac", text: "#14532d" },
  { bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", icon: "#1d4ed8", border: "#93c5fd", text: "#1e3a8a" },
  { bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", icon: "#7c3aed", border: "#c4b5fd", text: "#4c1d95" },
  { bg: "linear-gradient(135deg,#ffedd5,#fed7aa)", icon: "#c2410c", border: "#fdba74", text: "#7c2d12" },
  { bg: "linear-gradient(135deg,#fce7f3,#fbcfe8)", icon: "#be185d", border: "#f9a8d4", text: "#831843" },
  { bg: "linear-gradient(135deg,#ccfbf1,#99f6e4)", icon: "#0f766e", border: "#5eead4", text: "#134e4a" },
];

function WaIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function HomePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [subjectsRes, announcementsRes] = await Promise.all([
      supabase.from("subjects").select("*").order("created_at", { ascending: true }),
      supabase.from("announcements").select("*").order("created_at", { ascending: false }),
    ]);
    if (announcementsRes.data) {
      setAnnouncements(announcementsRes.data.map((a: any) => ({
        id: a.id, title: a.title, content: a.content,
        type: a.type as Announcement["type"], createdAt: a.created_at,
      })));
    }
    if (subjectsRes.data) {
      setSubjects(subjectsRes.data.map((s: any) => ({
        id: s.id, name: s.name, nameEn: s.name_en, teacher: s.teacher,
        teacherDesignation: s.teacher_designation, icon: s.icon, color: s.color,
        description: s.description, totalClasses: s.total_classes,
        completedClasses: s.completed_classes, createdAt: s.created_at,
      })));
    }
    setLoading(false);
  };

  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.nameEn || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "#fafafa" }}>

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden pt-32 pb-0">
        <div className="absolute inset-0 pointer-events-none" style={{ willChange: "auto" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-25"
            style={{ background: "radial-gradient(ellipse, #dcfce7 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-4 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-5"
            style={{ background: "#dcfce7", border: "1px solid #86efac", color: "#15803d" }}>
            <Star size={12} fill="#15803d" />
            দাখিল ৮ম শ্রেণী • সেশন ২০২৫–২০২৬
            <Star size={12} fill="#15803d" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-3">
            <span className="text-green-gradient">গাজীর চট</span>{" "}
            <span className="text-edu-slate-800">মদিনাতুল উলুম</span>
          </h1>
          <div className="text-xl md:text-2xl font-bold text-edu-slate-600 mb-3">ফাজিল মাদরাসা</div>
          <p className="text-edu-slate-500 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            তোমার সকল পাঠ্যবিষয়, হোমওয়ার্ক, সাজেশন ও নোটিশ এক জায়গায়।
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap mb-10">
            <a href="#subjects" className="btn-primary text-base px-8 py-3.5">
              <BookOpen size={18} /> বিষয় দেখুন
            </a>
            <Link to="/notices" className="btn-outline text-base px-8 py-3.5">
              <Bell size={18} /> নোটিশ বোর্ড
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              { value: subjects.length || "—", label: "বিষয়" },
              { value: "১৫৬", label: "শিক্ষার্থী" },
              { value: "২০২৫", label: "সেশন" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-2xl"
                style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div className="text-xl font-bold text-edu-green-600">{stat.value}</div>
                <div className="text-xs text-edu-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 36, background: "#f0fdf4", clipPath: "ellipse(80% 100% at 50% 100%)" }} />
      </section>

      {/* ══ QUICK NAV ══ */}
      <section className="bg-edu-green-50 py-5 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-4 gap-3">
            {[
              { to: "/notices", emoji: "📢", label: "নোটিশ", color: "#ef4444", bg: "#fef2f2" },
              { to: "/routines", emoji: "📅", label: "রুটিন", color: "#7c3aed", bg: "#ede9fe" },
              { to: "/teachers", emoji: "👨‍🏫", label: "শিক্ষক", color: "#0891b2", bg: "#ecfeff" },
              { to: "/chat", emoji: "💬", label: "চ্যাট", color: "#15803d", bg: "#dcfce7" },
            ].map((item) => (
              <Link key={item.to} to={item.to}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: item.bg, border: `1px solid ${item.color}22` }}>
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs font-semibold" style={{ color: item.color }}>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SUBJECTS ══ */}
      <section id="subjects" className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-3"
              style={{ background: "#dcfce7", color: "#15803d" }}>📚 দাখিল ৮ম শ্রেণী</div>
            <h2 className="text-3xl font-bold text-edu-slate-800 mb-2">
              সকল <span className="text-green-gradient">বিষয়সমূহ</span>
            </h2>
            <p className="text-edu-slate-500 text-sm">প্রতিটি বিষয়ে ক্লিক করে হোমওয়ার্ক ও সাজেশন দেখুন</p>
          </div>

          <AnnouncementBanner announcements={announcements} />

          <div className="relative mb-7 max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-edu-slate-400" />
            <input type="text" placeholder="বিষয় খুঁজুন..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="edu-input pl-11" />
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-3xl p-5 animate-pulse" style={{ background: "#f1f5f9", height: 160 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16"><div className="text-5xl mb-4">🔍</div>
              <div className="text-edu-slate-400 text-lg">কোনো বিষয় পাওয়া যায়নি</div></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((subject, i) => {
                const pal = PALETTES[i % PALETTES.length];
                return (
                  <button key={subject.id} onClick={() => navigate(`/subject/${subject.id}`)}
                    className="text-left rounded-3xl p-5 transition-all duration-250 hover:scale-[1.03] active:scale-[0.97] group"
                    style={{ background: pal.bg, border: `1px solid ${pal.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3"
                      style={{ background: "rgba(255,255,255,0.7)" }}>{subject.icon}</div>
                    <div className="font-bold text-sm leading-tight mb-1" style={{ color: pal.text }}>{subject.name}</div>
                    <div className="text-xs opacity-60 mb-2" style={{ color: pal.text }}>{subject.nameEn}</div>
                    <div className="flex items-center gap-1 text-xs font-semibold transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color: pal.icon }}>বিস্তারিত <ArrowRight size={12} /></div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══ WHATSAPP GROUP ══ */}
      <section className="py-5 px-4" style={{ background: "#f0fdf4" }}>
        <div className="max-w-2xl mx-auto">
          <a href="https://chat.whatsapp.com/E3uwX8AJIxj2YWSp6wmwdG" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, #15803d, #22c55e)", boxShadow: "0 6px 24px rgba(21,128,61,0.3)" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.2)" }}><WaIcon size={24} /></div>
            <div className="flex-1">
              <div className="text-white font-bold text-sm">Join Our Official WhatsApp Group</div>
              <div className="text-white/70 text-xs mt-0.5">সর্বশেষ আপডেট ও নোটিশ পেতে গ্রুপে যোগ দিন</div>
            </div>
            <div className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold text-white"
              style={{ background: "rgba(255,255,255,0.2)" }}>Join →</div>
          </a>
        </div>
      </section>

      {/* ══ QURAN VERSE ══ */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto rounded-3xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, #15803d, #166534)", boxShadow: "0 8px 32px rgba(21,128,61,0.2)" }}>
          <div className="font-arabic text-2xl md:text-3xl text-edu-gold-300 mb-3 leading-loose">
            ﴿ اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ ﴾
          </div>
          <p className="text-white/80 text-sm">"পড়ো তোমার রবের নামে যিনি সৃষ্টি করেছেন।" — সূরা আল-আলাক, আয়াত ১</p>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="py-10 px-4" style={{ background: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-7">
            <h2 className="text-3xl font-bold text-edu-slate-800 mb-2">
              <span className="text-green-gradient">যোগাযোগ</span> করুন
            </h2>
            <p className="text-edu-slate-500 text-sm">মাদরাসার সাথে সরাসরি যোগাযোগ করুন</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="edu-card p-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5 badge-green">
                🕌 সরকারি স্বীকৃত মাদরাসা
              </div>
              <h3 className="text-xl font-bold text-edu-slate-800 mb-1">গাজীর চট মদিনাতুল উলুম</h3>
              <p className="text-edu-green-600 font-semibold text-sm mb-1">ফাজিল মাদরাসা</p>
              <p className="text-edu-slate-400 text-xs mb-5">Gazirchat Madinatul Ulum Fazil Madrasa</p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#dcfce7" }}>
                    <MapPin size={16} className="text-edu-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-edu-slate-400 font-semibold uppercase tracking-wider mb-0.5">ঠিকানা</div>
                    <p className="text-edu-slate-700 text-sm leading-relaxed">মাদ্রাসা রোড, গাজী চট (বাইপাইল),<br />আশুলিয়া, সাভার, ঢাকা।</p>
                  </div>
                </div>
                {["+88 01518-734669", "+8801712-822642"].map((num) => (
                  <a key={num} href={`tel:${num.replace(/[^+\d]/g, "")}`}
                    className="flex items-center gap-3 hover:bg-edu-green-50 p-2 rounded-xl transition-colors -mx-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#dcfce7" }}>
                      <Phone size={16} className="text-edu-green-600" />
                    </div>
                    <span className="text-edu-slate-700 text-sm font-semibold">{num}</span>
                  </a>
                ))}
                <a href="https://chat.whatsapp.com/E3uwX8AJIxj2YWSp6wmwdG" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl transition-all hover:scale-[1.01]"
                  style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#25d366" }}>
                    <WaIcon size={18} />
                  </div>
                  <div>
                    <div className="text-edu-green-700 font-semibold text-sm">Official WhatsApp Group</div>
                    <div className="text-edu-slate-400 text-xs">গ্রুপে যোগ দিন →</div>
                  </div>
                  <ExternalLink size={14} className="text-edu-slate-400 ml-auto" />
                </a>
              </div>
            </div>

            {/* Google Map — lazy load, isolated to prevent GPU glitch */}
            <div className="edu-card overflow-hidden" style={{ minHeight: 320 }}>
              <div className="flex items-center gap-2 px-5 py-3 border-b border-edu-slate-100">
                <MapPin size={14} className="text-edu-green-600" />
                <span className="text-edu-slate-600 text-xs font-semibold">গুগল ম্যাপে লোকেশন</span>
              </div>
              <div style={{ height: 256, position: "relative", background: "#f1f5f9" }}>
                {!mapLoaded ? (
                  <button
                    onClick={() => setMapLoaded(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 transition-colors hover:bg-edu-green-50"
                    style={{ background: "#f0fdf4" }}
                  >
                    <div className="text-4xl">🗺</div>
                    <div className="text-edu-green-700 font-semibold text-sm">ম্যাপ লোড করুন</div>
                    <div className="text-edu-slate-400 text-xs">ক্লিক করলে Google Map লোড হবে</div>
                  </button>
                ) : (
                  <iframe
                    title="Madrasa Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.3!2d90.2993!3d23.8975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDUzJzUxLjAiTiA5MMKwMTcnNTcuNSJF!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                    width="100%" height="256"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
              </div>
              <a href="https://maps.google.com/?q=Gazirchat+Madinatul+Ulum+Fazil+Madrasa+Ashulia+Savar+Dhaka"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-edu-green-600 hover:text-edu-green-700 transition-colors border-t border-edu-slate-100">
                <ExternalLink size={12} /> Google Maps-এ দেখুন
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DEVELOPER SECTION ══ */}
      <section className="py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="edu-card p-6 text-center"
            style={{ background: "linear-gradient(135deg, #f8fafc, #f0fdf4)", border: "1px solid #bbf7d0" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
              style={{ background: "linear-gradient(135deg, #15803d, #22c55e)", boxShadow: "0 4px 16px rgba(21,128,61,0.25)" }}>
              👨‍💻
            </div>
            <div className="text-edu-slate-400 text-xs uppercase tracking-widest font-semibold mb-1">
              Designed & Developed by
            </div>
            <h3 className="text-xl font-bold text-edu-slate-800 mb-0.5">Yeasin Arafat</h3>
            <div className="text-edu-green-600 text-sm font-semibold mb-5">Full Stack Developer</div>
            <a
              href="https://yeasin.freedev.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #15803d, #22c55e)",
                color: "#ffffff",
                boxShadow: "0 4px 16px rgba(21,128,61,0.3)",
              }}
            >
              <Code2 size={15} />
              Visit Website
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
