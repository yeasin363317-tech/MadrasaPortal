// ============================================================
// BottomNav — iOS-style floating bottom navigation
// ============================================================

import { Link, useLocation } from "react-router-dom";
import { Home, Bell, BookOpen, GraduationCap, MessageCircle } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";

const navItems = [
  { href: "/", label: "হোম", icon: Home },
  { href: "/notices", label: "নোটিশ", icon: Bell },
  { href: "/routines", label: "রুটিন", icon: BookOpen },
  { href: "/teachers", label: "শিক্ষক", icon: GraduationCap },
  { href: "/chat", label: "চ্যাট", icon: MessageCircle },
];

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <div
      className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 rounded-full text-white font-bold"
      style={{ background: "#ef4444", fontSize: "9px", padding: "0 3px", lineHeight: 1 }}
    >
      {count > 9 ? "9+" : count}
    </div>
  );
}

export default function BottomNav() {
  const location = useLocation();
  const { chatCount, noticesCount } = useNotifications();

  // Hide on admin pages and chat (chat has own fixed layout)
  if (location.pathname.startsWith("/admin") || location.pathname === "/chat") return null;

  return (
    <nav
      className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
      style={{ maxWidth: "480px", margin: "0 auto" }}
    >
      <div
        className="flex items-center justify-around px-2 py-2 rounded-3xl"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = location.pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 flex-1 relative"
              style={{
                background: active ? "linear-gradient(135deg, #15803d, #22c55e)" : "transparent",
                transform: active ? "scale(1.05)" : "scale(1)",
              }}
            >
              <div className="relative">
                <Icon
                  size={active ? 21 : 20}
                  style={{ color: active ? "#ffffff" : "#64748b" }}
                  strokeWidth={active ? 2.5 : 2}
                />
                {href === "/notices" && !active && <Badge count={noticesCount} />}
                {href === "/chat"   && !active && <Badge count={chatCount} />}
              </div>
              <span
                className="text-[10px] font-semibold leading-none"
                style={{ color: active ? "#ffffff" : "#94a3b8" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
