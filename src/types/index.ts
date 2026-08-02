// ============================================================
// TYPE DEFINITIONS - সব ডেটা স্ট্রাকচার এখানে ডিফাইন করা আছে
// ============================================================

export interface Subject {
  id: string;
  name: string;
  nameEn: string;
  teacher: string;
  teacherDesignation: string;
  icon: string;
  color: string;
  description: string;
  totalClasses: number;
  completedClasses: number;
  createdAt: string;
}

export interface Homework {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  dueDate: string;
  isUrgent: boolean;
  createdAt: string;
}

export interface Suggestion {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  examType: "অর্ধবার্ষিক" | "বার্ষিক" | "টেস্ট" | "সাপ্তাহিক";
  topics: string[];
  importance: "অতি গুরুত্বপূর্ণ" | "গুরুত্বপূর্ণ" | "সাধারণ";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
  isDeleted?: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super-admin" | "admin";
  profileImage?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalSubjects: number;
  totalHomework: number;
  totalSuggestions: number;
  totalMessages: number;
  activeAdmins: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "urgent";
  createdAt: string;
  expiresAt?: string;
}
