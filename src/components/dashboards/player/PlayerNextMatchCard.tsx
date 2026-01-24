import { BookingItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface PlayerNextMatchCardProps {
  nextBooking: BookingItem | null;
}

export function PlayerNextMatchCard({ nextBooking }: PlayerNextMatchCardProps) {
  const formatMatchDate = (value: string) => new Date(value).toLocaleDateString();
  const formatMatchTime = (value: string) =>
    new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <Card variant="featured">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-400/20 text-emerald-200">
          ⚽
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
            Il tuo prossimo match
          </p>
          <p className="text-sm text-white/60">Pianifica la tua prossima partita</p>
        </div>
      </div>
      {nextBooking ? (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-2xl font-semibold">{nextBooking.field.name}</h4>
            <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
              {nextBooking.field.size}
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs text-white/60">Data partita</p>
              <p className="text-sm font-semibold text-white">
                {formatMatchDate(nextBooking.startDate)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs text-white/60">Orario partita</p>
              <p className="text-sm font-semibold text-white">
                {formatMatchTime(nextBooking.startDate)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-white/60">Nessuna prenotazione attiva.</p>
      )}
    </Card>
  );
}