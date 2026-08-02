// ============================================================
// useGuestUser — UUID-based guest identity for chat
// UUID is permanent; display name can change
// ============================================================

import { useState, useCallback } from "react";

const GUEST_KEY = "madrasa_guest_user";

export interface GuestUser {
  uuid: string;
  name: string;
  createdAt: string;
}

function readGuest(): GuestUser | null {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.uuid && parsed?.name) return parsed as GuestUser;
    return null;
  } catch {
    return null;
  }
}

function writeGuest(user: GuestUser) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(user));
}

// Migrate old name-only storage to the new UUID system
function migrateOldUser(): GuestUser | null {
  const oldName = localStorage.getItem("madrasa_chat_name");
  if (!oldName) return null;
  // Create a new guest user keeping the old name
  const user: GuestUser = {
    uuid: crypto.randomUUID(),
    name: oldName,
    createdAt: new Date().toISOString(),
  };
  writeGuest(user);
  localStorage.removeItem("madrasa_chat_name");
  return user;
}

export function useGuestUser() {
  const [guestUser, setGuestUser] = useState<GuestUser | null>(() => {
    return readGuest() ?? migrateOldUser();
  });

  const createUser = useCallback((name: string): GuestUser => {
    const user: GuestUser = {
      uuid: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    writeGuest(user);
    setGuestUser(user);
    return user;
  }, []);

  const updateName = useCallback((newName: string) => {
    setGuestUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, name: newName.trim() };
      writeGuest(updated);
      return updated;
    });
  }, []);

  return { guestUser, createUser, updateName };
}
