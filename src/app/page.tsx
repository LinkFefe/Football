import Link from "next/link"; // Importa il componente Link di Next.js per la navigazione tra pagine
import { prisma } from "@/lib/db"; // Importa l'istanza di Prisma per interagire con il database

// Componente principale della pagina Home
export default async function Home() {
  const now = new Date(); //
  const [upcomingMatchesCount, availableFieldsCount, registeredUsersCount] =
    await Promise.all([ // Esegue tre query al database in parallelo per ottenere le statistiche
      prisma.booking.count(),
      prisma.field.count(),
      prisma.user.count(),
    ]);
  
  // Ritorna il markup JSX della pagina Home
  return (
    <div className="bg-[#0b0f14] text-white">
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_55%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-20 md:flex-row md:items-center">
          <div className="flex flex-1 flex-col gap-6">
            <span className="w-fit rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-xs uppercase tracking-[0.25em] text-emerald-200">
              Prenotazioni online 24/7
            </span>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Prenota il tuo campetto da calcio in pochi clic.
            </h1>
            <p className="text-lg text-white/70">
              Una piattaforma moderna e intuitiva per giocatori e proprietari di campi.
              Disponibilità in tempo reale, gestione centralizzata
              delle prenotazioni e dashboard personalizzate.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-[#0b0f14] hover:bg-emerald-400"
              >
                Accedi ora
              </Link>
              <a
                href="#vantaggi"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-emerald-300"
              >
                Scopri i vantaggi
              </a>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Prossimi match", value: String(upcomingMatchesCount) }, // Statistiche da visualizzare
                { label: "Campi disponibili", value: String(availableFieldsCount) },
                { label: "Utenti registrati", value: String(registeredUsersCount) },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
                >
                  <p className="text-2xl font-semibold text-emerald-200">
                    {stat.value}
                  </p>
                  <p className="text-xs text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="vantaggi" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Prenotazione veloce",
              text: "Seleziona campo, data e orario in pochi passaggi.",
            },
            {
              title: "Disponibilità reale",
              text: "Aggiornamenti istantanei su campi liberi e prenotati.",
            },
            {
              title: "Gestione centralizzata",
              text: "Dashboard per utenti e proprietari",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold text-emerald-200">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-white/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="come-funziona" className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold">Come funziona</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              "Scegli il campo ideale in base a posizione e grandezza.",
              "Seleziona data e orario disponibili in tempo reale.",
              "Conferma la prenotazione e gestisci tutto dal tuo profilo.",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-white/10 bg-[#0b0f14]/60 p-5"
              >
                <p className="text-sm text-emerald-200">Step {index + 1}</p>
                <p className="mt-2 text-sm text-white/70">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 p-10 text-center">
          <h2 className="text-2xl font-semibold">Pronto a prenotare?</h2>
          <p className="text-sm text-white/70">
            Accedi alla tua area privata e gestisci prenotazioni e campi.
          </p>
          <Link
            href="/login"
            className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-[#0b0f14] hover:bg-emerald-400"
          >
            Vai al login
          </Link>
        </div>
      </section>
    </div>
  );
}