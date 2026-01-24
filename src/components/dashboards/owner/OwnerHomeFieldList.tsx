import { FieldItem, BookingItem, UserItem } from "@/lib/types"; // Assicurati che i tipi siano corretti nel tuo progetto
import { Button } from "@/components/ui/Button";

// Definiamo un tipo specifico per i campi dell'owner che includono le prenotazioni
interface OwnerFieldItem extends FieldItem {
  bookings: (BookingItem & { player: { user: UserItem } })[];
}

interface OwnerHomeFieldListProps {
  fields: OwnerFieldItem[];
  onInfoClick: (field: FieldItem) => void;
}

export function OwnerHomeFieldList({ fields, onInfoClick }: OwnerHomeFieldListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {fields.map((field) => (
        <div key={field.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <img
            src={field.imageUrl ?? "/images/field-1.svg"}
            alt={field.name}
            className="h-36 w-full object-cover"
          />
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-semibold">{field.name}</h4>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onInfoClick(field)}
                className="rounded-full text-xs bg-blue-400/10 text-blue-200"
              >
                Info
              </Button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              {field.bookings.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0b0f14]/60 px-4 py-3"
                >
                  <span>{b.player.user.name}</span>
                  <span className="text-xs text-white/60">
                    {new Date(b.startDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {field.bookings.length === 0 && (
                <p className="italic text-white/40">Nessuna prenotazione.</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}