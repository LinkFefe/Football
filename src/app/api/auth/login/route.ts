import { NextResponse } from "next/server"; // Importa NextResponse per creare risposte API
import bcrypt from "bcryptjs"; // Importa bcryptjs per il confronto delle password
import { prisma } from "@/lib/db"; // Importa l'istanza di Prisma per interagire con il database

// Gestisce le richieste POST all'endpoint di login
export async function POST(request: Request) { // Riceve la richiesta di login
  try {
    const body = await request.json(); 
    const { email, password, role } = body as { 
      email?: string; //
      password?: string;
      role?: "PLAYER" | "OWNER" | "ADMIN"; 
    };

    // Verifica che tutte le credenziali siano presenti
    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Credenziali mancanti." },
        { status: 400 }
      );
    }

    // Cerca l'utente nel database in base all'email
    const user = await prisma.user.findUnique({ where: { email } });

    // Verifica che l'utente esista e che il ruolo corrisponda
    if (!user || user.role !== role) {
      return NextResponse.json(
        { message: "Credenziali non valide." },
        { status: 401 }
      );
    }

    // Confronta la password fornita con l'hash memorizzato
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { message: "Credenziali non valide." },
        { status: 401 }
      );
    }

    // Ritorna i dati della sessione senza includere la password
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    // Gestisce eventuali errori del server
  } catch (error) {
    return NextResponse.json(
      { message: "Errore del server." },
      { status: 500 }
    );
  }
}
