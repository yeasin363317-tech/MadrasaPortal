// ============================================================
// AdminLoginPage — Premium Light Theme
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle } from "lucide-react";
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
    if (!authLoading && isAdmin) navigate("/admin/dashboard");
  }, [isAdmin, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fafafa" }}>
        <div className="w-10 h-10 border-4 border-edu-green-200 border-t-edu-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      navigate("/admin/dashboard");
    } else {
      setError("ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "#f0fdf4" }}>
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #bbf7d0, transparent)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #fde68a, transparent)", transform: "translate(-30%, 30%)" }} />
      </div>

      <div className="w-full max-w-md relative animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #15803d, #22c55e)", boxShadow: "0 8px 32px rgba(21,128,61,0.35)" }}>
            <Shield size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-edu-slate-800 mb-1">এডমিন প্যানেল</h1>
          <p className="text-edu-slate-500 text-sm">গাজীর চট মদিনাতুল উলুম ফাজিল মাদরাসা</p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-px bg-edu-slate-200" />
            <span className="font-arabic text-edu-green-600 text-lg">بِسْمِ اللهِ</span>
            <div className="flex-1 h-px bg-edu-slate-200" />
          </div>
        </div>

        {/* Card */}
        <div className="edu-card p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-edu-slate-700 text-sm font-semibold mb-2">ইমেইল ঠিকানা</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-edu-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@madrasa.edu" className="edu-input pl-11"
                  required autoComplete="email" style={{ fontSize: "16px" }} />
              </div>
            </div>
            <div>
              <label className="block text-edu-slate-700 text-sm font-semibold mb-2">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-edu-slate-400" />
                <input type={showPass ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className="edu-input pl-11 pr-12"
                  required autoComplete="current-password" style={{ fontSize: "16px" }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-edu-slate-400 hover:text-edu-slate-600 transition-colors">
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl animate-slide-up"
                style={{ background: "#fef2f2", border: "1px solid #fca5a5" }}>
                <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                <span className="text-red-600 text-sm">{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base disabled:opacity-60">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  লগইন হচ্ছে...
                </>
              ) : (
                <><Shield size={18} /> এডমিন লগইন</>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <div className="text-edu-slate-500 text-xs text-center leading-relaxed">
              Supabase Dashboard → Authentication → Users এ গিয়ে Admin অ্যাকাউন্ট তৈরি করুন।
            </div>
          </div>
        </div>

        <p className="text-center text-edu-slate-400 text-xs mt-6">
          শুধুমাত্র অনুমোদিত ব্যক্তির জন্য প্রবেশাধিকার সংরক্ষিত
        </p>
      </div>
    </div>
  );
}
