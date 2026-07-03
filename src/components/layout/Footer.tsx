// ============================================================
// Footer — Minimal modern light-theme footer
// ============================================================

import { Link } from "react-router-dom";
import { Phone, MapPin, MessageCircle, Code2 } from "lucide-react";

const WA_GROUP_LINK = "https://chat.whatsapp.com/E3uwX8AJIxj2YWSp6wmwdG";

function WaIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-edu-slate-800 text-white mt-0">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: "linear-gradient(135deg,#15803d,#22c55e)" }}>
                🕌
              </div>
              <div>
                <div className="font-bold text-sm leading-tight">গাজীর চট মদিনাতুল উলুম</div>
                <div className="text-white/50 text-xs">ফাজিল মাদরাসা</div>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              দাখিল ৮ম শ্রেণীর শিক্ষার্থীদের জন্য আধুনিক শিক্ষা পোর্টাল।
            </p>
            <div className="mt-4 font-arabic text-edu-gold-400 text-lg">
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white/80 mb-4 text-sm uppercase tracking-wider">দ্রুত লিংক</h4>
            <div className="space-y-2.5">
              {[
                { to: "/", label: "হোম" },
                { to: "/notices", label: "নোটিশ বোর্ড" },
                { to: "/routines", label: "রুটিন" },
                { to: "/teachers", label: "শিক্ষকবৃন্দ" },
                { to: "/chat", label: "লাইভ চ্যাট" },
                { to: "/admin", label: "এডমিন প্যানেল" },
              ].map((link) => (
                <Link key={link.to} to={link.to}
                  className="block text-white/50 hover:text-edu-green-400 transition-colors text-sm">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white/80 mb-4 text-sm uppercase tracking-wider">যোগাযোগ</h4>
            <div className="space-y-3">
              <div className="text-sm font-bold text-white/90">গাজীর চট মদিনাতুল উলুম ফাজিল মাদরাসা</div>
              <div className="text-white/35 text-xs">Gazirchat Madinatul Ulum Fazil Madrasa</div>

              <div className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin size={14} className="text-edu-green-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">মাদ্রাসা রোড, গাজী চট (বাইপাইল),<br />আশুলিয়া, সাভার, ঢাকা।</span>
              </div>

              {["+88 01518-734669", "+8801712-822642"].map((num) => (
                <a key={num} href={`tel:${num.replace(/[^+\d]/g, "")}`}
                  className="flex items-center gap-2 text-white/60 hover:text-edu-green-400 transition-colors text-sm">
                  <Phone size={14} className="text-edu-green-400 flex-shrink-0" />
                  {num}
                </a>
              ))}

              <a href={WA_GROUP_LINK} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
                <WaIcon size={13} /> Official WhatsApp Group
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} গাজীর চট মদিনাতুল উলুম ফাজিল মাদরাসা
          </p>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <Code2 size={12} className="text-edu-green-400" />
            Created by <span className="text-edu-green-400 font-semibold">Developer Yeasin Arafat</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
