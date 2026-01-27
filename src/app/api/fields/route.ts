// Restituisce tutti i campi con info proprietario anche per utenti normali
export async function GET() {
  try {
    const fields = await prisma.field.findMany({
      include: {
        owner: {
          include: {
            user: true
          }
        }
      }
    });
    // Mappa i dati per includere ownerName e ownerEmail
    const result = fields.map(field => ({
      id: field.id,
      name: field.name,
      size: field.size,
      location: field.location,
      imageUrl: field.imageUrl,
      ownerName: field.owner?.user?.name ?? null,
      ownerEmail: field.owner?.user?.email ?? null,
    }));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: "Errore del server." }, { status: 500 });
  }
}
import { NextResponse } from "next/server"; // Importa NextResponse per creare risposte API
import { prisma } from "@/lib/db"; // Importa l'istanza di Prisma per interagire con il database

// Gestisce le richieste GET, POST, PATCH e DELETE all'endpoint dei campi
export async function POST(request: Request) { 
  try {
    const body = await request.json(); 
    const { userId, name, size, location, imageUrl } = body as { 
      userId?: number;
      name?: string;
      size?: string;
      location?: string | null;
      imageUrl?: string | null;
    };

    // Verifica che tutti i dati necessari siano presenti
    if (!userId || !name || !size) {
      return NextResponse.json({ message: "Dati mancanti." }, { status: 400 });
    }

    // Verifica che l'utente sia un proprietario valido
    const owner = await prisma.owner.findUnique({ where: { userId } });
    if (!owner) {
      return NextResponse.json(
        { message: "Permesso negato." },
        { status: 403 }
      );
    }

    // Crea un nuovo campo nel database
    const created = await prisma.field.create({
      data: {
        name: name.trim(),
        size: size.trim(),
        location: location?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        ownerId: owner.id,
      },
    });

    // Ritorna i dati del campo creato
    return NextResponse.json(created);
  } catch (error) {
    return NextResponse.json(
      { message: "Errore del server." },
      { status: 500 }
    );
  }
}

// Gestisce l'aggiornamento di un campo esistente
export async function PATCH(request: Request) {
  try {
    const body = await request.json(); 
    const { userId, fieldId, name, size, location, imageUrl } = body as { 
      userId?: number; 
      fieldId?: number; 
      name?: string;
      size?: string;
      location?: string | null;
      imageUrl?: string | null;
    };

    // Verifica che tutti i dati necessari siano presenti
    if (!userId || !fieldId || !name || !size) {
      return NextResponse.json({ message: "Dati mancanti." }, { status: 400 });
    }

    // Verifica che l'utente sia un proprietario valido
    const owner = await prisma.owner.findUnique({ where: { userId } });
    if (!owner) {
      return NextResponse.json(
        { message: "Permesso negato." },
        { status: 403 }
      );
    }

    // Verifica che il campo esista e appartenga al proprietario
    const field = await prisma.field.findUnique({ where: { id: fieldId } });
    if (!field || field.ownerId !== owner.id) { 
      return NextResponse.json(
        { message: "Campo non trovato." },
        { status: 404 }
      );
    }

    // Aggiorna il campo nel database
    const updated = await prisma.field.update({
      where: { id: fieldId },
      data: {
        name: name.trim(),
        size: size.trim(),
        location: location?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
      },
    });

    // Ritorna i dati del campo aggiornato
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Errore del server." },
      { status: 500 }
    );
  }
}

// Gestisce la cancellazione di un campo
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userId, adminId, fieldId } = body as {
      userId?: number;
      adminId?: number;
      fieldId?: number;
    };

    // Verifica che tutti i dati necessari siano presenti
    if (!fieldId || (!userId && !adminId)) {
      return NextResponse.json({ message: "Dati mancanti." }, { status: 400 });
    }

    // Verifica i permessi dell'utente
    if (adminId) {
      const admin = await prisma.admin.findUnique({ where: { userId: adminId } });
      if (!admin) {
        return NextResponse.json(
          { message: "Permesso negato." },
          { status: 403 }
        );
      }
    } else {
      const owner = await prisma.owner.findUnique({ where: { userId } }); // Controlla se l'utente è un proprietario valido
      if (!owner) {
        return NextResponse.json(
          { message: "Permesso negato." },
          { status: 403 }
        );
      }

      // Verifica che il campo esista e appartenga al proprietario
      const field = await prisma.field.findUnique({ where: { id: fieldId } });
      if (!field || field.ownerId !== owner.id) {
        return NextResponse.json(
          { message: "Campo non trovato." },
          { status: 404 }
        );
      }
    }

    // Elimina il campo e le relative prenotazioni in una transazione
    await prisma.$transaction(async (tx) => {
      await tx.booking.deleteMany({ where: { fieldId } });
      await tx.field.delete({ where: { id: fieldId } });
    });

    // Ritorna una risposta di successo
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Errore del server." },
      { status: 500 }
    );
  }
}
