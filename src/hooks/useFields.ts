import { useState, useCallback } from "react";
import { FieldItem } from "@/lib/types";

export function useFields() {
  // Stati per modifica campo
  const [editingField, setEditingField] = useState<FieldItem | null>(null);
  const [fieldName, setFieldName] = useState("");
  const [fieldSize, setFieldSize] = useState("");
  const [fieldLocation, setFieldLocation] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [fieldLoading, setFieldLoading] = useState(false);

  // Stati per eliminazione campo
  const [deleteFieldTarget, setDeleteFieldTarget] = useState<FieldItem | null>(null);
  const [deleteFieldLoading, setDeleteFieldLoading] = useState(false);

  // Stati per creazione campo
  const [createFieldOpen, setCreateFieldOpen] = useState(false);
  const [createFieldName, setCreateFieldName] = useState("");
  const [createFieldSize, setCreateFieldSize] = useState("");
  const [createFieldLocation, setCreateFieldLocation] = useState("");
  const [createFieldImageUrl, setCreateFieldImageUrl] = useState("");
  const [createFieldError, setCreateFieldError] = useState<string | null>(null);
  const [createFieldLoading, setCreateFieldLoading] = useState(false);

  // Apre il modale di modifica campo
  const openEditField = useCallback((field: FieldItem) => {
    setEditingField(field);
    setFieldName(field.name);
    setFieldSize(field.size);
    setFieldLocation(field.location ?? "");
    setFieldError(null);
  }, []);

  // Conferma la modifica del campo
  const confirmEditField = useCallback(
    async (userId: number, fieldId: number, name: string, size: string, location: string | null, onSuccess: () => void) => {
      setFieldLoading(true);
      setFieldError(null);

      try {
        const response = await fetch("/api/fields", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            fieldId,
            name: name.trim() || undefined,
            size: size.trim() || undefined,
            location: location?.trim() || null,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setFieldError(data?.message ?? "Aggiornamento non riuscito.");
          return false;
        }

        setEditingField(null);
        onSuccess();
        return true;
      } finally {
        setFieldLoading(false);
      }
    },
    []
  );

  // Richiede l'eliminazione di un campo
  const requestDeleteField = useCallback((field: FieldItem) => {
    setDeleteFieldTarget(field);
    setFieldError(null);
  }, []);

  // Conferma l'eliminazione del campo
  const confirmDeleteField = useCallback(
    async (userId: number | undefined, fieldId: number, isAdmin: boolean = false, adminId?: number, onSuccess: () => void = () => {}) => {
      setDeleteFieldLoading(true);

      try {
        const response = await fetch("/api/fields", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isAdmin && adminId ? { adminId, fieldId } : { userId, fieldId }
          ),
        });

        if (!response.ok) {
          const data = await response.json();
          setFieldError(data?.message ?? "Eliminazione non riuscita.");
          return false;
        }

        setDeleteFieldTarget(null);
        onSuccess();
        return true;
      } finally {
        setDeleteFieldLoading(false);
      }
    },
    []
  );

  // Conferma la creazione del campo
  const confirmCreateField = useCallback(
    async (
      userId: number,
      name: string,
      size: string,
      location: string | null,
      imageUrl: string | null,
      onSuccess: () => void
    ) => {
      setCreateFieldLoading(true);
      setCreateFieldError(null);

      try {
        const response = await fetch("/api/fields", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            name: name.trim(),
            size: size.trim(),
            location: location?.trim() || null,
            imageUrl: imageUrl?.trim() || null,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setCreateFieldError(data?.message ?? "Creazione non riuscita.");
          return false;
        }

        setCreateFieldOpen(false);
        setCreateFieldName("");
        setCreateFieldSize("");
        setCreateFieldLocation("");
        setCreateFieldImageUrl("");
        onSuccess();
        return true;
      } finally {
        setCreateFieldLoading(false);
      }
    },
    []
  );

  return {
    // Modifica campo
    editingField,
    setEditingField,
    fieldName,
    setFieldName,
    fieldSize,
    setFieldSize,
    fieldLocation,
    setFieldLocation,
    fieldError,
    fieldLoading,
    openEditField,
    confirmEditField,

    // Eliminazione campo
    deleteFieldTarget,
    setDeleteFieldTarget,
    deleteFieldLoading,
    requestDeleteField,
    confirmDeleteField,

    // Creazione campo
    createFieldOpen,
    setCreateFieldOpen,
    createFieldName,
    setCreateFieldName,
    createFieldSize,
    setCreateFieldSize,
    createFieldLocation,
    setCreateFieldLocation,
    createFieldImageUrl,
    setCreateFieldImageUrl,
    createFieldError,
    createFieldLoading,
    confirmCreateField,
  };
}
