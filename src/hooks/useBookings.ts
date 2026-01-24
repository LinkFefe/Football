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
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
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

  // Apre il modale di prenotazione
  const openBooking = useCallback((field: FieldItem) => {
    setBookingField(field);
    setBookingDate("");
    setBookingTime("");
    setBookingDuration(1);
    setBookingError(null);
    setBookingSuccess(null);
    setAvailableTimes([]);
  }, []);

  // Carica la disponibilità di orari (nuova prenotazione)
  const loadAvailability = useCallback(async (fieldId: number, date: string, duration: number) => {
    if (!date) {
      setAvailableTimes([]);
      return;
    }

    setAvailabilityLoading(true);
    try {
      const response = await fetch(`/api/bookings?fieldId=${fieldId}&date=${date}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as {
        bookings?: Array<{ startDate: string; endDate: string }>;
      };
      const booked = (data.bookings ?? []).map((item) => ({
        start: new Date(item.startDate),
        end: new Date(item.endDate),
      }));

      const slots = Array.from({ length: 28 }).flatMap((_, i) => {
        const hour = 8 + Math.floor(i / 2);
        const minute = i % 2 === 0 ? "00" : "30";
        return `${String(hour).padStart(2, "0")}:${minute}`;
      });

      const available = slots.filter((time) => {
        const start = new Date(`${date}T${time}:00`);
        const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
        return !booked.some((item) => start < item.end && end > item.start);
      });

      setAvailableTimes(available);
    } finally {
      setAvailabilityLoading(false);
    }
  }, []);

  // Carica la disponibilità di orari (modifica prenotazione)
  const loadEditAvailability = useCallback(async (fieldId: number, date: string, duration: number, bookingId: number) => {
    if (!date) {
      setEditAvailableTimes([]);
      return;
    }

    setAvailabilityLoading(true);
    try {
      const response = await fetch(`/api/bookings?fieldId=${fieldId}&date=${date}&excludeBookingId=${bookingId}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as {
        bookings?: Array<{ startDate: string; endDate: string, id?: number }>;
      };
      const booked = (data.bookings ?? []).map((item) => ({
        start: new Date(item.startDate),
        end: new Date(item.endDate),
        id: item.id
      }));

      const slots = Array.from({ length: 28 }).flatMap((_, i) => {
        const hour = 8 + Math.floor(i / 2);
        const minute = i % 2 === 0 ? "00" : "30";
        return `${String(hour).padStart(2, "0")}:${minute}`;
      });

      const available = slots.filter((time) => {
        const start = new Date(`${date}T${time}:00`);
        const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
        return !booked.some((item) => start < item.end && end > item.start);
      });

      setEditAvailableTimes(available);
    } finally {
      setAvailabilityLoading(false);
    }
  }, []);

  // Conferma la prenotazione
  const confirmBooking = useCallback(
    async (userId: number, fieldId: number, date: string, time: string, durationHours: number, onSuccess: () => void) => {
      setBookingLoading(true);
      setBookingError(null);
      setBookingSuccess(null);

      try {
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
        setBookingField(null);
        setBookingDate("");
        setBookingTime("");
        setBookingDuration(1);
        onSuccess();
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
    const start = new Date(booking.startDate);
    setEditDate(start.toISOString().slice(0, 10));
    setEditTime(start.toTimeString().slice(0, 5));
    const hours = (new Date(booking.endDate).getTime() - start.getTime()) / (60 * 60 * 1000);
    setEditDuration(hours === 1.5 ? 1.5 : 1);
    setEditError(null);
    // Carica la disponibilità per la modifica
    if (booking.field && booking.field.id) {
      loadEditAvailability(booking.field.id, start.toISOString().slice(0, 10), hours === 1.5 ? 1.5 : 1, booking.id);
    }
  }, [loadEditAvailability]);

  // Conferma la modifica della prenotazione
  const confirmEditBooking = useCallback(
    async (userId: number, bookingId: number, date: string, time: string, durationHours: number, onSuccess: () => void) => {
      setEditLoading(true);
      setEditError(null);

      try {
        const response = await fetch("/api/bookings", {
          method: "PATCH",
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
    setCancelTarget(booking);
  }, []);

  // Conferma la cancellazione della prenotazione
  const confirmCancelBooking = useCallback(
    async (userId: number, bookingId: number, onSuccess: () => void) => {
      setCancelLoading(true);

      try {
        const response = await fetch("/api/bookings", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, bookingId }),
        });

        if (response.ok) {
          setCancelTarget(null);
          onSuccess();
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
