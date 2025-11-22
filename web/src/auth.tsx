import React, { createContext, useContext, useState } from "react";
import { apiFetch, authState } from "./api";

type User = {
  email: string;
  name?: string;
  phone?: string;
  role: "user" | "admin";
};
type MeResp = { data: User };

type Ctx = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (p: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
};

const C = createContext<Ctx | null>(null);
export const useAuth = () => {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  async function login(email: string, password: string) {
    const res = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("login failed");
    const body = await res.json();
    authState.token = body.accessToken;
    await fetchMe();
  }

  async function register(payload: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) {
    const res = await fetch("http://localhost:4000/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("register failed");
  }

  async function logout() {
    await fetch("http://localhost:4000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    authState.clear();
    setUser(null);
  }

  async function fetchMe() {
    try {
      const me = await apiFetch<MeResp>("/me");
      setUser(me.data);
    } catch {
      setUser(null);
    }
  }

  return (
    <C.Provider value={{ user, login, register, logout, fetchMe }}>
      {children}
    </C.Provider>
  );
}
