import { FieldItem } from "@/lib/types"; // Importa il tipo FieldItem
import { Button } from "@/components/ui/Button"; // Importa il componente Button
import { Card } from "@/components/ui/Card"; // Importa il componente Card

// Definisci le proprietà del componente AdminFieldList
interface AdminFieldListProps {
  fields: FieldItem[]; // Array di campi
  onDeleteField: (field: FieldItem) => void; // Funzione di callback per eliminare un campo
}

// Dati di fallback per i campi
const fallbackFields: FieldItem[] = [
  { id: 1, name: "Central Park Field 1", size: "5v5", location: "Centro città", imageUrl: "/images/field-1.svg" },
  { id: 2, name: "River Side Field 2", size: "7v7", location: "Zona Nord", imageUrl: "/images/field-2.svg" },
  { id: 3, name: "Arena Field 3", size: "9v9", location: "Zona Sud", imageUrl: "/images/field-3.svg" },
];

// Componente AdminFieldList
export function AdminFieldList({ fields, onDeleteField }: AdminFieldListProps) {
  const displayFields = fields.length > 0 ? fields : fallbackFields; // Usa i campi forniti o quelli di fallback

  return (
    <Card className="lg:col-span-2">
      <p className="text-sm text-emerald-200">Campi</p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {displayFields.map((field) => (
          <div
            key={field.id}
            className="rounded-2xl border border-white/10 bg-[#0b0f14]/70 p-3"
          >
             <img
                src={field.imageUrl ?? "/images/field-1.svg"}
                alt={field.name}
                className="h-24 w-full rounded-xl object-cover mb-3"
              />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">{field.name}</p>
              <p className="text-xs text-white/60">{field.size} · {field.location ?? "N/A"}</p>
              {(field.ownerName || field.ownerEmail) && (
                <p className="text-xs text-emerald-300 mt-1">
                  Proprietario: {field.ownerName}
                  {field.ownerEmail && (
                    <span className="text-white/70"> &lt;{field.ownerEmail}&gt;</span>
                  )}
                </p>
              )}
            </div>
            <Button
              variant="danger"
              onClick={() => onDeleteField(field)}
              className="mt-3 w-full rounded-full text-xs font-semibold"
            >
              Elimina
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}