"use client"; // Abilita il rendering lato client per questa pagina

import { useEffect, useState } from "react"; // Importa gli hook useEffect e useState da React
import { useRouter } from "next/navigation"; // Importa l'hook useRouter di Next.js per la navigazione programmata

type Role = "PLAYER" | "OWNER" | "ADMIN"; // Definisce i ruoli utente disponibili

// Definisce il tipo Session per rappresentare i dati della sessione utente
type Session = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

// Mappa i ruoli ai loro rispettivi etichette
const roleLabels: Record<Role, string> = {
  PLAYER: "Giocatore",
  OWNER: "Proprietario",
  ADMIN: "Amministratore",
};

// Suggerimenti di login predefiniti per ogni ruolo
const loginHints = {
  PLAYER: "nome@example.com",
  OWNER: "nome@example.com",
  ADMIN: "nome@example.com",
};

// Componente principale della pagina di login
export default function LoginPage() {
  const router = useRouter(); // Ottiene l'istanza del router per la navigazione
  const [role, setRole] = useState<Role>("PLAYER"); // Stato per il ruolo selezionato
  const [email, setEmail] = useState(loginHints.PLAYER); // Stato per l'email inserita
  const [password, setPassword] = useState("Password123!"); // Stato per la password inserita
  const [fullName, setFullName] = useState(""); // Stato per il nome completo (usato durante la registrazione)
  const [mode, setMode] = useState<"login" | "register">("login"); // Stato per la modalità corrente (login o registrazione)
  const [loading, setLoading] = useState(false); // Stato per indicare se una richiesta è in corso
  const [error, setError] = useState<string | null>(null); // Stato per memorizzare eventuali messaggi di errore

  // Aggiorna l'email suggerita quando il ruolo cambia
  useEffect(() => {
    setEmail(loginHints[role]);
  }, [role]);

  // Gestisce il processo di login
  async function handleLogin(event: React.FormEvent) { 
    event.preventDefault(); // Previene il comportamento predefinito del form
    setLoading(true);
    setError(null);

    // Effettua una richiesta POST all'endpoint di login
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    // Gestisce la risposta dell'endpoint
    if (!response.ok) {
      const data = await response.json();
      setError(data?.message ?? "Accesso non riuscito.");
      setLoading(false);
      return;
    }

    // Memorizza i dati della sessione e reindirizza alla dashboard
    const data = (await response.json()) as Session;
    localStorage.setItem("session", JSON.stringify(data)); // Salva la sessione in localStorage
    router.push("/dashboard"); 
  }

  // Gestisce il processo di registrazione
  async function handleRegister(event: React.FormEvent) {
    event.preventDefault(); 
    setLoading(true); 
    setError(null);

    // Effettua una richiesta POST all'endpoint di registrazione
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Imposta l'intestazione per il tipo di contenuto JSON
      body: JSON.stringify({
        name: fullName,
        email,
        password,
        role,
      }),
    });

    // Gestisce la risposta dell'endpoint
    if (!response.ok) {
      const data = await response.json();
      setError(data?.message ?? "Registrazione non riuscita.");
      setLoading(false); 
      return;
    }

    // Memorizza i dati della sessione e reindirizza alla dashboard
    const data = (await response.json()) as Session;
    localStorage.setItem("session", JSON.stringify(data));
    router.push("/dashboard");
  }

  // Ritorna il markup JSX della pagina di login/registrazione
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                mode === "login"
                  ? "border-emerald-400 bg-emerald-400/20 text-emerald-200"
                  : "border-white/20 text-white/60 hover:border-emerald-400/60"
              }`}
            >
              Accedi
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                mode === "register"
                  ? "border-emerald-400 bg-emerald-400/20 text-emerald-200"
                  : "border-white/20 text-white/60 hover:border-emerald-400/60"
              }`}
            >
              Registrati
            </button>
          </div>
          <h1 className="mt-6 text-2xl font-semibold">
            {mode === "login" ? "Accedi alla dashboard" : "Crea un account"}
          </h1>
          <p className="mt-3 text-sm text-white/70">
            {mode === "login"
              ? "Inserisci le credenziali per accedere alla sezione privata."
              : "Compila i dati per creare un nuovo account."}
          </p>
          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={mode === "login" ? handleLogin : handleRegister}
          >
            <div className="flex flex-wrap gap-3">
              {(Object.keys(roleLabels) as Role[])
                .filter((item) => mode !== "register" || item !== "ADMIN")
                .map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setRole(item)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      role === item
                        ? "border-emerald-400 bg-emerald-400/20 text-emerald-200"
                        : "border-white/20 text-white/60 hover:border-emerald-400/60"
                    }`}
                  >
                    {roleLabels[item]}
                  </button>
                ))}
            </div>
            {mode === "register" ? (
              <label className="flex flex-col gap-2 text-sm">
                Nome
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="rounded-xl border border-white/10 bg-[#0b0f14]/80 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                  placeholder="Mario Rossi"
                />
              </label>
            ) : null}
            <label className="flex flex-col gap-2 text-sm">
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-xl border border-white/10 bg-[#0b0f14]/80 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                placeholder="email@esempio.it"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-xl border border-white/10 bg-[#0b0f14]/80 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                placeholder="********"
              />
            </label>
            {error ? (
              <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-[#0b0f14] hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading
                ? mode === "login"
                  ? "Accesso..."
                  : "Registrazione..."
                : mode === "login"
                ? "Accedi"
                : "Registrati"}
            </button>
          </form>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0b0f14]/80 p-6 text-sm text-white/70">
          <h3 className="text-lg font-semibold text-white">Accesso sicuro</h3>
          <p className="mt-3">
            Inserisci le credenziali associate al tuo account per accedere alla
            dashboard privata.
          </p>
        </div>
      </div>
    </div>
  );
}
