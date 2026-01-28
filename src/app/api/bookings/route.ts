import { NextResponse } from "next/server"; // Importa NextResponse per creare risposte API
import { prisma } from "@/lib/db"; // Importa l'istanza di Prisma per interagire con il database
 
// Gestisce le richieste GET all'endpoint delle prenotazioni
export async function GET(request: Request) { // Recupera le prenotazioni per un campo e una data specifici
  try {
    const { searchParams } = new URL(request.url); // Estrae i parametri di ricerca dall'URL
    const fieldId = Number(searchParams.get("fieldId")); // Ottiene l'ID del campo dai parametri di ricerca
    const date = searchParams.get("date"); // Ottiene la data dai parametri di ricerca
    const excludeBookingId = searchParams.get("excludeBookingId");

    // Verifica che i dati necessari siano presenti
    if (!fieldId || !date) {
      return NextResponse.json({ message: "Dati mancanti." }, { status: 400 });
    }

    const startOfDay = new Date(`${date}T00:00:00`); // Inizio della giornata per la data specificata
    const endOfDay = new Date(`${date}T23:59:59`); // Fine della giornata per la data specificata

    // Recupera le prenotazioni per il campo e la data specificati, escludendo la prenotazione in modifica se presente
    const bookings = await prisma.booking.findMany({
      where: {
        fieldId,
        startDate: { lte: endOfDay }, 
        endDate: { gte: startOfDay },
        ...(excludeBookingId ? { NOT: { id: Number(excludeBookingId) } } : {}),
      },
      orderBy: { startDate: "asc" }, // Ordina le prenotazioni per data di inizio in ordine ascendente
      select: { id: true, startDate: true, endDate: true }, // Seleziona solo gli ID e le date di inizio/fine delle prenotazioni
    });

    // Ritorna le prenotazioni trovate
    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json(
      { message: "Errore del server." },
      { status: 500 }
    );
  }
}

// Gestisce la creazione di una nuova prenotazione
export async function POST(request: Request) { 
  try {
    const body = await request.json(); 
    const { userId, fieldId, date, time, durationHours } = body as { 
      userId?: number; 
      fieldId?: number;
      date?: string;
      time?: string;
      durationHours?: number;
    };

    // Verifica che tutti i dati necessari siano presenti
    if (!userId || !fieldId || !date || !time) {
      return NextResponse.json(
        { message: "Dati mancanti." },
        { status: 400 }
      );
    }

    // Verifica che l'utente sia un giocatore valido
    const player = await prisma.player.findUnique({
      where: { userId },
    });

    // Se l'utente non è un giocatore, ritorna un errore
    if (!player) {
      return NextResponse.json(
        { message: "Utente non valido per la prenotazione." },
        { status: 400 }
      );
    }

    const startDate = new Date(`${date}T${time}:00`); // Data e ora di inizio della prenotazione
    const hours = durationHours && durationHours > 0 ? durationHours : 2; // Durata della prenotazione in ore
    const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000); // Calcola la data e ora di fine della prenotazione

    // Controlla se c'è un conflitto con altre prenotazioni esistenti
    const conflict = await prisma.booking.findFirst({
      where: {
        fieldId,
        startDate: { lt: endDate },
        endDate: { gt: startDate },
      },
    });

    // Se c'è un conflitto, ritorna un errore
    if (conflict) {
      return NextResponse.json(
        { message: "Orario non disponibile." },
        { status: 409 }
      );
    }

    // Crea la nuova prenotazione nel database
    const booking = await prisma.booking.create({
      data: {
        startDate,
        endDate,
        playerId: player.id,
        fieldId,
      },
      include: {
        field: true,
      },
    });

    // Ritorna i dettagli della prenotazione creata
    return NextResponse.json({ booking });
  } catch (error) {
    return NextResponse.json(
      { message: "Errore del server." },
      { status: 500 }
    );
  }
}

// Gestisce l'aggiornamento di una prenotazione esistente
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, bookingId, date, time, durationHours } = body as {
      userId?: number;
      bookingId?: number;
      date?: string;
      time?: string;
      durationHours?: number;
    };

    // Verifica che tutti i dati necessari siano presenti
    if (!userId || !bookingId || !date || !time) {
      return NextResponse.json(
        { message: "Dati mancanti." },
        { status: 400 }
      );
    }

    // Recupera la prenotazione esistente
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { player: true, field: true },
    });

    // Verifica che la prenotazione esista e che appartenga all'utente
    if (!booking || booking.player.userId !== userId) {
      return NextResponse.json(
        { message: "Prenotazione non trovata." },
        { status: 404 }
      );
    }

    const startDate = new Date(`${date}T${time}:00`); // Data e ora di inizio aggiornate
    const hours = durationHours && durationHours > 0 ? durationHours : 2; // Durata della prenotazione in ore, default a 2
    const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000); // Calcola la data e ora di fine aggiornata

    // Controlla se c'è un conflitto con altre prenotazioni esistenti
    const conflict = await prisma.booking.findFirst({
      where: {
        fieldId: booking.fieldId,
        startDate: { lt: endDate },
        endDate: { gt: startDate },
        NOT: { id: booking.id },
      },
    });

    // Se c'è un conflitto, ritorna un errore
    if (conflict) {
      return NextResponse.json(
        { message: "Orario non disponibile." },
        { status: 409 }
      );
    }

    // Aggiorna la prenotazione nel database
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        startDate,
        endDate,
      },
      include: { field: true },
    });

    // Ritorna i dettagli della prenotazione aggiornata
    return NextResponse.json({ booking: updated });
  } catch (error) {
    return NextResponse.json(
      { message: "Errore del server." },
      { status: 500 }
    );
  }
}

// Gestisce la cancellazione di una prenotazione
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userId, adminId, bookingId } = body as {
      userId?: number;
      adminId?: number;
      bookingId?: number;
    };

    // Verifica che tutti i dati necessari siano presenti
    if (!bookingId || (!userId && !adminId)) {
      return NextResponse.json(
        { message: "Dati mancanti." },
        { status: 400 }
      );
    }

    // Recupera la prenotazione esistente
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { player: true },
    });

    // Verifica che la prenotazione esista e che l'utente abbia i permessi per cancellarla
    if (!booking) {
      return NextResponse.json(
        { message: "Prenotazione non trovata." },
        { status: 404 }
      );
    }

    // Se è un admin, verifica che sia valido
    if (adminId) {
      const admin = await prisma.admin.findUnique({ where: { userId: adminId } }); // Controlla se l'utente è un admin valido
      if (!admin) {
        return NextResponse.json(
          { message: "Permesso negato." },
          { status: 403 }
        );
      }
    } else if (booking.player.userId !== userId) { // Altrimenti, verifica che la prenotazione appartenga all'utente
      return NextResponse.json(
        { message: "Prenotazione non trovata." },
        { status: 404 }
      );
    }

    // Cancella la prenotazione dal database
    await prisma.booking.delete({ where: { id: bookingId } });

    // Ritorna una risposta di successo
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Errore del server." },
      { status: 500 }
    );
  }
}
