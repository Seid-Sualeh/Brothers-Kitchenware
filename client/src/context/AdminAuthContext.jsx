import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const AdminAuthContext = createContext(null);

function readStaffFromStorage() {
  const raw = localStorage.getItem("adminUser");
  const token = localStorage.getItem("adminAccessToken");
  if (!raw || !token) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }) {
  const [staff, setStaff] = useState(() => readStaffFromStorage());
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const stored = readStaffFromStorage();
    if (stored) {
      setStaff((current) => current ?? stored);
    }
  }, [pathname]);

  useEffect(() => {
    if (!staff) {
      const stored = readStaffFromStorage();
      if (stored) {
        setStaff(stored);
      }
    }
  }, [staff]);

  const adminLogin = (user, token) => {
    localStorage.setItem("adminAccessToken", token);
    localStorage.setItem("adminUser", JSON.stringify(user));
    setStaff(user);
  };

  const adminLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminUser");
    setStaff(null);
  };

  const isAdmin = staff?.role === "admin";
  const isEmployee = staff?.role === "employee";

  const value = {
    staff,
    loading,
    adminLogin,
    adminLogout,
    isAdmin,
    isEmployee,
    isStaff: !!(isAdmin || isEmployee),
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}

/** Optional: use in Topbar without throwing if provider missing */
export function useAdminAuthSafe() {
  return useContext(AdminAuthContext);
}
