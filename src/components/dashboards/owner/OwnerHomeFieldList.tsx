import { FieldItem, BookingItem, UserItem } from "@/lib/types";  // Importa i tipi necessari
import { Button } from "@/components/ui/Button"; // Importa il componente Button

// Estendiamo il tipo FieldItem per includere le prenotazioni associate
interface OwnerFieldItem extends FieldItem {
  bookings: (BookingItem & { player: { user: UserItem } })[]; // Prenotazioni con informazioni sul giocatore e sull'utente
}

// Definisci le proprietà del componente OwnerHomeFieldList
interface OwnerHomeFieldListProps {
  fields: OwnerFieldItem[]; // Array di campi con le loro prenotazioni
  onInfoClick: (field: FieldItem) => void; // Funzione di callback per le informazioni sul campo
}

// Componente OwnerHomeFieldList
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
                className="rounded-full border-none bg-blue-500/20 text-[10px] font-semibold text-blue-200 hover:bg-blue-500/30 px-3 py-1 min-w-0 min-h-0"
                style={{lineHeight: '1.1'}} // per renderlo più compatto
                onClick={() => onInfoClick(field)} 
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
                    {new Date(b.startDate).toLocaleDateString()}<br />
                    {new Date(b.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {new Date(b.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {field.bookings.length === 0 && (
                <p className="italic text-white/40">Nessuna prenotazione</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}