"use client";

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

interface PlayerDashboardProps {
  session: Session;
  dashboard: DashboardData;
  reloadData: () => void;
  setSession: (s: Session) => void;
}

export function PlayerDashboard({ session, dashboard, reloadData, setSession }: PlayerDashboardProps) {
  const bookings = useBookings();
  const profile = useProfile();
  const { isOpen, close } = useSidebar();
  
  const [activeSection, setActiveSection] = useState<"Home" | "Impostazioni" | "Prenotazioni">("Home");
  const [selectedField, setSelectedField] = useState<FieldItem | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    if (session) profile.setProfileName(session.name);
  }, [session]);

  const playerBookings = useMemo(() => dashboard?.user?.player?.bookings ?? [], [dashboard]);
  const nextBooking = useNextBooking(playerBookings);
  const totalBookingsCount = useTotalBookingsCount(playerBookings);
  const calendarDays = useCalendarDays(playerBookings);
  const displayName = useMemo(() => session.name.split(" ")[0] || session.name, [session]);

  // Gestione Disponibilità per Modale Prenotazione
  useEffect(() => {
    if (!bookings.bookingField || !bookings.bookingDate) {
      bookings.loadAvailability(0, "", bookings.bookingDuration);
      return;
    }
    bookings.loadAvailability(bookings.bookingField.id, bookings.bookingDate, bookings.bookingDuration);
  }, [bookings.bookingField, bookings.bookingDate, bookings.bookingDuration]);

  // Handlers
  const handleConfirmBooking = async () => {
    if (!bookings.bookingField) return;
    await bookings.confirmBooking(
      session.id, bookings.bookingField.id, bookings.bookingDate,
      bookings.bookingTime, bookings.bookingDuration, reloadData
    );
  };

  const handleConfirmEditBooking = async () => {
    if (!bookings.editingBooking) return;
    await bookings.confirmEditBooking(
      session.id, bookings.editingBooking.id, bookings.editDate,
      bookings.editTime, bookings.editDuration, reloadData
    );
  };

  const handleConfirmCancelBooking = async () => {
    if (!bookings.cancelTarget) return;
    await bookings.confirmCancelBooking(session.id, bookings.cancelTarget.id, reloadData);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await profile.handleProfileSave(
      session.id, profile.profileName, profile.oldPassword || undefined,
      profile.newPassword || undefined, profile.confirmPassword || undefined, setSession
    );
  };

  return (
    <div className={`grid gap-6 ${isOpen ? "lg:grid-cols-[240px_1fr]" : "lg:grid-cols-[1fr]"}`}>
      
      {/* Sidebar Mobile & Desktop */}
      <Sidebar
        isOpen={isOpen}
        onClose={close}
        activeSection={activeSection}
        onSectionChange={(section) => setActiveSection(section as any)}
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
            showForm={profile.showProfileForm} setShowForm={profile.setShowProfileForm}
            loading={profile.profileLoading} deleteLoading={profile.deleteProfileLoading}
            error={profile.profileError} success={profile.profileSuccess}
            onSave={handleProfileSave}
            onDeleteRequest={() => profile.setDeleteProfileConfirmOpen(true)}
          />
        )}
      </div>

      {/* --- MODALI (Tenute nel Parent per gestire lo stato globale) --- */}

      {/* Modale Info Campo (aperta dalla PlayerFieldList) */}
      {selectedField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="relative w-full max-w-md mx-auto bg-[#0b0f14] rounded-3xl border border-white/10 p-4 sm:p-6 overflow-auto custom-scrollbar" style={{maxHeight: '90vh'}}>
                <button className="absolute top-4 right-4 text-white/60 hover:text-white text-xl" onClick={() => { setSelectedField(null); setSelectedDay(null); }}>×</button>
                <img src={selectedField.imageUrl ?? "/images/field-1.svg"} alt={selectedField.name} className="mx-auto mb-4 rounded-2xl object-cover w-72 h-48" />
                <h2 className="text-2xl font-bold text-center text-white mb-2">{selectedField.name}</h2>
                <div className="mb-4">
                    <p className="text-center text-emerald-200 mb-2">Seleziona un giorno</p>
                    <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                        <button key={day} onClick={() => setSelectedDay(day)} className={`h-8 w-8 rounded-xl text-xs ${selectedDay === day ? "bg-emerald-400 text-black" : "bg-white/5 text-white"}`}>{day}</button>
                    ))}
                    </div>
                </div>
                {selectedDay && <FieldSlotsInfoModal fieldId={selectedField.id} selectedDay={selectedDay} />}
            </div>
        </div>
      )}

      {/* Modali di Azione */}
      <BookingModal
        field={bookings.bookingField} date={bookings.bookingDate} setDate={bookings.setBookingDate}
        time={bookings.bookingTime} setTime={bookings.setBookingTime}
        duration={bookings.bookingDuration} setDuration={bookings.setBookingDuration}
        availableTimes={bookings.availableTimes} isLoading={bookings.bookingLoading}
        error={bookings.bookingError} success={bookings.bookingSuccess}
        onClose={() => bookings.setBookingField(null)} onConfirm={handleConfirmBooking}
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