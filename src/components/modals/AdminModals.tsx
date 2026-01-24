"use client";

import React from "react";
import { UserItem, AdminBookingItem } from "@/lib/types";
import { Button } from "../ui/Button";

interface AdminDeleteUserModalProps {
  user: UserItem | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AdminDeleteUserModal({
  user,
  isLoading,
  onClose,
  onConfirm,
}: AdminDeleteUserModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0b0f14] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-emerald-200">Conferma eliminazione</p>
            <h3 className="text-lg font-semibold">{user.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white"
            aria-label="Chiudi"
          >
            ✕
          </button>
        </div>

        <p className="mt-4 text-sm text-white/70">
          Vuoi eliminare l'utente {user.name}?
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            size="md"
            className="rounded-full"
            onClick={onClose}
          >
            Torna indietro
          </Button>
          <Button
            variant="danger"
            size="md"
            className="rounded-full"
            onClick={onConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Elimina utente
          </Button>
        </div>
      </div>
    </div>
  );
}

interface AdminDeleteBookingModalProps {
  booking: AdminBookingItem | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AdminDeleteBookingModal({
  booking,
  isLoading,
  onClose,
  onConfirm,
}: AdminDeleteBookingModalProps) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0b0f14] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-emerald-200">Conferma eliminazione</p>
            <h3 className="text-lg font-semibold">{booking.field.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white"
            aria-label="Chiudi"
          >
            ✕
          </button>
        </div>

        <p className="mt-4 text-sm text-white/70">
          Vuoi eliminare la prenotazione di {booking.player.user.name} del{" "}
          {new Date(booking.startDate).toLocaleString([], {
            dateStyle: "short",
            timeStyle: "short",
          })}?
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            size="md"
            className="rounded-full"
            onClick={onClose}
          >
            Torna indietro
          </Button>
          <Button
            variant="danger"
            size="md"
            className="rounded-full"
            onClick={onConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Elimina prenotazione
          </Button>
        </div>
      </div>
    </div>
  );
}
