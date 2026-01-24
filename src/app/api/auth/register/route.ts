import { NextResponse } from "next/server"; // Importa NextResponse per creare risposte API
import bcrypt from "bcryptjs"; // Importa bcryptjs per l'hashing delle password
import { prisma } from "@/lib/db"; // Importa l'istanza di Prisma per interagire con il database
 
// Gestisce le richieste POST all'endpoint di registrazione
export async function POST(request: Request) { // Riceve la richiesta di registrazione
  try {
    const body = await request.json(); 
    const { name, email, password, role } = body as {  
      name?: string;
      email?: string;
      password?: string;
      role?: "PLAYER" | "OWNER" | "ADMIN";
    };

    // Verifica che tutti i dati necessari siano presenti
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Dati mancanti." },
        { status: 400 }
      );
    }

    // Controlla se l'email è già registrata
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "Email già registrata." },
        { status: 409 }
      );
    }

    // Crea l'hash della password
    const passwordHash = await bcrypt.hash(password, 10);

    // Crea un nuovo utente nel database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        player: role === "PLAYER" ? { create: {} } : undefined,
        owner: role === "OWNER" ? { create: {} } : undefined,
        admin: role === "ADMIN" ? { create: {} } : undefined,
      },
    });

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
