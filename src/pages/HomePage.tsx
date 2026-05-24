// ============================================================
// HomePage - Supabase থেকে ডেটা লোড করে দেখায়
// ============================================================

import { useState, useEffect } from "react";
import { Search, BookOpen, Users, Award, Calendar, Star, ChevronDown, Bell, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import SubjectCard from "@/components/features/SubjectCard";
import AnnouncementBanner from "@/components/features/AnnouncementBanner";
import IslamicPattern, { IslamicBorder, StarOrnament, MosqueSilhouette } from "@/components/layout/IslamicPattern";
import type { Subject, Announcement } from "@/types";
import heroBanner from "@/assets/hero-banner.jpg";
import supabase from "@/lib/supabase";

export default function HomePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const [subjectsRes, announcementsRes] = await Promise.all([
      supabase.from("subjects").select("*").order("created_at", { ascending: true }),
      supabase.from("announcements").select("*").order("created_at", { ascending: false }),
    ]);

    if (subjectsRes.data) setSubjects(mapSubjects(subjectsRes.data));
    if (announcementsRes.data) setAnnouncements(mapAnnouncements(announcementsRes.data));

    console.log("HomePage data loaded:", subjectsRes.data?.length, "subjects");
    setLoading(false);
  };

  // Map Supabase snake_case to camelCase
  const mapSubjects = (data: any[]): Subject[] =>
    data.map((s) => ({
      id: s.id,
      name: s.name,
      nameEn: s.name_en,
      teacher: s.teacher,
      teacherDesignation: s.teacher_designation,
      icon: s.icon,
      color: s.color,
      description: s.description,
      totalClasses: s.total_classes,
      completedClasses: s.completed_classes,
      createdAt: s.created_at,
    }));

  const mapAnnouncements = (data: any[]): Announcement[] =>
    data.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      type: a.type as Announcement["type"],
      createdAt: a.created_at,
    }));

  const filters = [
    { id: "all", label: "সব বিষয়" },
    { id: "islamic", label: "ইসলামী বিষয়" },
    { id: "general", label: "সাধারণ বিষয়" },
  ];

  const islamicKeywords = ["কুরআন", "আকাইদ", "ফিকহ", "হাদিস", "আরবি"];

  const filteredSubjects = subjects.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const isIslamic = islamicKeywords.some((k) => s.name.includes(k));
    const matchFilter =
      activeFilter === "all" ||
      (activeFilter === "islamic" && isIslamic) ||
      (activeFilter === "general" && !isIslamic);
    return matchSearch && matchFilter;
  });

  const stats = [
    { label: "মোট বিষয়", value: subjects.length || "—", icon: BookOpen, color: "#c9a227" },
    { label: "মোট শিক্ষার্থী", value: "১৫৬", icon: Users, color: "#2d9d64" },
    { label: "শিক্ষক", value: subjects.length || "—", icon: Award, color: "#c9a227" },
    { label: "সেশন", value: "২০২৫-২৬", icon: Calendar, color: "#2d9d64" },
  ];

  return (
    <div className="min-h-screen islamic-bg">
      <IslamicPattern />

      {/* ===== HERO SECTION ===== */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="মাদরাসা ব্যানার" className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(7,26,14,0.6) 0%, rgba(7,26,14,0.85) 60%, rgba(7,26,14,1) 100%)" }}
          />
        </div>

        <div className="absolute top-32 left-8 animate-float opacity-30" style={{ animationDelay: "0s" }}>
          <StarOrnament size={30} />
        </div>
        <div className="absolute top-48 right-12 animate-float opacity-20" style={{ animationDelay: "1s" }}>
          <StarOrnament size={20} />
        </div>
        <div className="absolute bottom-40 left-16 animate-float opacity-25" style={{ animationDelay: "2s" }}>
          <StarOrnament size={24} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <div className="font-arabic text-3xl md:text-4xl text-islamic-gold-400 mb-4 animate-slide-up">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </div>
          <div className="islamic-divider mb-6">
            <span className="text-warm-white/70 text-xs tracking-widest uppercase">Madrasa Portal</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-warm-white mb-4 leading-tight animate-slide-up font-bangla"
            style={{ animationDelay: "0.1s" }}>
            <span className="text-gold-gradient">গাজীর চট</span>{" "}
            <br className="md:hidden" />
            মদিনাতুল উলুম
          </h1>
          <div className="text-xl md:text-2xl text-islamic-gold-400 font-semibold mb-3 animate-slide-up font-bangla"
            style={{ animationDelay: "0.2s" }}>
            ফাজিল মাদরাসা
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 animate-slide-up"
            style={{ background: "rgba(201, 162, 39, 0.15)", border: "1px solid rgba(201, 162, 39, 0.3)", animationDelay: "0.3s" }}>
            <Star size={14} className="text-islamic-gold-400 fill-islamic-gold-400" />
            <span className="text-islamic-gold-300 text-sm font-semibold">দাখিল ৮ম শ্রেণী পোর্টাল • সেশন ২০২৫-২০২৬</span>
            <Star size={14} className="text-islamic-gold-400 fill-islamic-gold-400" />
          </div>
          <p className="text-warm-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up font-bangla"
            style={{ animationDelay: "0.4s" }}>
            জ্ঞান ও ইমানের আলোয় আলোকিত হও। এখানে পাবে সকল বিষয়ের তথ্য, হোমওয়ার্ক, পরীক্ষার সাজেশন এবং লাইভ চ্যাট সুবিধা।
          </p>
          <div className="flex items-center justify-center gap-2 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <a href="#subjects" className="btn-gold px-8 py-3.5">বিষয়সমূহ দেখুন</a>
            <a href="#subjects"
              className="px-6 py-3.5 rounded-xl font-semibold text-warm-white/80 transition-all duration-300 hover:text-warm-white"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
              আরও জানুন
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
          <ChevronDown size={28} className="text-islamic-gold-400" />
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <MosqueSilhouette className="w-full max-h-32" />
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-10" id="stats">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="glass-card p-5 text-center animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: `${stat.color}22`, border: `1px solid ${stat.color}33` }}>
                <stat.icon size={22} style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-bold text-warm-white mb-1">{stat.value}</div>
              <div className="text-warm-white/50 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== WHATSAPP GROUP BOX ===== */}
      <WhatsAppGroupBox />

      {/* ===== SUBJECTS SECTION ===== */}
      <section id="subjects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <AnnouncementBanner announcements={announcements} />

        {/* Quick link to notices board */}
        <div className="flex justify-center mb-10">
          <Link to="/notices"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.25)", color: "#c9a227" }}>
            <Bell size={15} />
            সকল নোটিশ ও বিজ্ঞপ্তি দেখুন
            <span className="text-xs opacity-60">→</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <StarOrnament size={18} />
            <span className="text-islamic-gold-400 text-sm uppercase tracking-widest font-semibold">দাখিল ৮ম শ্রেণী</span>
            <StarOrnament size={18} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-warm-white mb-4 font-bangla">
            সকল <span className="text-gold-gradient">বিষয়সমূহ</span>
          </h2>
          <p className="text-warm-white/50 text-sm max-w-lg mx-auto">
            প্রতিটি বিষয়ের কার্ডে ক্লিক করে বিস্তারিত তথ্য, হোমওয়ার্ক ও সাজেশন দেখুন
          </p>
          <IslamicBorder />
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-white/40" />
            <input
              type="text"
              placeholder="বিষয় বা শিক্ষকের নাম খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-islamic pl-11"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button key={f.id} onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeFilter === f.id ? "btn-gold" : "text-warm-white/60 hover:text-warm-white"}`}
                style={activeFilter !== f.id ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" } : {}}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-16 bg-white/5 rounded-2xl mb-4" />
                <div className="h-4 bg-white/5 rounded mb-2" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject, index) => (
              <SubjectCard key={subject.id} subject={subject} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <div className="text-warm-white/40 text-lg">কোনো বিষয় পাওয়া যায়নি</div>
          </div>
        )}

        {/* Quran Verse */}
        <div className="mt-20 text-center glass-card p-10 max-w-2xl mx-auto">
          <div className="font-arabic text-2xl md:text-3xl text-islamic-gold-400 mb-4 leading-loose">
            ﴿ اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ ﴾
          </div>
          <IslamicBorder />
          <p className="text-warm-white/60 text-sm">
            "পড়ো তোমার রবের নামে যিনি সৃষ্টি করেছেন।" — সূরা আল-আলাক, আয়াত ১
          </p>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <ContactSection />
    </div>
  );
}

// ── WhatsApp Group Box ──────────────────────────────────────
const WA_GROUP_LINK = "https://chat.whatsapp.com/E3uwX8AJIxj2YWSp6wmwdG";

function WhatsAppGroupIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function WhatsAppGroupBox() {
  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 mt-10 mb-4">
      <a
        href={WA_GROUP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-full rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.015] active:scale-[0.99]"
        style={{
          background: "linear-gradient(135deg, rgba(7,26,14,0.95) 0%, rgba(13,60,30,0.95) 100%)",
          border: "1px solid rgba(37,211,102,0.3)",
          boxShadow: "0 4px 24px rgba(37,211,102,0.12), 0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {/* Glow ring animation */}
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            boxShadow: "0 0 0 0 rgba(37,211,102,0.35)",
            animation: "wa-group-pulse 2.4s ease-out infinite",
          }}
        />

        <div className="relative flex items-center gap-4 px-5 py-4 sm:px-7 sm:py-5">
          {/* Icon */}
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: "linear-gradient(135deg, #25d366, #128c7e)",
              boxShadow: "0 4px 16px rgba(37,211,102,0.4)",
            }}
          >
            <WhatsAppGroupIcon size={26} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="text-warm-white font-bold text-base sm:text-lg leading-tight">
              Join Our Official WhatsApp Group
            </div>
            <div className="text-warm-white/50 text-xs sm:text-sm mt-0.5">
              গ্রুপে যোগ দিন · সর্বশেষ আপডেট পান
            </div>
          </div>

          {/* Arrow badge */}
          <div
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 group-hover:gap-2.5"
            style={{
              background: "rgba(37,211,102,0.15)",
              border: "1px solid rgba(37,211,102,0.3)",
              color: "#25d366",
            }}
          >
            <span className="hidden sm:inline">Join Now</span>
            <ExternalLink size={13} />
          </div>
        </div>
      </a>

      <style>{`
        @keyframes wa-group-pulse {
          0%   { box-shadow: 0 0 0 0   rgba(37,211,102,0.35); }
          70%  { box-shadow: 0 0 0 10px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0   rgba(37,211,102,0); }
        }
      `}</style>
    </div>
  );
}

// ── Contact Section ──────────────────────────────────────────
function ContactSection() {
  return (
    <section
      id="contact"
      className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      {/* Section Heading */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <StarOrnament size={18} />
          <span className="text-islamic-gold-400 text-xs uppercase tracking-widest font-semibold">
            যোগাযোগ
          </span>
          <StarOrnament size={18} />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-warm-white mb-3 font-bangla">
          <span className="text-gold-gradient">আমাদের সাথে</span> যোগাযোগ করুন
        </h2>
        <p className="text-warm-white/45 text-sm max-w-lg mx-auto">
          যেকোনো প্রয়োজনে সরাসরি মাদরাসায় যোগাযোগ করুন বা নিচের মানচিত্র দেখুন।
        </p>
        <IslamicBorder />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Info Card ── */}
        <div className="glass-card p-7 flex flex-col gap-6">
          {/* Madrasa Name */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
              style={{
                background: "rgba(201,162,39,0.1)",
                border: "1px solid rgba(201,162,39,0.25)",
                color: "#c9a227",
              }}
            >
              <span>🕌</span> সরকারি স্বীকৃত মাদরাসা
            </div>
            <h3 className="text-warm-white font-bold text-xl leading-snug font-bangla">
              গাজীর চট মদিনাতুল উলুম
            </h3>
            <p className="text-islamic-gold-400 font-semibold text-sm">ফাজিল মাদরাসা</p>
            <p className="text-warm-white/40 text-xs mt-0.5">Gazirchat Madinatul Ulum Fazil Madrasa</p>
          </div>

          <IslamicBorder />

          {/* Address */}
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}
            >
              <MapPin size={18} className="text-islamic-gold-400" />
            </div>
            <div>
              <div className="text-warm-white/40 text-xs font-semibold uppercase tracking-wider mb-1">ঠিকানা</div>
              <p className="text-warm-white/80 text-sm leading-relaxed">
                মাদ্রাসা রোড, গাজী চট (বাইপাইল),<br />
                আশুলিয়া, সাভার, ঢাকা।
              </p>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(45,157,100,0.1)", border: "1px solid rgba(45,157,100,0.2)" }}
            >
              <Phone size={18} className="text-islamic-green-400" />
            </div>
            <div>
              <div className="text-warm-white/40 text-xs font-semibold uppercase tracking-wider mb-2">মোবাইল</div>
              <div className="space-y-1.5">
                {["+88 01518-734669", "+8801712-822642"].map((num) => (
                  <a
                    key={num}
                    href={`tel:${num.replace(/[^+\d]/g, "")}`}
                    className="flex items-center gap-2 text-warm-white/80 hover:text-islamic-gold-400 transition-colors text-sm group/phone"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover/phone:scale-125"
                      style={{ background: "#2d9d64" }}
                    />
                    {num}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp Group shortcut */}
          <a
            href={WA_GROUP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "rgba(37,211,102,0.07)",
              border: "1px solid rgba(37,211,102,0.2)",
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#25d366,#128c7e)" }}
            >
              <WhatsAppGroupIcon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-warm-white/80 text-xs font-semibold">Official WhatsApp Group</div>
              <div className="text-warm-white/35 text-[11px] truncate">{WA_GROUP_LINK}</div>
            </div>
            <ExternalLink size={13} className="text-warm-white/30 flex-shrink-0" />
          </a>
        </div>

        {/* ── Map Card ── */}
        <div
          className="glass-card overflow-hidden flex flex-col"
          style={{ minHeight: "340px" }}
        >
          <div
            className="flex items-center gap-2 px-5 py-3 border-b flex-shrink-0"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          >
            <MapPin size={14} className="text-islamic-gold-400" />
            <span className="text-warm-white/60 text-xs font-semibold">গুগল ম্যাপে দেখুন</span>
          </div>
          <div className="flex-1 relative" style={{ minHeight: "280px" }}>
            <iframe
              title="Gazirchat Madinatul Ulum Fazil Madrasa Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.3!2d90.2993!3d23.8975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDUzJzUxLjAiTiA5MMKwMTcnNTcuNSJF!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd&q=Gazirchat+Madinatul+Ulum+Fazil+Madrasa+Ashulia+Savar+Dhaka"
              width="100%"
              height="100%"
              style={{ border: 0, position: "absolute", inset: 0, filter: "invert(0.85) hue-rotate(145deg) saturate(0.7) brightness(0.85)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href="https://maps.google.com/?q=Gazirchat+Madinatul+Ulum+Fazil+Madrasa+Ashulia+Savar+Dhaka"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-islamic-gold-400 hover:text-islamic-gold-300 transition-colors flex-shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <ExternalLink size={12} />
            Google Maps-এ বড় করে দেখুন
          </a>
        </div>
      </div>
    </section>
  );
}
