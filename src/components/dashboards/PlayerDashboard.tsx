"use client"; // Abilita il rendering lato client

// Importa hook e tipi necessari
import { useState, useMemo, useEffect } from "react";
import { Session, DashboardData, FieldItem } from "@/lib/types";
import { useBookings } from "@/hooks/useBookings";
import { useProfile } from "@/hooks/useProfile";
import { useSidebar } from "../modals/SidebarModals";
import { useCalendarDays, useNextBooking, useTotalBookingsCount } from "@/hooks/useAvailability";
import { Sidebar } from "@/components/layout";
import { ProfileSettingsForm } from "@/components/dashboards/ProfileSettingsForm";
import { BookingModal, EditBookingModal, CancelBookingModal } from "@/components/modals";
import { FieldSlotsInfoModal } from "@/components/modals/FieldSlotsInfoModal";

// Importa i nuovi componenti modulari
import { PlayerStatsCard } from "./player/PlayerStatsCard";
import { PlayerNextMatchCard } from "./player/PlayerNextMatchCard";
import { PlayerFieldList } from "./player/PlayerFieldList";
import { PlayerCalendarCard } from "./player/PlayerCalendarCard";
import { PlayerBookingList } from "./player/PlayerBookingList";

// Definisci le proprietà del componente PlayerDashboard
interface PlayerDashboardProps {
  session: Session; // Dati della sessione utente
  dashboard: DashboardData; // Dati della dashboard
  reloadData: () => void; // Funzione per ricaricare i dati della dashboard
  setSession: (s: Session) => void; // Funzione per aggiornare la sessione utente
}

