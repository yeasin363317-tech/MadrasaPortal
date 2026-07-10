// ============================================================
// App.tsx — Routes + Bottom Nav + WhatsApp button
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import HomePage from "@/pages/HomePage";
import SubjectDetailPage from "@/pages/SubjectDetailPage";
import ChatPage from "@/pages/ChatPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminSubjectsPage from "@/pages/admin/AdminSubjectsPage";
import AdminHomeworkPage from "@/pages/admin/AdminHomeworkPage";
import AdminSuggestionsPage from "@/pages/admin/AdminSuggestionsPage";
import AdminChatPage from "@/pages/admin/AdminChatPage";
import AdminTeachersPage from "@/pages/admin/AdminTeachersPage";
import AdminNoticesPage from "@/pages/admin/AdminNoticesPage";
import AdminRoutinesPage from "@/pages/admin/AdminRoutinesPage";
import NoticesPage from "@/pages/NoticesPage";
import RoutinesPage from "@/pages/RoutinesPage";
import TeachersPage from "@/pages/TeachersPage";
import TeacherDetailPage from "@/pages/TeacherDetailPage";
import NotFound from "@/pages/NotFound";
import NoticeDetailPage from "@/pages/NoticeDetailPage";
import HomeworkDetailPage from "@/pages/HomeworkDetailPage";
import WhatsAppButton from "@/components/features/WhatsAppButton";
import supabase from "@/lib/supabase";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuth(!!session);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen islamic-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-islamic-gold-400/30 border-t-islamic-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  return isAuth ? <>{children}</> : <Navigate to="/admin" replace />;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {/* pt accounts for fixed navbar height + OnSpace banner offset */}
      <main className="pb-24 md:pb-0" style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 76px)" }}>{children}</main>
      <div className="hidden md:block"><Footer /></div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#ffffff",
            border: "1px solid rgba(21,128,61,0.2)",
            color: "#1e293b",
            borderRadius: "1rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            fontSize: "0.9rem",
          },
          duration: 3000,
        }}
      />

      <WhatsAppButton />

      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/subject/:id" element={<PublicLayout><SubjectDetailPage /></PublicLayout>} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/notices" element={<PublicLayout><NoticesPage /></PublicLayout>} />
        <Route path="/routines" element={<PublicLayout><RoutinesPage /></PublicLayout>} />
        <Route path="/teachers" element={<PublicLayout><TeachersPage /></PublicLayout>} />
        <Route path="/teachers/:id" element={<PublicLayout><TeacherDetailPage /></PublicLayout>} />
        <Route path="/notices/:id" element={<PublicLayout><NoticeDetailPage /></PublicLayout>} />
        <Route path="/homework/:id" element={<PublicLayout><HomeworkDetailPage /></PublicLayout>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/subjects" element={<ProtectedRoute><AdminSubjectsPage /></ProtectedRoute>} />
        <Route path="/admin/homework" element={<ProtectedRoute><AdminHomeworkPage /></ProtectedRoute>} />
        <Route path="/admin/suggestions" element={<ProtectedRoute><AdminSuggestionsPage /></ProtectedRoute>} />
        <Route path="/admin/chat" element={<ProtectedRoute><AdminChatPage /></ProtectedRoute>} />
        <Route path="/admin/teachers" element={<ProtectedRoute><AdminTeachersPage /></ProtectedRoute>} />
        <Route path="/admin/notices" element={<ProtectedRoute><AdminNoticesPage /></ProtectedRoute>} />
        <Route path="/admin/routines" element={<ProtectedRoute><AdminRoutinesPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <BottomNav />
    </BrowserRouter>
  );
}
