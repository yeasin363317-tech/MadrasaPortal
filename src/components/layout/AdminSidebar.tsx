// ============================================================
// AdminSidebar - Supabase Auth দিয়ে লগআউট
// ============================================================

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, ClipboardList, Lightbulb,
  MessageSquare, LogOut, Shield, X, ChevronRight, User, Bell, Calendar
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { CrescentMoon } from "@/components/layout/IslamicPattern";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/admin/dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { href: "/admin/subjects", label: "বিষয় ম্যানেজ", icon: BookOpen },
  { href: "/admin/homework", label: "হোমওয়ার্ক", icon: ClipboardList },
  { href: "/admin/suggestions", label: "সাজেশন", icon: Lightbulb },
  { href: "/admin/teachers", label: "শিক্ষক", icon: User },
  { href: "/admin/notices", label: "নোটিশ", icon: Bell },
  { href: "/admin/routines", label: "রুটিন", icon: Calendar },
  { href: "/admin/chat", label: "চ্যাট মডারেশন", icon: MessageSquare },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={onClose}
          style={{ backdropFilter: "blur(4px)" }} />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          background: "rgba(5, 18, 10, 0.98)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(201, 162, 39, 0.15)",
        }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #c9a227, #ecc138)" }}>
              <Shield size={18} className="text-madrasa-dark" />
            </div>
            <div>
              <div className="text-warm-white font-bold text-sm">এডমিন প্যানেল</div>
              <div className="text-warm-white/40 text-xs">মাদরাসা পোর্টাল</div>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden p-2 text-warm-white/50 hover:text-warm-white">
            <X size={18} />
          </button>
        </div>

        {/* Admin Info */}
        <div className="mx-4 mt-4 p-4 rounded-2xl"
          style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.15)" }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #c9a227, #ecc138)" }}>
              <span className="text-madrasa-dark font-bold">
                {user?.email?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-warm-white text-sm font-semibold">Admin</div>
              <div className="text-warm-white/40 text-xs truncate">{user?.email || ""}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
          <div className="text-warm-white/30 text-xs uppercase tracking-widest px-4 py-2 font-semibold">
            ম্যানেজমেন্ট
          </div>
          {navItems.map((item) => (
            <Link key={item.href} to={item.href} onClick={onClose}
              className={`admin-nav-link ${isActive(item.href) ? "active" : ""}`}>
              <item.icon size={18} />
              <span className="flex-1 text-sm">{item.label}</span>
              {isActive(item.href) && <ChevronRight size={14} className="text-islamic-gold-400" />}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-warm-white/50 hover:text-warm-white transition-all text-sm"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <CrescentMoon size={16} color="currentColor" />
            ওয়েবসাইটে যান
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm">
            <LogOut size={18} />
            লগআউট
          </button>
        </div>
      </aside>
    </>
  );
}
