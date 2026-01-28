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

      // Recupera i dati del giocatore dal database (solo prenotazioni future)
      const now = new Date();
      const user = await prisma.user.findFirst({ 
        where: { id: userId, role: "PLAYER" },
        include: {
          player: {
            include: { // Includi le prenotazioni del giocatore
              bookings: {
                where: { endDate: { gte: now } },
                include: { field: true },
                orderBy: { startDate: "asc" },
              },
            },
          },
        },
      });

      // Recupera tutti i campi disponibili con info proprietario
      const fieldsRaw = await prisma.field.findMany({ include: { owner: { include: { user: true } } }, orderBy: { id: "asc" } });
      // Mappa i campi per includere il nome e l'email del proprietario
      const fields = fieldsRaw.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        location: f.location,
        imageUrl: f.imageUrl,
        ownerName: f.owner?.user?.name ?? "N/A",
        ownerEmail: f.owner?.user?.email ?? "N/A"
      }));
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

      // Recupera i dati del proprietario dal database (solo prenotazioni future)
      const now = new Date();
      const owner = await prisma.owner.findFirst({
        where: { userId },
        include: {
          user: true,
          fields: {
            include: {
              bookings: {
                where: { endDate: { gte: now } },
                include: { player: { include: { user: true } } },
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
      // Recupera tutti i campi con i rispettivi proprietari
      const fieldsRaw = await prisma.field.findMany({ include: { owner: { include: { user: true } } } });
      // Mappa i campi per includere il nome e l'email del proprietario
      const fields = fieldsRaw.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        location: f.location,
        imageUrl: f.imageUrl,
        ownerName: f.owner?.user?.name ?? "N/A",
        ownerEmail: f.owner?.user?.email ?? "N/A"
      }));
      // Recupera solo le prenotazioni future per l'admin
      const bookings = await prisma.booking.findMany({
        where: { endDate: { gte: new Date() } },
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
