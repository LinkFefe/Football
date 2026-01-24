import { useState } from "react";
import { FieldItem } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface PlayerFieldListProps {
  fields: FieldItem[];
  onBook: (field: FieldItem) => void;
  onInfo: (field: FieldItem) => void;
}

const fallbackFields: FieldItem[] = [
  { id: 1, name: "Central Park Field 1", size: "5v5", location: "Centro città", imageUrl: "/images/field-1.svg" },
  { id: 2, name: "River Side Field 2", size: "7v7", location: "Zona Nord", imageUrl: "/images/field-2.svg" },
  { id: 3, name: "Arena Field 3", size: "9v9", location: "Zona Sud", imageUrl: "/images/field-3.svg" },
];

export function PlayerFieldList({ fields, onBook, onInfo }: PlayerFieldListProps) {
  const [showAllFields, setShowAllFields] = useState(false);
  
  const displayFields = fields.length > 0 ? fields : fallbackFields;
  const visibleFields = showAllFields ? displayFields : displayFields.slice(0, 6);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-sm text-emerald-200">Campi disponibili</p>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {visibleFields.map((field) => (
          <div
            key={field.id}
            className="rounded-2xl border border-white/10 bg-[#0b0f14]/70 p-3"
          >
            <img
              src={field.imageUrl ?? "/images/field-1.svg"}
              alt={field.name}
              className="h-24 w-full rounded-xl object-cover"
            />
            <div className="mt-3 space-y-1">
              <p className="text-sm font-semibold text-white">{field.name}</p>
              <p className="text-xs text-white/60">
                {field.size} · {field.location ?? "Centro città"}
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="secondary"
                className="w-full rounded-full border-none bg-emerald-500/20 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/30"
                onClick={() => onBook(field)}
              >
                Prenota
              </Button>
              <Button
                variant="secondary"
                className="w-full rounded-full border-none bg-blue-500/20 text-xs font-semibold text-blue-200 hover:bg-blue-500/30"
                onClick={() => onInfo(field)}
              >
                Info
              </Button>
            </div>
          </div>
        ))}
      </div>

      {displayFields.length > 6 && (
        <Button
          variant="secondary"
          onClick={() => setShowAllFields(!showAllFields)}
          className="mt-4 w-full rounded-full border-emerald-400/10 bg-emerald-400/10 text-xs text-emerald-200 hover:bg-emerald-400/20"
        >
          {showAllFields ? "Mostra meno" : "Mostra tutti"}
        </Button>
      )}
    </Card>
  );
}