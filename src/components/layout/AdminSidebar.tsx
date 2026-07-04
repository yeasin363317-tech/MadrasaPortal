// ============================================================
// AdminSidebar — Premium light theme sidebar
// ============================================================

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, ClipboardList, Lightbulb,
  MessageSquare, LogOut, Shield, X, ChevronRight, User, Bell, Calendar, Home
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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
        <div className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ background: "#ffffff", borderRight: "1px solid #e2e8f0", boxShadow: "2px 0 20px rgba(0,0,0,0.08)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-edu-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #15803d, #22c55e)", boxShadow: "0 4px 12px rgba(21,128,61,0.3)" }}>
              🕌
            </div>
            <div>
              <div className="text-edu-slate-800 font-bold text-sm">এডমিন প্যানেল</div>
              <div className="text-edu-slate-400 text-xs">মাদরাসা পোর্টাল</div>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden p-2 rounded-xl text-edu-slate-400 hover:bg-edu-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Admin Info */}
        <div className="mx-4 mt-4 p-4 rounded-2xl" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #15803d, #22c55e)" }}>
              <span className="text-white font-bold text-sm">
                {user?.email?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-edu-slate-800 text-sm font-semibold">Admin</div>
              <div className="text-edu-slate-400 text-xs truncate">{user?.email || ""}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
          <div className="text-edu-slate-400 text-xs uppercase tracking-widest px-3 py-2 font-semibold">ম্যানেজমেন্ট</div>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} to={item.href} onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium"
                style={{
                  background: active ? "#f0fdf4" : "transparent",
                  color: active ? "#15803d" : "#64748b",
                  borderLeft: active ? "3px solid #15803d" : "3px solid transparent",
                }}>
                <item.icon size={17} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={14} className="text-edu-green-600" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-edu-slate-100 space-y-2">
          <Link to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-edu-slate-500 hover:bg-edu-slate-100 hover:text-edu-slate-700 transition-all text-sm"
            style={{ border: "1px solid #e2e8f0" }}>
            <Home size={16} />
            ওয়েবসাইটে যান
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm">
            <LogOut size={17} />
            লগআউট
          </button>
        </div>
      </aside>
    </>
  );
}
