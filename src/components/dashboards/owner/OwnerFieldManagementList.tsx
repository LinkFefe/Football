import { FieldItem } from "@/lib/types"; // Importa il tipo FieldItem
import { Button } from "@/components/ui/Button"; // Importa il componente Button
import { Card } from "@/components/ui/Card"; // Importa il componente Card

// Definisci le proprietà del componente OwnerFieldManagementList
interface OwnerFieldManagementListProps {
  fields: FieldItem[]; // Array di campi gestiti dal proprietario
  onCreateClick: () => void; // Funzione di callback per la creazione di un nuovo campo
  onEditClick: (field: FieldItem) => void; // Funzione di callback per la modifica di un campo
  onDeleteClick: (field: FieldItem) => void; // Funzione di callback per l'eliminazione di un campo
}

// Componente OwnerFieldManagementList
export function OwnerFieldManagementList({ 
  fields, 
  onCreateClick, 
  onEditClick, 
  onDeleteClick 
}: OwnerFieldManagementListProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">I miei campi</h3>
        <Button
          variant="primary"
          size="sm"
          onClick={onCreateClick}
          className="rounded-full bg-emerald-400/10 text-emerald-50 border border-emerald-400/30"
        >
          Crea nuovo campo
        </Button>
      </div>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.id}
            className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f14]/70 p-4"
          >
            <img
              src={field.imageUrl ?? "/images/field-1.svg"}
              alt={field.name}
              className="h-24 w-full rounded-xl object-cover mb-3"
            />
            <h4 className="text-xl font-semibold mb-2">{field.name}</h4>
            <p className="text-xs text-white/60 mb-4">
              {field.size} - {field.location}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEditClick(field)}
                className="rounded-full"
              >
                Modifica
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDeleteClick(field)}
                className="rounded-full"
              >
                Elimina
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}