// Componente PlayerDashboard
export function PlayerDashboard({ session, dashboard, reloadData, setSession }: PlayerDashboardProps) {
    // Funzione per eliminare il profilo e reindirizzare
    const handleDeleteProfileAndRedirect = () => {
      profile.handleProfileDelete(session.id, () => {
        window.location.href = "/";
      });
    };
  const bookings = useBookings(); // Importa l'hook useBookings
  const profile = useProfile(); // Importa l'hook useProfile
  const { isOpen, close } = useSidebar(); // Importa l'hook useSidebar
  
  const [activeSection, setActiveSection] = useState<"Home" | "Impostazioni" | "Prenotazioni">("Home"); // Stato per la sezione attiva
  const [selectedField, setSelectedField] = useState<FieldItem | null>(null); // Stato per il campo selezionato
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth()); // 0-based
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // Stato per il giorno selezionato

  // Aggiorna il nome del profilo quando la sessione cambia
  useEffect(() => {
    if (session) profile.setProfileName(session.name);
  }, [session]);

  const playerBookings = useMemo(() => dashboard?.user?.player?.bookings ?? [], [dashboard]); // Prenotazioni del giocatore
  const nextBooking = useNextBooking(playerBookings); // Prossima prenotazione
  const totalBookingsCount = useTotalBookingsCount(playerBookings); // Conteggio totale delle prenotazioni
  const calendarDays = useCalendarDays(playerBookings); // Giorni del calendario
  const displayName = useMemo(() => session.name.split(" ")[0] || session.name, [session]); // Nome da visualizzare

  // Effetto per caricare la disponibilità di prenotazione quando cambiano i parametri
  useEffect(() => {
    if (!bookings.bookingField || !bookings.bookingDate) {
      bookings.loadAvailability(0, "", bookings.bookingDuration);
      return;
    }
    bookings.loadAvailability(bookings.bookingField.id, bookings.bookingDate, bookings.bookingDuration);
  }, [bookings.bookingField, bookings.bookingDate, bookings.bookingDuration]);

  // Funzioni di conferma azioni
  const handleConfirmBooking = async () => {
    if (!bookings.bookingField) return;
    await bookings.confirmBooking(
      session.id, bookings.bookingField.id, bookings.bookingDate,
      bookings.bookingTime, bookings.bookingDuration, reloadData
    );
  };

  // Funzione di conferma modifica prenotazione
  const handleConfirmEditBooking = async () => {
    if (!bookings.editingBooking) return;
    await bookings.confirmEditBooking(
      session.id, bookings.editingBooking.id, bookings.editDate,
      bookings.editTime, bookings.editDuration, reloadData
    );
  };

  // Funzione di conferma cancellazione prenotazione
  const handleConfirmCancelBooking = async () => {
    if (!bookings.cancelTarget) return;
    await bookings.confirmCancelBooking(session.id, bookings.cancelTarget.id, reloadData);
  };

  // Funzione di conferma modifica profilo
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await profile.handleProfileSave(
      session.id, profile.profileName, profile.oldPassword || undefined,
      profile.newPassword || undefined, profile.confirmPassword || undefined, setSession
    );
  };

  // Renderizza il componente PlayerDashboard
  return (
    <div className={`grid gap-6 ${isOpen ? "lg:grid-cols-[240px_1fr]" : "lg:grid-cols-[1fr]"}`}>
      
      {/* Sidebar Mobile & Desktop */}
      <Sidebar
        isOpen={isOpen} // Stato di apertura della sidebar
        onClose={close} // Funzione per chiudere la sidebar
        activeSection={activeSection} // Sezione attiva della dashboard
        onSectionChange={(section) => setActiveSection(section as any)} // Funzione per cambiare la sezione attiva
        sections={["Home", "Prenotazioni", "Impostazioni"]} 
      />

      <div className="space-y-6">
        {activeSection === "Home" && (
          <div className="space-y-6">
            {/* 1. Stats Card */}
            <PlayerStatsCard 
                displayName={displayName} 
                totalBookingsCount={totalBookingsCount} 
            />

            <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
              {/* 2. Next Match */}
              <PlayerNextMatchCard 
                nextBooking={nextBooking} 
              />

              {/* 3. Available Fields List */}
              <PlayerFieldList 
                fields={dashboard?.fields ?? []} 
                onBook={bookings.openBooking} 
                onInfo={(field) => { setSelectedField(field); setSelectedDay(null); }}
              />
            </div>

            {/* 4. Calendar */}
            <PlayerCalendarCard 
              bookings={playerBookings}
            />
          </div>
        )}

        {activeSection === "Prenotazioni" && (
          // 5. Booking List
          <PlayerBookingList 
            bookings={playerBookings}
            onEdit={bookings.openEditBooking}
            onCancel={bookings.requestCancelBooking}
          />
        )}

        {activeSection === "Impostazioni" && (
          <ProfileSettingsForm
            profileName={profile.profileName} setProfileName={profile.setProfileName} 
            oldPassword={profile.oldPassword} setOldPassword={profile.setOldPassword}
            newPassword={profile.newPassword} setNewPassword={profile.setNewPassword}
            confirmPassword={profile.confirmPassword} setConfirmPassword={profile.setConfirmPassword}
            showForm={profile.showProfileForm} setShowForm={profile.setShowProfileForm} // Mostra/nascondi form
            loading={profile.profileLoading} deleteLoading={profile.deleteProfileLoading} // Stati di caricamento
            error={profile.profileError} success={profile.profileSuccess} // Messaggi di errore/successo
            onSave={handleProfileSave} // Gestori di salvataggio
            onDeleteRequest={() => profile.setDeleteProfileConfirmOpen(true)} // Gestore di richiesta eliminazione profilo
          />
        )}
      </div>

      {/* Modale conferma eliminazione profilo */}
      {profile.deleteProfileConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0b0f14] p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Conferma eliminazione profilo</h3>
            <p className="text-white/70 mb-4">Sei sicuro di voler eliminare il tuo profilo? Questa azione è irreversibile.</p>
            <div className="flex gap-4 justify-end">
              <button
                className="rounded-full bg-red-500/20 px-4 py-2 text-red-200 font-semibold hover:bg-red-500/40"
                onClick={handleDeleteProfileAndRedirect}
                disabled={profile.deleteProfileLoading}
              >
                {profile.deleteProfileLoading ? "Eliminazione..." : "Elimina"}
              </button>
              <button
                className="rounded-full bg-white/10 px-4 py-2 text-white font-semibold hover:bg-white/20"
                onClick={() => profile.setDeleteProfileConfirmOpen(false)}
                disabled={profile.deleteProfileLoading}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Info Campo (aperta dalla PlayerFieldList) */}
      {selectedField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-md mx-auto bg-[#0b0f14] rounded-3xl border border-white/10 p-4 sm:p-6 overflow-auto custom-scrollbar" style={{maxHeight: '90vh'}}>
            <button className="absolute top-4 right-4 text-white/60 hover:text-white text-xl" onClick={() => { setSelectedField(null); setSelectedDay(null); }}>×</button>
            <img src={selectedField.imageUrl ?? "/images/field-1.svg"} alt={selectedField.name} className="mx-auto mb-4 rounded-2xl object-cover w-72 h-48" />
            <h2 className="text-2xl font-bold text-center text-white mb-2">{selectedField.name}</h2>
            <div className="mb-4">
              <p className="text-center text-emerald-200 mb-2">Seleziona un giorno</p>
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => {
                    if (selectedMonth === 0) {
                      setSelectedMonth(11);
                      setSelectedYear(selectedYear - 1);
                    } else {
                      setSelectedMonth(selectedMonth - 1);
                    }
                    setSelectedDay(null);
                  }}
                  className={`text-white/70 hover:text-white text-lg px-2 ${selectedYear === today.getFullYear() && selectedMonth === today.getMonth() ? 'opacity-30 cursor-not-allowed' : ''}`}
                  disabled={selectedYear === today.getFullYear() && selectedMonth === today.getMonth()}
                >←</button>
                <span className="text-white font-semibold">{new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button onClick={() => {
                  if (selectedMonth === 11) {
                    setSelectedMonth(0);
                    setSelectedYear(selectedYear + 1);
                  } else {
                    setSelectedMonth(selectedMonth + 1);
                  }
                  setSelectedDay(null);
                }} className="text-white/70 hover:text-white text-lg px-2">→</button>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: new Date(selectedYear, selectedMonth + 1, 0).getDate() }, (_, i) => i + 1).map(day => (
                  <button key={day} onClick={() => setSelectedDay(day)} className={`h-8 w-8 rounded-xl text-xs ${selectedDay === day ? "bg-emerald-400 text-black" : "bg-white/5 text-white"}`}>{day}</button>
                ))}
              </div>
            </div>
            {selectedDay && <FieldSlotsInfoModal fieldId={selectedField.id} selectedDay={selectedDay} selectedMonth={selectedMonth} selectedYear={selectedYear} />}
          </div>
        </div>
      )}

      {/* Modali di Azione */}
      <BookingModal
        field={bookings.bookingField} date={bookings.bookingDate} setDate={bookings.setBookingDate} // Campo e data di prenotazione
        time={bookings.bookingTime} setTime={bookings.setBookingTime}
        duration={bookings.bookingDuration} setDuration={bookings.setBookingDuration}
        availableTimes={bookings.availableTimes} isLoading={bookings.bookingLoading}
        error={bookings.bookingError} success={bookings.bookingSuccess}
        onClose={() => bookings.setBookingField(null)} onConfirm={handleConfirmBooking} // Funzione di conferma
      />
      <EditBookingModal
        booking={bookings.editingBooking} date={bookings.editDate} setDate={bookings.setEditDate}
        time={bookings.editTime} setTime={bookings.setEditTime}
        duration={bookings.editDuration} setDuration={bookings.setEditDuration}
        isLoading={bookings.editLoading} error={bookings.editError}
        onClose={() => bookings.setEditingBooking(null)} onConfirm={handleConfirmEditBooking}
        availableTimes={bookings.editAvailableTimes}
      />
      <CancelBookingModal
        booking={bookings.cancelTarget} isLoading={bookings.cancelLoading}
        onClose={() => bookings.setCancelTarget(null)} onConfirm={handleConfirmCancelBooking}
      />
    </div>
  );
}