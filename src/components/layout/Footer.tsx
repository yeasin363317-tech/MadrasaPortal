// ============================================================
// Footer - ফুটার কম্পোনেন্ট
// ============================================================

import { Link } from "react-router-dom";
import { IslamicBorder, CrescentMoon, StarOrnament } from "@/components/layout/IslamicPattern";
import { Phone, MapPin, BookOpen, Code2, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-islamic-gold-400/20">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(7,26,14,0.8) 100%)" }}
      />

      {/* Mosque Silhouette */}
      <div className="relative">
        <div className="w-full overflow-hidden">
          <svg viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <g fill="#c9a227" opacity="0.08">
              <ellipse cx="600" cy="60" rx="100" ry="80" />
              <rect x="500" y="60" width="200" height="60" />
              <rect x="350" y="20" width="25" height="100" />
              <ellipse cx="362" cy="20" rx="13" ry="18" />
              <rect x="825" y="20" width="25" height="100" />
              <ellipse cx="837" cy="20" rx="13" ry="18" />
              <rect x="200" y="40" width="18" height="80" />
              <ellipse cx="209" cy="40" rx="9" ry="12" />
              <rect x="982" y="40" width="18" height="80" />
              <ellipse cx="991" cy="40" rx="9" ry="12" />
            </g>
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <IslamicBorder />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #c9a227, #ecc138)" }}
              >
                <CrescentMoon size={22} color="#071a0e" />
              </div>
              <div>
                <div className="text-islamic-gold-400 font-bold font-bangla text-sm leading-tight">
                  গাজীর চট মদিনাতুল উলুম
                </div>
                <div className="text-warm-white/50 text-xs">ফাজিল মাদরাসা</div>
              </div>
            </div>
            <p className="text-warm-white/50 text-sm leading-relaxed">
              ইসলামী শিক্ষার আলো ছড়িয়ে দিচ্ছি প্রতিটি শিক্ষার্থীর হৃদয়ে।
            </p>
            <div className="mt-4 font-arabic text-islamic-gold-400 text-xl text-center">
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-islamic-gold-400 font-bold mb-5 flex items-center justify-center gap-2">
              <StarOrnament size={14} /> দ্রুত লিংক <StarOrnament size={14} />
            </h4>
            <div className="space-y-2.5">
              {[
                { to: "/", label: "হোম" },
                { to: "/notices", label: "নোটিশ বোর্ড" },
                { to: "/routines", label: "রুটিন" },
                { to: "/teachers", label: "শিক্ষকবৃন্দ" },
                { to: "/chat", label: "লাইভ চ্যাট" },
                { to: "/#contact", label: "যোগাযোগ" },
                { to: "/admin", label: "এডমিন প্যানেল" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-warm-white/60 hover:text-islamic-gold-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <h4 className="text-islamic-gold-400 font-bold mb-5 flex items-center justify-center md:justify-end gap-2">
              <StarOrnament size={14} /> যোগাযোগ
            </h4>

            {/* Madrasa Name */}
            <div className="mb-4">
              <div className="text-warm-white/80 text-sm font-bold leading-snug">গাজীর চট মদিনাতুল উলুম</div>
              <div className="text-warm-white/80 text-sm font-bold">ফাজিল মাদরাসা</div>
              <div className="text-warm-white/35 text-xs mt-0.5">Gazirchat Madinatul Ulum Fazil Madrasa</div>
            </div>

            <div className="space-y-3">
              {/* Address */}
              <div className="flex items-start gap-2 justify-center md:justify-end text-warm-white/60 text-sm">
                <MapPin size={14} className="text-islamic-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-right leading-relaxed">
                  মাদ্রাসা রোড, গাজী চট (বাইপাইল),<br />
                  আশুলিয়া, সাভার, ঢাকা।
                </span>
              </div>

              {/* Phone 1 */}
              <div className="flex items-center gap-2 justify-center md:justify-end text-warm-white/60 text-sm">
                <Phone size={14} className="text-islamic-gold-400 flex-shrink-0" />
                <a href="tel:+8801518734669" className="hover:text-islamic-gold-400 transition-colors">
                  +88 01518-734669
                </a>
              </div>

              {/* Phone 2 */}
              <div className="flex items-center gap-2 justify-center md:justify-end text-warm-white/60 text-sm">
                <Phone size={14} className="text-islamic-gold-400 flex-shrink-0" />
                <a href="tel:+8801712822642" className="hover:text-islamic-gold-400 transition-colors">
                  +88 01712-822642
                </a>
              </div>

              {/* Session */}
              <div className="flex items-center gap-2 justify-center md:justify-end text-warm-white/60 text-sm">
                <BookOpen size={14} className="text-islamic-gold-400 flex-shrink-0" />
                সেশন: ২০২৫-২০২৬
              </div>

              {/* WhatsApp Group */}
              <div className="flex justify-center md:justify-end mt-1">
                <a
                  href="https://chat.whatsapp.com/E3uwX8AJIxj2YWSp6wmwdG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    background: "rgba(37,211,102,0.1)",
                    border: "1px solid rgba(37,211,102,0.25)",
                    color: "#25d366",
                  }}
                >
                  <MessageCircle size={13} />
                  Official WhatsApp Group
                </a>
              </div>
            </div>
          </div>
        </div>

        <IslamicBorder />

        {/* Developer Credit */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs"
            style={{
              background: "rgba(201,162,39,0.06)",
              border: "1px solid rgba(201,162,39,0.15)",
            }}
          >
            <Code2 size={13} className="text-islamic-gold-400" />
            <span className="text-warm-white/50">Created by</span>
            <span className="text-islamic-gold-400 font-semibold">Developer Yeasin Arafat</span>
          </div>
          <p className="text-warm-white/25 text-xs">
            © {new Date().getFullYear()} গাজীর চট মদিনাতুল উলুম ফাজিল মাদরাসা • All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
