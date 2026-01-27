import { PrismaClient } from "@prisma/client";

// Crea un'istanza singleton di PrismaClient per evitare connessioni multiple in ambienti di sviluppo
const globalForPrisma = globalThis as unknown as { 
  prisma?: PrismaClient; // Proprietà opzionale per l'istanza di PrismaClient
};

// Esporta l'istanza di PrismaClient
export const prisma =
  globalForPrisma.prisma ?? // Se esiste già un'istanza, usala
  new PrismaClient({
    log: ["error", "warn"], // Logga solo errori e avvisi
  });

if (process.env.NODE_ENV !== "production") { // In ambienti di sviluppo, assegna l'istanza globale
  globalForPrisma.prisma = prisma;
}
