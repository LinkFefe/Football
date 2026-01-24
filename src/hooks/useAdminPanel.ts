import { useState, useCallback } from "react";
import { UserItem, AdminBookingItem } from "@/lib/types";

export function useAdminPanel() {
  // Eliminazione utente (admin)
  const [adminDeleteUser, setAdminDeleteUser] = useState<UserItem | null>(null);
  const [adminDeleteUserLoading, setAdminDeleteUserLoading] = useState(false);

  // Eliminazione prenotazione (admin)
  const [adminDeleteBooking, setAdminDeleteBooking] = useState<AdminBookingItem | null>(null);
  const [adminDeleteBookingLoading, setAdminDeleteBookingLoading] = useState(false);

  // Richiede l'eliminazione di un utente
  const requestDeleteUser = useCallback((user: UserItem) => {
    setAdminDeleteUser(user);
  }, []);

  // Conferma l'eliminazione di un utente
  const confirmDeleteUser = useCallback(
    async (adminId: number, targetUserId: number, onSuccess: () => void) => {
      setAdminDeleteUserLoading(true);

      try {
        const response = await fetch("/api/profile", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminId, targetUserId }),
        });

        if (response.ok) {
          setAdminDeleteUser(null);
          onSuccess();
          return true;
        }
        return false;
      } finally {
        setAdminDeleteUserLoading(false);
      }
    },
    []
  );

  // Richiede l'eliminazione di una prenotazione
  const requestDeleteBooking = useCallback((booking: AdminBookingItem) => {
    setAdminDeleteBooking(booking);
  }, []);

  // Conferma l'eliminazione di una prenotazione
  const confirmDeleteBooking = useCallback(
    async (adminId: number, bookingId: number, onSuccess: () => void) => {
      setAdminDeleteBookingLoading(true);

      try {
        const response = await fetch("/api/bookings", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminId, bookingId }),
        });

        if (response.ok) {
          setAdminDeleteBooking(null);
          onSuccess();
          return true;
        }
        return false;
      } finally {
        setAdminDeleteBookingLoading(false);
      }
    },
    []
  );

  return {
    // Eliminazione utente
    adminDeleteUser,
    setAdminDeleteUser,
    adminDeleteUserLoading,
    requestDeleteUser,
    confirmDeleteUser,

    // Eliminazione prenotazione
    adminDeleteBooking,
    setAdminDeleteBooking,
    adminDeleteBookingLoading,
    requestDeleteBooking,
    confirmDeleteBooking,
  };
}
