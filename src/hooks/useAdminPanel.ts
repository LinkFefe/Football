import { useState, useCallback } from "react"; // Importa le funzioni necessarie da React
import { UserItem, AdminBookingItem } from "@/lib/types"; // Importa i tipi UserItem e AdminBookingItem

// Hook personalizzato per la gestione del pannello admin
export function useAdminPanel() {
  const [adminDeleteUser, setAdminDeleteUser] = useState<UserItem | null>(null); // Stato per l'utente da eliminare
  const [adminDeleteUserLoading, setAdminDeleteUserLoading] = useState(false); // Stato di caricamento per l'eliminazione utente

  // Eliminazione prenotazione (admin)
  const [adminDeleteBooking, setAdminDeleteBooking] = useState<AdminBookingItem | null>(null);
  const [adminDeleteBookingLoading, setAdminDeleteBookingLoading] = useState(false);

  // Effettua la richiesta di eliminazione di un utente
  const requestDeleteUser = useCallback((user: UserItem) => {  
    setAdminDeleteUser(user); // Imposta l'utente da eliminare
  }, []);

  // Conferma l'eliminazione di un utente
  const confirmDeleteUser = useCallback(
    async (adminId: number, targetUserId: number, onSuccess: () => void) => {
      setAdminDeleteUserLoading(true);

      // Effettua la chiamata API per eliminare l'utente
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

      // Effettua la chiamata API per eliminare la prenotazione
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

  // Ritorna le funzioni e stati per la gestione del pannello admin
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
