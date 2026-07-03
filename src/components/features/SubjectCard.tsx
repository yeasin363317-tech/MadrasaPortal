// ============================================================
// SubjectCard — Colorful pastel card (light theme)
// ============================================================

import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Subject } from "@/types";

const PALETTES = [
  { bg: "linear-gradient(135deg,#dcfce7,#bbf7d0)", icon: "#15803d", iconBg: "#dcfce7", border: "#86efac", text: "#14532d" },
  { bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", icon: "#1d4ed8", iconBg: "#dbeafe", border: "#93c5fd", text: "#1e3a8a" },
  { bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", icon: "#7c3aed", iconBg: "#ede9fe", border: "#c4b5fd", text: "#4c1d95" },
  { bg: "linear-gradient(135deg,#ffedd5,#fed7aa)", icon: "#c2410c", iconBg: "#ffedd5", border: "#fdba74", text: "#7c2d12" },
  { bg: "linear-gradient(135deg,#fce7f3,#fbcfe8)", icon: "#be185d", iconBg: "#fce7f3", border: "#f9a8d4", text: "#831843" },
  { bg: "linear-gradient(135deg,#ccfbf1,#99f6e4)", icon: "#0f766e", iconBg: "#ccfbf1", border: "#5eead4", text: "#134e4a" },
];

interface SubjectCardProps {
  subject: Subject;
  index: number;
}

export default function SubjectCard({ subject, index }: SubjectCardProps) {
  const navigate = useNavigate();
  const pal = PALETTES[index % PALETTES.length];

  return (
    <button
      onClick={() => navigate(`/subject/${subject.id}`)}
      className="text-left rounded-3xl p-5 transition-all duration-250 hover:scale-[1.03] active:scale-[0.97] animate-slide-up group w-full"
      style={{
        background: pal.bg,
        border: `1px solid ${pal.border}`,
        animationDelay: `${index * 50}ms`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3"
        style={{ background: "rgba(255,255,255,0.7)" }}>
        {subject.icon}
      </div>
      <div className="font-bold text-sm leading-tight mb-1" style={{ color: pal.text }}>
        {subject.name}
      </div>
      <div className="text-xs opacity-60 mb-3" style={{ color: pal.text }}>
        {subject.nameEn}
      </div>
      <div className="text-xs text-edu-slate-500 line-clamp-2 mb-3">{subject.description}</div>
      <div className="flex items-center gap-1 text-xs font-semibold transition-transform duration-200 group-hover:translate-x-1"
        style={{ color: pal.icon }}>
        বিস্তারিত <ArrowRight size={12} />
      </div>
    </button>
  );
}
