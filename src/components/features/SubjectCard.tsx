// ============================================================
// SubjectCard - বিষয়ের কার্ড কম্পোনেন্ট
// ============================================================

import { useNavigate } from "react-router-dom";
import { User, ArrowRight } from "lucide-react";
import type { Subject } from "@/types";

interface SubjectCardProps {
  subject: Subject;
  index: number;
}

export default function SubjectCard({ subject, index }: SubjectCardProps) {
  const navigate = useNavigate();
  const progress = Math.round((subject.completedClasses / subject.totalClasses) * 100);

  const getDelay = () => `${index * 80}ms`;

  return (
    <div
      className="glass-card p-6 flex flex-col gap-4 animate-slide-up"
      style={{ animationDelay: getDelay() }}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 font-arabic shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${subject.color}22, ${subject.color}44)`,
            border: `1px solid ${subject.color}44`,
            color: subject.color,
          }}
        >
          {subject.icon}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3 className="text-warm-white font-bold text-lg leading-tight mb-1 font-bangla">
            {subject.name}
          </h3>
          <span className="text-warm-white/40 text-xs font-mono">{subject.nameEn}</span>
        </div>


      </div>

      {/* Description */}
      <p className="text-warm-white/60 text-sm leading-relaxed line-clamp-2">
        {subject.description}
      </p>

      {/* Teacher Info */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
        style={{ background: "rgba(201, 162, 39, 0.08)", border: "1px solid rgba(201, 162, 39, 0.15)" }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #c9a22722, #c9a22744)" }}>
          <User size={14} className="text-islamic-gold-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-warm-white text-sm font-semibold truncate">{subject.teacher}</div>
          <div className="text-warm-white/40 text-xs">{subject.teacherDesignation}</div>
        </div>
      </div>



      {/* Details Button */}
      <button
        onClick={() => navigate(`/subject/${subject.id}`)}
        className="btn-gold w-full flex items-center justify-center gap-2 text-sm group mt-1"
      >
        <span>বিস্তারিত দেখুন</span>
        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
}
