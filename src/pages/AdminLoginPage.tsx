// ============================================================
// AdminLoginPage - Supabase Auth দিয়ে Admin Login
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle } from "lucide-react";
import IslamicPattern, { IslamicBorder, CrescentMoon } from "@/components/layout/IslamicPattern";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [isAdmin, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen islamic-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-islamic-gold-400/30 border-t-islamic-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Admin login attempt:", email);

    const success = await login(email, password);

    if (success) {
      console.log("Admin login successful");
      navigate("/admin/dashboard");
    } else {
      setError("ইমেইল বা পাসওয়ার্ড সঠিক নয়। Supabase Authentication এ রেজিস্টার্ড অ্যাকাউন্ট ব্যবহার করুন।");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen islamic-bg flex items-center justify-center px-4" style={{ paddingTop: "5rem" }}>
      <IslamicPattern />

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse-gold"
            style={{ background: "linear-gradient(135deg, #c9a227, #ecc138)" }}>
            <Shield size={36} className="text-madrasa-dark" />
          </div>
          <h1 className="text-2xl font-bold text-warm-white mb-1">এডমিন প্যানেল</h1>
          <p className="text-warm-white/50 text-sm">গাজীর চট মদিনাতুল উলুম ফাজিল মাদরাসা</p>
          <IslamicBorder />
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <div className="font-arabic text-center text-islamic-gold-400 text-xl mb-6">
            بِسْمِ اللهِ
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-warm-white/70 text-sm font-medium mb-2">
                ইমেইল ঠিকানা
              </label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@madrasa.edu"
                  className="input-islamic pl-11"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-warm-white/70 text-sm font-medium mb-2">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-white/30" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-islamic pl-11 pr-12"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-white/30 hover:text-warm-white/70 transition-colors">
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl animate-slide-up"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 py-4 text-base">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-madrasa-dark border-t-transparent rounded-full animate-spin" />
                  <span>লগইন হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Shield size={18} />
                  <span>এডমিন লগইন</span>
                </>
              )}
            </button>
          </form>

          {/* Info about Supabase auth */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.15)" }}>
            <div className="text-warm-white/50 text-xs text-center mb-2 font-semibold uppercase tracking-wider">লগইন তথ্য</div>
            <p className="text-warm-white/50 text-xs text-center leading-relaxed">
              Supabase Dashboard → Authentication → Users এ গিয়ে Admin অ্যাকাউন্ট তৈরি করুন, তারপর সেই ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন।
            </p>
          </div>
        </div>

        <p className="text-center text-warm-white/30 text-xs mt-6">
          শুধুমাত্র অনুমোদিত ব্যক্তির জন্য প্রবেশাধিকার সংরক্ষিত
        </p>
      </div>
    </div>
  );
}
