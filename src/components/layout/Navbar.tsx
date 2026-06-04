// ============================================================
// Navbar - মূল নেভিগেশন বার
// ============================================================

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, MessageCircle, Shield, Bell, Calendar, GraduationCap } from "lucide-react";
import { CrescentMoon } from "@/components/layout/IslamicPattern";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "হোম", icon: Home },
    { href: "/notices", label: "নোটিশ বোর্ড", icon: Bell },
    { href: "/routines", label: "রুটিন", icon: Calendar },
    { href: "/teachers", label: "শিক্ষকবৃন্দ", icon: GraduationCap },
    { href: "/chat", label: "লাইভ চ্যাট", icon: MessageCircle },
    { href: "/admin", label: "এডমিন", icon: Shield },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl border-b border-islamic-gold-400/20"
          : ""
      }`}
      style={{
        background: scrolled
          ? "rgba(7, 26, 14, 0.95)"
          : "transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #c9a227, #ecc138)" }}>
                <CrescentMoon size={24} color="#071a0e" />
              </div>
              <div className="absolute inset-0 rounded-full animate-pulse-gold" />
            </div>
            <div>
              <div className="text-sm font-bold text-islamic-gold-400 leading-tight font-bangla">
                গাজীর চট মদিনাতুল উলুম
              </div>
              <div className="text-xs text-warm-white/60">ফাজিল মাদরাসা • দাখিল ৮ম শ্রেণী</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-islamic-gold-400/20 text-islamic-gold-400 border border-islamic-gold-400/30"
                    : "text-warm-white/70 hover:text-warm-white hover:bg-white/5"
                }`}
              >
                <link.icon size={15} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2.5 rounded-xl text-warm-white/70 hover:text-warm-white hover:bg-white/10 transition-all"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="মেনু"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="md:hidden py-4 border-t border-white/10 animate-slide-up"
            style={{ background: "rgba(7, 26, 14, 0.98)", backdropFilter: "blur(20px)" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3.5 mx-2 rounded-xl mb-1 text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? "bg-islamic-gold-400/20 text-islamic-gold-400"
                    : "text-warm-white/70"
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
