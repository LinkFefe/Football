"use client";

import Link from "next/link"; // Importa il componente Link di Next.js per la navigazione tra pagine
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { Session, DashboardData } from "@/lib/types";
import { Card } from "@/components/ui/Card";

// Importa i componenti modulari
import { PlayerDashboard } from "@/components/dashboards/PlayerDashboard";
import { OwnerDashboard } from "@/components/dashboards/OwnerDashboard";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";

// Componente principale della pagina Dashboard
export default function DashboardPage() {
  const { session, loading: sessionLoading, setSession } = useSession(); // Usa l'hook personalizzato per gestire la sessione utente
  const [dashboard, setDashboard] = useState<DashboardData | null>(null); // Stato per memorizzare i dati della dashboard

  // Funzione per caricare i dati della dashboard in base al ruolo dell'utente
  const loadDashboard = async (current: Session) => { 
    try {
      const response = await fetch( 
        `/api/dashboard?role=${current.role}&userId=${current.id}`, 
        { cache: "no-store" }
      );
      if (!response.ok) throw new Error("Errore nel fetch");
      
      const data = (await response.json()) as DashboardData;
      setDashboard(data);
    } catch (err) {
      console.error("Errore caricamento dashboard", err);
    }
  };

  // Effettua il caricamento dei dati della dashboard quando la sessione è disponibile
  useEffect(() => {
    if (!session) return;
    loadDashboard(session);
  }, [session]);

  // Gestione degli stati di caricamento e accesso
  if (sessionLoading) {
    return <div className="w-full px-6 py-6 text-white/70">Caricamento...</div>;
  }

  // Se l'utente non è autenticato, mostra un messaggio di accesso richiesto
  if (!session) {
    return (
      <div className="w-full px-6 py-6">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-semibold">Accesso richiesto</h1>
          <p className="mt-3 text-sm text-white/70">Effettua il login per accedere alla dashboard privata.</p>
          <Link href="/login" className="mt-6 inline-flex rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-[#0b0f14] hover:bg-emerald-400">
            Vai al login
          </Link>
        </Card>
      </div>
    );
  }

  // Ritorna il contenuto della dashboard in base al ruolo dell'utente
  return (
    <div className="w-full px-6 py-6">
      {session.role === "PLAYER" && (
        <PlayerDashboard 
          session={session} // Dati della sessione utente
          dashboard={dashboard!}  // I dati della dashboard 
          reloadData={() => loadDashboard(session)} // Funzione per ricaricare i dati
          setSession={setSession} // Funzione per aggiornare la sessione
        />
      )}
      {session.role === "OWNER" && (
        <OwnerDashboard 
          session={session} 
          dashboard={dashboard!} 
          reloadData={() => loadDashboard(session)}
          setSession={setSession}
        />
      )}
      {session.role === "ADMIN" && (
        <AdminDashboard 
          session={session} 
          dashboard={dashboard!} 
          reloadData={() => loadDashboard(session)}
          setSession={setSession}
        />
      )}
    </div>
  );
}