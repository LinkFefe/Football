import { useState, useCallback } from "react";
import { Session } from "@/lib/types";

export function useProfile() {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [deleteProfileConfirmOpen, setDeleteProfileConfirmOpen] = useState(false);
  const [deleteProfileLoading, setDeleteProfileLoading] = useState(false);

  // Salva il profilo
  const handleProfileSave = useCallback(
    async (
      userId: number,
      name: string,
      oldPass: string | undefined,
      newPass: string | undefined,
      confirmPass: string | undefined,
      onSuccess: (updatedSession: Session) => void
    ) => {
      if (newPass && newPass !== confirmPass) {
        setProfileError("Le nuove password non coincidono.");
        return false;
      }

      setProfileLoading(true);
      setProfileError(null);
      setProfileSuccess(null);

      try {
        const response = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            name: name.trim() || undefined,
            oldPassword: oldPass || undefined,
            newPassword: newPass || undefined,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setProfileError(data?.message ?? "Aggiornamento non riuscito.");
          return false;
        }

        const data = (await response.json()) as Session;
        setProfileSuccess("Profilo aggiornato.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onSuccess(data);
        return true;
      } finally {
        setProfileLoading(false);
      }
    },
    []
  );

  // Elimina il profilo
  const handleProfileDelete = useCallback(async (userId: number, onSuccess: () => void) => {
    setDeleteProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        setProfileError(data?.message ?? "Eliminazione non riuscita.");
        return false;
      }

      onSuccess();
      return true;
    } finally {
      setDeleteProfileLoading(false);
    }
  }, []);

  return {
    showProfileForm,
    setShowProfileForm,
    profileName,
    setProfileName,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    profileError,
    profileSuccess,
    profileLoading,
    deleteProfileConfirmOpen,
    setDeleteProfileConfirmOpen,
    deleteProfileLoading,
    handleProfileSave,
    handleProfileDelete,
  };
}
