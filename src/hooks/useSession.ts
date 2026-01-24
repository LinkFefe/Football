import { useState, useEffect } from "react";
import { Session } from "@/lib/types";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Carica la sessione dal localStorage al montaggio
  useEffect(() => {
    const saved = localStorage.getItem("session");
    if (!saved) {
      setLoading(false);
      return;
    }
    const parsed = JSON.parse(saved) as Session;
    setSession(parsed);
    setLoading(false);
  }, []);

  // Aggiorna la sessione e localStorage
  const updateSession = (newSession: Session) => {
    setSession(newSession);
    localStorage.setItem("session", JSON.stringify(newSession));
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("session");
    setSession(null);
  };

  return { session, loading, setSession: updateSession, logout };
}
