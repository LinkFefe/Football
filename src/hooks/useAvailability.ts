import { useMemo } from "react";
import { BookingItem } from "@/lib/types";

// Calcola i giorni del calendario con prenotazioni
export function useCalendarDays(bookings: BookingItem[]) {
  return useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const bookingDays = new Set(
      bookings.map((booking) => new Date(booking.startDate).getDate())
    );

    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      return { day, hasBooking: bookingDays.has(day) };
    });
  }, [bookings]);
}

// Calcola la prossima prenotazione
export function useNextBooking(bookings: BookingItem[]) {
  return useMemo(() => {
    const now = new Date();
    const upcoming = bookings
      .map((booking) => ({
        ...booking,
        start: new Date(booking.startDate),
      }))
      .filter((booking) => booking.start >= now)
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    if (upcoming.length > 0) {
      return upcoming[0];
    }

    return bookings[0];
  }, [bookings]);
}

// Calcola il numero di prenotazioni future
export function useUpcomingBookingsCount(bookings: BookingItem[]) {
  return useMemo(() => {
    const now = new Date();
    return bookings.filter((booking) => new Date(booking.startDate) >= now).length;
  }, [bookings]);
}

// Calcola il numero totale di prenotazioni
export function useTotalBookingsCount(bookings: BookingItem[]) {
  return useMemo(() => {
    return bookings.length;
  }, [bookings]);
}

// Calcola le ore occupate in un giorno specifico per un campo
export function useBusyHours(
  fieldId: number,
  day: number,
  fields: Array<{ id: number; bookings: Array<{ startDate: string; endDate: string }> }>
) {
  return useMemo(() => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field || !Array.isArray(field.bookings)) return [];
    const bookings = field.bookings.filter((b) => {
      const d = new Date(b.startDate);
      return d.getDate() === day;
    });
    return bookings.map((b) => new Date(b.startDate).getHours());
  }, [fieldId, day, fields]);
}
