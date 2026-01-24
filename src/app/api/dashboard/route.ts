import { NextResponse } from "next/server"; // Importa NextResponse per creare risposte API
import { prisma } from "@/lib/db"; // Importa l'istanza di Prisma per interagire con il database

// Gestisce le richieste GET all'endpoint della dashboard
export async function GET(request: Request) { 
  const { searchParams } = new URL(request.url); // Estrae i parametri di ricerca dall'URL
  const role = searchParams.get("role"); // Ottiene il ruolo dell'utente dai parametri di ricerca
  const userIdParam = searchParams.get("userId"); // Ottiene l'ID utente dai parametri di ricerca
  const userId = userIdParam ? Number(userIdParam) : null; // Converte l'ID utente in numero se presente

  // Verifica che il ruolo sia presente
  if (!role) {
    return NextResponse.json({ message: "Ruolo mancante." }, { status: 400 });
  }

  // Gestisce la logica in base al ruolo dell'utente
  try {
    if (role === "PLAYER") {
      if (!userId || Number.isNaN(userId)) { 
        return NextResponse.json(
          { message: "UserId mancante." },
          { status: 400 }
        );
      }

      // Recupera i dati del giocatore dal database
      const user = await prisma.user.findFirst({ 
        where: { id: userId, role: "PLAYER" },
        include: {
          player: {
            include: { // Includi le prenotazioni del giocatore
              bookings: {
                include: { field: true },
                orderBy: { startDate: "asc" },
              },
            },
          },
        },
      });

      // Recupera tutti i campi disponibili
      const fields = await prisma.field.findMany({ orderBy: { id: "asc" } });

      // Ritorna i dati del giocatore e i campi
      return NextResponse.json({ user, fields });
    }

    // Gestisce il ruolo del proprietario
    if (role === "OWNER") {
      if (!userId || Number.isNaN(userId)) {
        return NextResponse.json(
          { message: "UserId mancante." },
          { status: 400 }
        );
      }

      // Recupera i dati del proprietario dal database
      const owner = await prisma.owner.findFirst({
        where: { userId },
        include: {
          user: true,
          fields: {
            include: {
              bookings: {
                include: { player: { include: { user: true } } }, // Includi i dati utente del giocatore
                orderBy: { startDate: "asc" },
              },
            },
          },
        },
      });

      // Ritorna i dati del proprietario
      return NextResponse.json({ owner });
    }

    // Gestisce il ruolo dell'amministratore
    if (role === "ADMIN") {
      const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } }); // Recupera tutti gli utenti
      const fields = await prisma.field.findMany({ include: { owner: { include: { user: true } } } }); // Recupera tutti i campi con i rispettivi proprietari
      const bookings = await prisma.booking.findMany({ // Recupera tutte le prenotazioni
        include: {
          field: true,
          player: { include: { user: true } },
        },
        orderBy: { startDate: "asc" },
      });

      // Ritorna gli utenti, i campi e le prenotazioni
      return NextResponse.json({ users, fields, bookings });
    }

    // Gestisce il caso di ruolo non valido
    return NextResponse.json({ message: "Ruolo non valido." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: "Errore del server." }, { status: 500 });
  }
}
