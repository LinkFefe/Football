"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { Session, DashboardData } from "@/lib/types";
import { Card } from "@/components/ui/Card";

// Importa i componenti modulari
import { PlayerDashboard } from "@/components/dashboards/PlayerDashboard";
import { OwnerDashboard } from "@/components/dashboards/OwnerDashboard";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";

export default function DashboardPage() {
  // Non serve più destrutturare 'logout' qui, è gestito dal Layout/Header
  const { session, loading: sessionLoading, setSession } = useSession();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

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

  useEffect(() => {
    if (!session) return;
    loadDashboard(session);
  }, [session]);

  if (sessionLoading) {
    return <div className="w-full px-6 py-6 text-white/70">Caricamento...</div>;
  }

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

  // Nota: Passiamo dashboard! (non-null assertion) perché i componenti figli 
  // gestiscono internamente i casi in cui i dati sono null/undefined (es. array vuoti)
  return (
    <div className="w-full px-6 py-6">
      {session.role === "PLAYER" && (
        <PlayerDashboard 
          session={session} 
          dashboard={dashboard!} 
          reloadData={() => loadDashboard(session)}
          setSession={setSession}
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