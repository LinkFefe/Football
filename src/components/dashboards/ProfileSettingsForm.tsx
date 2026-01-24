"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

interface ProfileSettingsFormProps {
  // Stati dei campi
  profileName: string;
  setProfileName: (value: string) => void;
  oldPassword: string;
  setOldPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;

  // Stati di visualizzazione e feedback
  showForm: boolean;
  setShowForm: (value: boolean | ((prev: boolean) => boolean)) => void;
  loading: boolean;
  deleteLoading: boolean;
  error: string | null;
  success: string | null;

  // Gestori eventi
  onSave: (event: React.FormEvent) => void;
  onDeleteRequest: () => void;
}

export function ProfileSettingsForm({
  profileName,
  setProfileName,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showForm,
  setShowForm,
  loading,
  deleteLoading,
  error,
  success,
  onSave,
  onDeleteRequest,
}: ProfileSettingsFormProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold">Impostazioni</h3>
      <div className="mt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-xl border border-white/10 text-white/70 hover:border-emerald-300 hover:text-white"
        >
          {showForm ? "Chiudi modifica" : "Modifica Profilo"}
        </Button>
      </div>
      
      {!showForm ? (
        <p className="mt-4 text-sm text-white/60">
          Seleziona una voce per modificare le impostazioni.
        </p>
      ) : (
        <form
          onSubmit={onSave}
          className="mt-6 rounded-3xl border border-white/10 bg-[#0b0f14]/70 p-6"
        >
          <h4 className="text-base font-semibold text-white mb-4">Profilo</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              label="Nome"
              value={profileName}
              onChange={(event) => setProfileName(event.target.value)}
              className="bg-[#0b0f14]/80"
            />
            <Input
              label="Password attuale"
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              className="bg-[#0b0f14]/80"
            />
            <Input
              label="Nuova password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="bg-[#0b0f14]/80"
            />
            <Input
              label="Conferma nuova password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="bg-[#0b0f14]/80"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}
          
          {success && (
            <p className="mt-4 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {success}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="mt-4 rounded-full"
          >
            Salva modifiche
          </Button>
          
          <Button
            type="button"
            variant="danger"
            isLoading={deleteLoading}
            onClick={onDeleteRequest}
            className="mt-3 w-full rounded-full bg-red-500/15 font-semibold text-red-200 hover:border-red-400"
          >
            Elimina profilo
          </Button>
        </form>
      )}
    </Card>
  );
}