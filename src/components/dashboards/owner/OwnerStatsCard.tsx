import { Card } from "@/components/ui/Card";

interface OwnerStatsCardProps {
  displayName: string;
  bookingsCount: number;
}

export function OwnerStatsCard({ displayName, bookingsCount }: OwnerStatsCardProps) {
  return (
    <Card variant="gradient" className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm text-emerald-200">Bentornato</p>
        <h3 className="text-2xl font-semibold">{displayName}</h3>
        <p className="text-sm text-white/70">Gestisci campi e prenotazioni</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
        <p className="text-2xl font-semibold text-emerald-200">{bookingsCount}</p>
        <p className="text-xs text-white/60">Prenotazioni</p>
      </div>
    </Card>
  );
}