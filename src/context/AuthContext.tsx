"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { refreshToken, logout } from "@/services/auth";

type AuthContextType = {
  user: any;
  setUser: (user: any) => void;
  logoutUser: () => void;
  loading: boolean;
};


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
const [user, setUser] = useState<any>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const init = async () => {
    try {
      const res = await refreshToken();
      localStorage.setItem("accessToken", res.data.accessToken);
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  init();
}, []);


const logoutUser = async () => {
  await logout();

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  document.cookie = "accessToken=; path=/; max-age=0";
  document.cookie = "refreshToken=; path=/; max-age=0";

  window.location.href = "/login";
};



  return (
  <AuthContext.Provider value={{ user, setUser, logoutUser, loading }}>

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
