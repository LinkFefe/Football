import { useState, useEffect } from "react";
import { Session } from "@/lib/types";

// Hook personalizzato per la gestione della sessione utente
export function useSession() {
  const [session, setSession] = useState<Session | null>(null); // Stato della sessione utente
  const [loading, setLoading] = useState(true); // Stato di caricamento

  // Carica la sessione da localStorage all'inizializzazione
  useEffect(() => {
    const saved = localStorage.getItem("session"); // Ottieni la sessione salvata
    if (!saved) {
      setLoading(false);
      return;
    }
    const parsed = JSON.parse(saved) as Session; // Analizza la sessione salvata
    setSession(parsed); // Imposta la sessione nello stato
    setLoading(false);
  }, []);

  // Aggiorna la sessione e localStorage
  const updateSession = (newSession: Session) => {
    setSession(newSession);
    localStorage.setItem("session", JSON.stringify(newSession)); // Salva la sessione aggiornata
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("session"); // Rimuovi la sessione salvata
    setSession(null); // Resetta lo stato della sessione
  };

  return { session, loading, setSession: updateSession, logout }; // Ritorna la sessione, lo stato di caricamento, la funzione per aggiornare la sessione e la funzione di logout
}
