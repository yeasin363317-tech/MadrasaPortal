// ============================================================
// useLocalStorage HOOK - লোকাল স্টোরেজ থেকে ডেটা ম্যানেজ করে
// ============================================================

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      console.log("useLocalStorage read error:", key);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      console.log("useLocalStorage write error:", key);
    }
  };

  return [storedValue, setValue] as const;
}

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useLocalStorage("madrasa_admin_auth", false);
  const [adminName, setAdminName] = useLocalStorage("madrasa_admin_name", "");

  const login = (email: string, password: string): boolean => {
    if (email === "admin@madrasa.edu" && password === "madrasa@2025") {
      setIsAdmin(true);
      setAdminName("Admin");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminName("");
    window.location.href = "/";
  };

  return { isAdmin, adminName, login, logout };
}
