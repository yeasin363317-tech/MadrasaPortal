// ============================================================
// App.tsx - Supabase Auth-based Protected Routes
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
import NotFound from "@/pages/NotFound";
import WhatsAppButton from "@/components/features/WhatsAppButton";
import supabase from "@/lib/supabase";

// Protected Route - Supabase session check
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

// Public layout with Navbar & Footer
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(13, 74, 46, 0.95)",
            border: "1px solid rgba(201, 162, 39, 0.3)",
            color: "#f8f4e8",
            backdropFilter: "blur(12px)",
          },
          duration: 3000,
        }}
      />

      {/* WhatsApp floating button — visible on all pages */}
      <WhatsAppButton />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/subject/:id" element={<PublicLayout><SubjectDetailPage /></PublicLayout>} />
        <Route path="/chat" element={<PublicLayout><ChatPage /></PublicLayout>} />
        <Route path="/notices" element={<PublicLayout><NoticesPage /></PublicLayout>} />
        <Route path="/routines" element={<PublicLayout><RoutinesPage /></PublicLayout>} />

        {/* Admin Login */}
        <Route path="/admin" element={<AdminLoginPage />} />

        {/* Admin Protected Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/subjects" element={<ProtectedRoute><AdminSubjectsPage /></ProtectedRoute>} />
        <Route path="/admin/homework" element={<ProtectedRoute><AdminHomeworkPage /></ProtectedRoute>} />
        <Route path="/admin/suggestions" element={<ProtectedRoute><AdminSuggestionsPage /></ProtectedRoute>} />
        <Route path="/admin/chat" element={<ProtectedRoute><AdminChatPage /></ProtectedRoute>} />
        <Route path="/admin/teachers" element={<ProtectedRoute><AdminTeachersPage /></ProtectedRoute>} />
        <Route path="/admin/notices" element={<ProtectedRoute><AdminNoticesPage /></ProtectedRoute>} />
        <Route path="/admin/routines" element={<ProtectedRoute><AdminRoutinesPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
