// ============================================================
// NotFound - ৪০৪ পেজ
// ============================================================

import { useNavigate } from "react-router-dom";
import IslamicPattern, { CrescentMoon } from "@/components/layout/IslamicPattern";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen islamic-bg flex items-center justify-center px-4">
      <IslamicPattern />
      <div className="text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}>
          <CrescentMoon size={48} />
        </div>
        <div className="text-8xl font-bold text-gold-gradient mb-4">৪০৪</div>
        <h1 className="text-2xl font-bold text-warm-white mb-3">পেজ পাওয়া যায়নি</h1>
        <p className="text-warm-white/50 mb-8 max-w-sm mx-auto">
          আপনি যে পেজটি খুঁজছেন সেটি বিদ্যমান নেই। হোম পেজে ফিরে যান।
        </p>
        <button onClick={() => navigate("/")} className="btn-gold">
          হোমে ফিরুন
        </button>
      </div>
    </div>
  );
}
