import { useState, useCallback } from "react";
import { FieldItem, BookingItem } from "@/lib/types";

export function useBookings() {
  // Stati per nuova prenotazione
  const [bookingField, setBookingField] = useState<FieldItem | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingDuration, setBookingDuration] = useState(1);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Stati per orari disponibili (nuova prenotazione)
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false); // Stato di caricamento per disponibilità
  // Stati per orari disponibili (modifica prenotazione)
  const [editAvailableTimes, setEditAvailableTimes] = useState<string[]>([]);

  // Stati per modifica prenotazione
  const [editingBooking, setEditingBooking] = useState<BookingItem | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDuration, setEditDuration] = useState(1);
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Stati per cancellazione prenotazione
  const [cancelTarget, setCancelTarget] = useState<BookingItem | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Apre il modale di nuova prenotazione
  const openBooking = useCallback((field: FieldItem) => { // Imposta il campo selezionato per la prenotazione
    setBookingField(field);
    setBookingDate("");
    setBookingTime("");
    setBookingDuration(1);
    setBookingError(null);
    setBookingSuccess(null);
    setAvailableTimes([]); // Resetta gli orari disponibili
  }, []);

  // Carica la disponibilità di orari (nuova prenotazione)
  const loadAvailability = useCallback(async (fieldId: number, date: string, duration: number) => {
    if (!date) { // Se non c'è una data
      setAvailableTimes([]); // Resetta gli orari disponibili
      return; 
    }

    // Inizia il caricamento della disponibilità
    setAvailabilityLoading(true);
    try {
      const response = await fetch(`/api/bookings?fieldId=${fieldId}&date=${date}`, { // Richiesta API per ottenere le prenotazioni del campo in una data specifica
        cache: "no-store", // Disabilita la cache
      });
      const data = (await response.json()) as { // Estrai i dati della risposta
        bookings?: Array<{ startDate: string; endDate: string }>; // Prenotazioni esistenti
      };
      const booked = (data.bookings ?? []).map((item) => ({ // Mappa le prenotazioni esistenti in oggetti con date di inizio e fine
        start: new Date(item.startDate),
        end: new Date(item.endDate),
      }));

      // Genera gli slot orari disponibili
      const slots = Array.from({ length: 28 }).flatMap((_, i) => {
        const hour = 8 + Math.floor(i / 2);
        const minute = i % 2 === 0 ? "00" : "30";
        return `${String(hour).padStart(2, "0")}:${minute}`;
      });

      // Filtra gli orari disponibili escludendo quelli già prenotati
      const available = slots.filter((time) => {
        const start = new Date(`${date}T${time}:00`); //
        const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
        return !booked.some((item) => start < item.end && end > item.start); // Verifica conflitti con prenotazioni esistenti
      });

      setAvailableTimes(available); // Imposta gli orari disponibili
    } finally {
      setAvailabilityLoading(false);
    }
  }, []);

  // Carica la disponibilità di orari (modifica prenotazione)
  const loadEditAvailability = useCallback(async (fieldId: number, date: string, duration: number, bookingId: number) => {
    if (!date) {
      setEditAvailableTimes([]); // Resetta gli orari disponibili per la modifica
      return;
    }

    setAvailabilityLoading(true);
    try {
      const response = await fetch(`/api/bookings?fieldId=${fieldId}&date=${date}&excludeBookingId=${bookingId}`, { // Esclude la prenotazione in modifica
        cache: "no-store",
      });
      const data = (await response.json()) as {
        bookings?: Array<{ startDate: string; endDate: string, id?: number }>;
      };
      const booked = (data.bookings ?? []).map((item) => ({ // Mappa le prenotazioni esistenti
        start: new Date(item.startDate),
        end: new Date(item.endDate),
        id: item.id
      }));

      // Genera gli slot orari disponibili
      const slots = Array.from({ length: 28 }).flatMap((_, i) => {
        const hour = 8 + Math.floor(i / 2);
        const minute = i % 2 === 0 ? "00" : "30";
        return `${String(hour).padStart(2, "0")}:${minute}`;
      });

      // Filtra gli orari disponibili escludendo quelli già prenotati
      const available = slots.filter((time) => {
        const start = new Date(`${date}T${time}:00`);
        const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
        return !booked.some((item) => start < item.end && end > item.start);
      });

      setEditAvailableTimes(available); // Imposta gli orari disponibili per la modifica
    } finally {
      setAvailabilityLoading(false);
    }
  }, []);

  // Conferma la prenotazione
  const confirmBooking = useCallback(
    async (userId: number, fieldId: number, date: string, time: string, durationHours: number, onSuccess: () => void) => {
      setBookingLoading(true);
      setBookingError(null); // Resetta errori precedenti
      setBookingSuccess(null); // Resetta messaggi precedenti

      try {
        const response = await fetch("/api/bookings", {
          method: "POST", // Metodo POST per creare una nuova prenotazione
          headers: { "Content-Type": "application/json" }, // Intestazioni della richiesta
          body: JSON.stringify({ // Corpo della richiesta con i dati della prenotazione
            userId,
            fieldId,
            date,
            time,
            durationHours,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setBookingError(data?.message ?? "Prenotazione non riuscita.");
          return false;
        }

        setBookingSuccess("Prenotazione confermata!");
        setBookingField(null); // Chiude il modale di prenotazione
        setBookingDate(""); // Resetta la data
        setBookingTime("");
        setBookingDuration(1);
        onSuccess(); // Callback di successo
        return true;
      } finally {
        setBookingLoading(false);
      }
    },
    []
  );

  // Apre il modale di modifica prenotazione
  const openEditBooking = useCallback((booking: BookingItem) => {
    setEditingBooking(booking);
    const start = new Date(booking.startDate); // Estrai la data di inizio della prenotazione
    setEditDate(start.toISOString().slice(0, 10)); // Imposta la data di modifica
    setEditTime(start.toTimeString().slice(0, 5)); // Imposta l'orario di modifica
    const hours = (new Date(booking.endDate).getTime() - start.getTime()) / (60 * 60 * 1000); // Calcola la durata in ore
    setEditDuration(hours === 1.5 ? 1.5 : 1); // Imposta la durata di modifica
    setEditError(null); // Resetta errori precedenti
    // Carica la disponibilità per la modifica
    if (booking.field && booking.field.id) {
      loadEditAvailability(booking.field.id, start.toISOString().slice(0, 10), hours === 1.5 ? 1.5 : 1, booking.id); // Carica orari disponibili per la modifica
    }
  }, [loadEditAvailability]);

  // Conferma la modifica della prenotazione
  const confirmEditBooking = useCallback(
    async (userId: number, bookingId: number, date: string, time: string, durationHours: number, onSuccess: () => void) => {
      setEditLoading(true);
      setEditError(null);

      try {
        const response = await fetch("/api/bookings", {
          method: "PATCH", // Metodo PATCH per modificare una prenotazione esistente
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            bookingId,
            date,
            time,
            durationHours,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setEditError(data?.message ?? "Modifica non riuscita.");
          return false;
        }

        setEditingBooking(null);
        onSuccess();
        return true;
      } finally {
        setEditLoading(false);
      }
    },
    []
  );

  // Richiede la cancellazione di una prenotazione
  const requestCancelBooking = useCallback((booking: BookingItem) => {
    setCancelTarget(booking); // Imposta la prenotazione da cancellare
  }, []);

  // Conferma la cancellazione della prenotazione
  const confirmCancelBooking = useCallback(
    async (userId: number, bookingId: number, onSuccess: () => void) => {
      setCancelLoading(true);

      try {
        const response = await fetch("/api/bookings", {
          method: "DELETE", // Metodo DELETE per cancellare una prenotazione
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, bookingId }),
        });

        if (response.ok) {
          setCancelTarget(null);
          onSuccess(); // Callback di successo
          return true;
        }
        return false;
      } finally {
        setCancelLoading(false);
      }
    },
    []
  );

  return {
    // Nuova prenotazione
    bookingField,
    setBookingField,
    bookingDate,
    setBookingDate,
    bookingTime,
    setBookingTime,
    bookingDuration,
    setBookingDuration,
    bookingError,
    bookingSuccess,
    bookingLoading,
    openBooking,
    confirmBooking,

    // Orari disponibili
    availableTimes,
    availabilityLoading,
    loadAvailability,

    // Modifica prenotazione
    editingBooking,
    setEditingBooking,
    editDate,
    setEditDate,
    editTime,
    setEditTime,
    editDuration,
    setEditDuration,
    editError,
    editLoading,
    openEditBooking,
    confirmEditBooking,
    editAvailableTimes,

    // Cancellazione prenotazione
    cancelTarget,
    setCancelTarget,
    cancelLoading,
    requestCancelBooking,
    confirmCancelBooking,
  };
}
