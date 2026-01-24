import { NextResponse } from "next/server"; // Importa NextResponse per creare risposte API
import bcrypt from "bcryptjs"; // Importa bcryptjs per l'hashing delle password
import { prisma } from "@/lib/db"; // Importa l'istanza di Prisma per interagire con il database

// Gestisce le richieste PATCH all'endpoint del profilo
export async function PATCH(request: Request) {
  try {
    const body = await request.json(); 
    const { userId, name, oldPassword, newPassword } = body as { 
      userId?: number;
      name?: string;
      oldPassword?: string;
      newPassword?: string;
    };

    // Verifica che l'ID utente sia presente
    if (!userId) {
      return NextResponse.json({ message: "Dati mancanti." }, { status: 400 });
    }

    // Recupera l'utente dal database
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Verifica che l'utente esista
    if (!user) {
      return NextResponse.json({ message: "Utente non trovato." }, { status: 404 });
    }

    // Gestisce l'aggiornamento della password se fornita
    let passwordHash: string | undefined;

    // Se è stata richiesta una nuova password, verifica l'attuale e crea l'hash della nuova password
    if (newPassword) {
      if (!oldPassword) {
        return NextResponse.json(
          { message: "Inserisci la password attuale." },
          { status: 400 }
        );
      }

      // Verifica che la password attuale sia corretta
      const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { message: "Password attuale non corretta." },
          { status: 401 }
        );
      }

      // Crea l'hash della nuova password
      passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // Aggiorna i dati dell'utente nel database
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name ?? user.name,
        passwordHash: passwordHash ?? user.passwordHash,
      },
    });

    // Ritorna i dati aggiornati dell'utente senza includere la password
    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Errore del server." },
      { status: 500 }
    );
  }
}

// Gestisce le richieste DELETE all'endpoint del profilo
export async function DELETE(request: Request) {
  try {
    const body = await request.json(); 
    const { userId, adminId, targetUserId } = body as {
      userId?: number;
      adminId?: number;
      targetUserId?: number;
    };

    // Verifica i permessi se si sta tentando di eliminare un altro utente
    if (targetUserId) {
      if (!adminId) {
        return NextResponse.json(
          { message: "Permesso negato." },
          { status: 403 }
        );
      }

      // Verifica che l'admin sia valido
      const admin = await prisma.admin.findUnique({ where: { userId: adminId } });
      if (!admin) {
        return NextResponse.json(
          { message: "Permesso negato." },
          { status: 403 }
        );
      }
    }

    // Determina l'ID utente effettivo da eliminare
    const effectiveUserId = targetUserId ?? userId;

    // Verifica che l'ID utente effettivo sia presente
    if (!effectiveUserId) {
      return NextResponse.json({ message: "Dati mancanti." }, { status: 400 });
    }

    // Recupera l'utente dal database
    const user = await prisma.user.findUnique({
      where: { id: effectiveUserId },
      include: {
        player: true,
        owner: { include: { fields: true } },
        admin: true,
      },
    });

    // Verifica che l'utente esista
    if (!user) {
      return NextResponse.json({ message: "Utente non trovato." }, { status: 404 });
    }

    // Elimina l'utente e i relativi dati in una transazione
    await prisma.$transaction(async (tx) => {
      if (user.player) {
        await tx.booking.deleteMany({ where: { playerId: user.player.id } }); // Elimina le prenotazioni del giocatore
        await tx.player.delete({ where: { id: user.player.id } }); // Elimina il profilo del giocatore
      }

      // Elimina i campi e le prenotazioni associate se l'utente è un proprietario
      if (user.owner) {
        const fieldIds = user.owner.fields.map((field) => field.id);
        if (fieldIds.length) {
          await tx.booking.deleteMany({ where: { fieldId: { in: fieldIds } } });
          await tx.field.deleteMany({ where: { id: { in: fieldIds } } });
        }
        await tx.owner.delete({ where: { id: user.owner.id } });
      }

      // Elimina il profilo admin se l'utente è un admin
      if (user.admin) {
        await tx.admin.delete({ where: { id: user.admin.id } });
      }

      // Elimina l'utente
      await tx.user.delete({ where: { id: effectiveUserId } });
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