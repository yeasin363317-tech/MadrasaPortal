// ============================================================
// IslamicPattern - SVG ভিত্তিক ইসলামিক প্যাটার্ন কম্পোনেন্ট
// ============================================================

interface IslamicPatternProps {
  className?: string;
  opacity?: number;
}

export default function IslamicPattern({ className = "", opacity = 0.07 }: IslamicPatternProps) {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`} style={{ opacity }}>
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="islamic-geo" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Islamic 8-pointed star */}
            <g fill="none" stroke="#c9a227" strokeWidth="0.8">
              {/* Outer octagon */}
              <polygon points="50,10 70,20 90,20 100,40 90,60 70,60 50,70 30,60 10,60 0,40 10,20 30,20" />
              {/* Inner star */}
              <polygon points="50,20 60,30 70,30 70,40 60,50 50,60 40,50 30,40 30,30 40,30" />
              {/* Center diamond */}
              <polygon points="50,35 57,42 50,49 43,42" />
              {/* Cross lines */}
              <line x1="50" y1="10" x2="50" y2="90" />
              <line x1="10" y1="50" x2="90" y2="50" />
              <line x1="20" y1="20" x2="80" y2="80" />
              <line x1="80" y1="20" x2="20" y2="80" />
              {/* Small decorative circles */}
              <circle cx="50" cy="50" r="5" />
              <circle cx="50" cy="10" r="2" />
              <circle cx="50" cy="90" r="2" />
              <circle cx="10" cy="50" r="2" />
              <circle cx="90" cy="50" r="2" />
            </g>
          </pattern>

          <pattern id="islamic-arabesque" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#c9a227" strokeWidth="0.5">
              {/* Arabesque flower */}
              <circle cx="30" cy="30" r="15" strokeDasharray="3,3" />
              <circle cx="30" cy="30" r="8" />
              <circle cx="30" cy="30" r="3" fill="#c9a227" />
              {/* Petal lines */}
              <line x1="30" y1="15" x2="30" y2="5" />
              <line x1="30" y1="45" x2="30" y2="55" />
              <line x1="15" y1="30" x2="5" y2="30" />
              <line x1="45" y1="30" x2="55" y2="30" />
              <line x1="19" y1="19" x2="12" y2="12" />
              <line x1="41" y1="19" x2="48" y2="12" />
              <line x1="19" y1="41" x2="12" y2="48" />
              <line x1="41" y1="41" x2="48" y2="48" />
            </g>
          </pattern>
        </defs>

        {/* Main pattern */}
        <rect width="100%" height="100%" fill="url(#islamic-arabesque)" />
      </svg>
    </div>
  );
}

// Decorative star ornament component
export function StarOrnament({ size = 24, color = "#c9a227" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L13.5 9.5L21 8L14.5 13L17 21L12 16L7 21L9.5 13L3 8L10.5 9.5L12 2Z" />
    </svg>
  );
}

// Islamic geometric border
export function IslamicBorder() {
  return (
    <div className="w-full flex items-center justify-center gap-2 my-6">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #c9a227)" }} />
      <StarOrnament size={16} />
      <div className="font-arabic text-islamic-gold-400 text-lg px-2">✦</div>
      <StarOrnament size={16} />
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #c9a227, transparent)" }} />
    </div>
  );
}

// Crescent Moon SVG
export function CrescentMoon({ size = 32, color = "#c9a227" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12c2.8 0 5.4-1 7.5-2.6-1-.3-2-.5-3-.5-5.5 0-10-4.5-10-10 0-4.2 2.6-7.8 6.3-9.4C16.5 4.1 16.3 4 16 4z" />
    </svg>
  );
}

// Mosque silhouette SVG
export function MosqueSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill="#c9a227" opacity="0.3">
        {/* Main dome */}
        <ellipse cx="200" cy="70" rx="60" ry="55" />
        <rect x="140" y="70" width="120" height="80" />
        {/* Left minaret */}
        <rect x="80" y="30" width="20" height="120" />
        <ellipse cx="90" cy="30" rx="10" ry="15" />
        <rect x="86" y="15" width="8" height="15" />
        {/* Right minaret */}
        <rect x="300" y="30" width="20" height="120" />
        <ellipse cx="310" cy="30" rx="10" ry="15" />
        <rect x="306" y="15" width="8" height="15" />
        {/* Door */}
        <path d="M185 150 L185 110 Q200 95 215 110 L215 150 Z" fill="#071a0e" />
        {/* Windows */}
        <circle cx="165" cy="90" r="8" fill="#071a0e" />
        <circle cx="235" cy="90" r="8" fill="#071a0e" />
      </g>
    </svg>
  );
}
