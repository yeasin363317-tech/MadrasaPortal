// ============================================================
// Navbar — Floating rounded premium header (Light Theme)
// Auto-hide on scroll-down, show on scroll-up / tap
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, MessageCircle, Bell, Calendar, GraduationCap, Shield } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // visible = whether header is shown (translateY 0 vs -100%)
  const [visible, setVisible] = useState(true);
  const location = useLocation();

  const lastScrollY = useRef(0);
  // Track how many px the user has scrolled upward continuously
  const scrollUpAccum = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ticking = useRef(false);

  // Clear auto-hide timer helper
  const clearHideTimer = useCallback(() => {
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
  }, []);

  // Start the auto-hide timer (used when at top or after showing header)
  const startHideTimer = useCallback(() => {
    clearHideTimer();
    hideTimer.current = setTimeout(() => setVisible(false), 1800);
  }, [clearHideTimer]);

  // Show header explicitly (e.g. on route change or initial load)
  const showHeader = useCallback(() => {
    setVisible(true);
    clearHideTimer();
    if (window.scrollY < 40) {
      startHideTimer();
    }
  }, [clearHideTimer, startHideTimer]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (currentY < 10) {
          // At the very top — always show, start auto-hide
          setVisible(true);
          setScrolled(false);
          scrollUpAccum.current = 0;
          startHideTimer();
        } else if (delta > 4) {
          // Scrolling DOWN — hide header immediately, reset upward accumulator
          clearHideTimer();
          setVisible(false);
          setScrolled(true);
          scrollUpAccum.current = 0;
        } else if (delta < -3) {
          // Scrolling UP — accumulate; only show after 90px upward movement
          scrollUpAccum.current += Math.abs(delta);
          if (scrollUpAccum.current >= 90) {
            clearHideTimer();
            setVisible(true);
            setScrolled(true);
            // Auto-hide after 2s if no further scroll-up activity
            startHideTimer();
          }
        } else {
          // Very small movement — don't reset accumulator, don't act
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearHideTimer();
    };
  }, [clearHideTimer, startHideTimer]);

  // Close mobile menu and show header on route change
  useEffect(() => {
    setIsOpen(false);
    scrollUpAccum.current = 0;
    showHeader();
  }, [location, showHeader]);

  const navLinks = [
    { href: "/", label: "হোম", icon: Home },
    { href: "/notices", label: "নোটিশ", icon: Bell },
    { href: "/routines", label: "রুটিন", icon: Calendar },
    { href: "/teachers", label: "শিক্ষক", icon: GraduationCap },
    { href: "/chat", label: "চ্যাট", icon: MessageCircle },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* ── Main Nav Bar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 ${
          scrolled ? "py-2" : "py-3"
        }`}
        style={{
          background: scrolled ? "#ffffff" : "rgba(255,255,255,0.97)",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 60px)",
          // Smooth slide-up/down — only on mobile (md breakpoint handled via CSS)
          transform: visible ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 350ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms ease, background 300ms ease",
          willChange: "transform",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #15803d, #22c55e)", boxShadow: "0 4px 12px rgba(21,128,61,0.3)" }}
            >
              🕌
            </div>
            <div className="hidden sm:block">
              <div className="text-edu-green-600 font-bold text-sm leading-tight">গাজীর চট মদিনাতুল উলুম</div>
              <div className="text-edu-slate-400 text-xs">ফাজিল মাদরাসা • দাখিল ৮ম</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-edu-green-600 text-white shadow-green"
                    : "text-edu-slate-600 hover:bg-edu-green-50 hover:text-edu-green-600"
                }`}
              >
                <link.icon size={15} />
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-edu-slate-500 hover:bg-edu-slate-100 transition-all"
            >
              <Shield size={14} />
              এডমিন
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ background: isOpen ? "#15803d" : "#f0fdf4", color: isOpen ? "white" : "#15803d" }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="মেনু"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div
            className="md:hidden mx-4 mb-3 rounded-2xl overflow-hidden animate-slide-down"
            style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
          >
            <div className="p-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive(link.href)
                      ? "bg-edu-green-50 text-edu-green-700"
                      : "text-edu-slate-600 hover:bg-edu-slate-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isActive(link.href) ? "bg-edu-green-600 text-white" : "bg-edu-slate-100 text-edu-slate-500"
                    }`}
                  >
                    <link.icon size={16} />
                  </div>
                  {link.label}
                </Link>
              ))}
              <div className="pt-1 border-t border-edu-slate-100">
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-edu-slate-500 hover:bg-edu-slate-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-edu-slate-100 text-edu-slate-500">
                    <Shield size={16} />
                  </div>
                  এডমিন প্যানেল
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
