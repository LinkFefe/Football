import { Card } from "@/components/ui/Card"; // Importa il componente Card

// Definisci le proprietà del componente PlayerStatsCard
interface PlayerStatsCardProps {
  displayName: string; // Nome visualizzato del giocatore
  totalBookingsCount: number; // Numero totale di prenotazioni del giocatore
}

// Componente PlayerStatsCard
export function PlayerStatsCard({ displayName, totalBookingsCount }: PlayerStatsCardProps) {
  return (
    <Card variant="gradient" className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div>
        <p className="text-sm text-emerald-200">Bentornato</p>
        <h3 className="text-2xl font-semibold">{displayName}</h3>
        <p className="text-sm text-white/70">Gestisci le tue prenotazioni</p>
      </div>
      <div className="flex gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
          <p className="text-2xl font-semibold text-emerald-200">{totalBookingsCount}</p>
          <p className="text-xs text-white/60">Prenotazioni</p>
        </div>
      </div>
    </Card>
  );
}