import { useMemo } from "react";
import { BookingItem } from "@/lib/types";

// Calcola i giorni del mese con prenotazioni
export function useCalendarDays(bookings: BookingItem[], month?: number, year?: number) {
  return useMemo(() => { // Memoizza il calcolo dei giorni del calendario
    const now = new Date();
    const selYear = typeof year === "number" ? year : now.getFullYear(); // Anno selezionato o corrente
    const selMonth = typeof month === "number" ? month : now.getMonth(); // Mese selezionato o corrente
    const daysInMonth = new Date(selYear, selMonth + 1, 0).getDate(); // Numero di giorni nel mese selezionato
    
    // Crea un set di giorni con prenotazioni
    const bookingDays = new Set( 
      bookings 
        .filter((booking) => { // Filtra le prenotazioni per il mese e anno selezionati
          const d = new Date(booking.startDate); // Estrai la data di inizio della prenotazione
          return d.getFullYear() === selYear && d.getMonth() === selMonth; // Controlla anno e mese
        })
        .map((booking) => new Date(booking.startDate).getDate()) // Mappa ai giorni del mese
    );
    return Array.from({ length: daysInMonth }, (_, index) => { // Crea un array di giorni del mese
      const day = index + 1; // Giorno del mese (1-based)
      return { day, hasBooking: bookingDays.has(day) }; // Ritorna il giorno e se ha una prenotazione
    });
  }, [bookings, month, year]);
}

// Calcola la prossima prenotazione
export function useNextBooking(bookings: BookingItem[]) {
  return useMemo(() => { // Memoizza il calcolo della prossima prenotazione
    const now = new Date();
    const upcoming = bookings // Filtra e ordina le prenotazioni future
      .map((booking) => ({ // Mappa le prenotazioni con la data di inizio come oggetto Date
        ...booking,
        start: new Date(booking.startDate),
      }))
      .filter((booking) => booking.start >= now) // Solo prenotazioni future
      .sort((a, b) => a.start.getTime() - b.start.getTime()); // Ordina per data di inizio

    if (upcoming.length > 0) { // Ritorna la prossima prenotazione se esiste
      return upcoming[0];
    }

    return bookings[0]; // Altrimenti ritorna la prima prenotazione disponibile
  }, [bookings]);
}

// Calcola il numero di prenotazioni future
export function useUpcomingBookingsCount(bookings: BookingItem[]) {
  return useMemo(() => { // Memoizza il calcolo del numero di prenotazioni future
    const now = new Date();
    return bookings.filter((booking) => new Date(booking.startDate) >= now).length;
  }, [bookings]);
}

// Calcola il numero totale di prenotazioni
export function useTotalBookingsCount(bookings: BookingItem[]) {
  return useMemo(() => { // Memoizza il calcolo del numero totale di prenotazioni
    return bookings.length;
  }, [bookings]);
}

// Calcola le ore occupate in un giorno specifico per un campo
export function useBusyHours(
  fieldId: number,
  day: number,
  fields: Array<{ id: number; bookings: Array<{ startDate: string; endDate: string }> }> // Campi con prenotazioni
) {
  return useMemo(() => {
    const field = fields.find((f) => f.id === fieldId); // Trova il campo con l'ID specificato
    if (!field || !Array.isArray(field.bookings)) return []; // Ritorna array vuoto se il campo non esiste o non ha prenotazioni
    const bookings = field.bookings.filter((b) => {
      const d = new Date(b.startDate); // Estrai la data di inizio della prenotazione
      return d.getDate() === day; // Filtra le prenotazioni per il giorno specificato
    });
    return bookings.map((b) => new Date(b.startDate).getHours()); // Ritorna le ore occupate
  }, [fieldId, day, fields]);
}
