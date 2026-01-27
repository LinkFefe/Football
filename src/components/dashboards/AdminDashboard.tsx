"use client"; // Abilita il rendering lato client

import { useState, useEffect } from "react"; // Importa useState e useEffect da React
import { Session, DashboardData } from "@/lib/types"; // Importa i tipi Session e DashboardData
import { useAdminPanel } from "@/hooks/useAdminPanel"; // Importa l'hook useAdminPanel
import { useProfile } from "@/hooks/useProfile"; 
import { useFields } from "@/hooks/useFields";
import { useSidebar } from "../modals/SidebarModals"; 
import { Card } from "@/components/ui/Card";
import { ProfileSettingsForm } from "@/components/dashboards/ProfileSettingsForm";
import { AdminDeleteUserModal, AdminDeleteBookingModal, DeleteFieldModal } from "@/components/modals"; // Importa i modali di eliminazione

import { AdminUserList } from "./admin/AdminUserList"; // Importa il componente AdminUserList
import { AdminBookingList } from "./admin/AdminBookingList";
import { AdminFieldList } from "./admin/AdminFieldList";

// Definisci le proprietà del componente AdminDashboard
interface AdminDashboardProps {
  session: Session;
  dashboard: DashboardData; // Dati della dashboard
  reloadData: () => void; // Funzione per ricaricare i dati della dashboard
  setSession: (s: Session) => void; // Funzione per aggiornare la sessione utente
}

// Componente AdminDashboard
export function AdminDashboard({ session, dashboard, reloadData, setSession }: AdminDashboardProps) {
    const handleDeleteProfileAndRedirect = () => { // Funzione per eliminare il profilo e reindirizzare
      profile.handleProfileDelete(session.id, () => { 
        window.location.href = "/"; // Reindirizza alla homepage
      });
    };
  const admin = useAdminPanel(); // Importa l'hook useAdminPanel
  const profile = useProfile(); // Importa l'hook useProfile
  const fields = useFields(); // Importa l'hook useFields
  const { isOpen, close } = useSidebar(); // Importa l'hook useSidebar

  // Stato per la sezione attiva del dashboard
  const [activeSection, setActiveSection] = useState<"Home" | "Impostazioni">("Home");

  // Aggiorna il nome del profilo quando la sessione cambia
  useEffect(() => {
    if (session) profile.setProfileName(session.name); // Imposta il nome del profilo
  }, [session]);

  // Funzioni di conferma eliminazione
  const handleConfirmDeleteUser = async () => {
    if (!admin.adminDeleteUser) return; // Verifica che ci sia un utente da eliminare
    await admin.confirmDeleteUser(session.id, admin.adminDeleteUser.id, reloadData);
  };

  // Funzione di conferma eliminazione prenotazione
  const handleConfirmDeleteBooking = async () => {
    if (!admin.adminDeleteBooking) return;
    await admin.confirmDeleteBooking(session.id, admin.adminDeleteBooking.id, reloadData);
  };

  // Funzione di conferma eliminazione campo
  const handleConfirmDeleteField = async () => {
     if (!fields.deleteFieldTarget) return;
     await fields.confirmDeleteField(session.id, fields.deleteFieldTarget.id, true, session.id, reloadData);
  };

  // Funzione per salvare le modifiche al profilo
  const handleProfileSave = async (e: React.FormEvent) => { // Gestore dell'evento di salvataggio del profilo
    e.preventDefault(); // Previeni il comportamento predefinito del form
    await profile.handleProfileSave(
      session.id, profile.profileName, profile.oldPassword || undefined,
      profile.newPassword || undefined, profile.confirmPassword || undefined, setSession
    );
  };

  // Renderizza il componente AdminDashboard
  return (
    <div className={`grid gap-6 ${isOpen ? "lg:grid-cols-[240px_1fr]" : "lg:grid-cols-[1fr]"}`}>
      
      {isOpen && (
          <aside className="h-full rounded-2xl border border-white/10 bg-[#0b0f14]/90 p-4">
               <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white">Menu</p>
                <button onClick={close} className="text-white/60 hover:text-white">✕</button>
              </div>
              <nav className="space-y-3 text-sm">
                  {["Home", "Impostazioni"].map(item => (
                      <button 
                          key={item} 
                          onClick={() => { setActiveSection(item as any); if(window.innerWidth < 1024) close(); }} 
                          className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                              activeSection === item 
                              ? "border-emerald-500/50 text-emerald-100 bg-emerald-500/10" 
                              : "border-white/10 bg-white/5 text-white/70 hover:border-emerald-300 hover:text-white"
                          }`}
                      >
                          {item}
                      </button>
                  ))}
              </nav>
          </aside>
      )}

      <div className="space-y-6">
          {activeSection === "Home" && (
              <div className="space-y-6">
                  <Card variant="gradient">
                      <p className="text-sm text-emerald-200">Bentornato</p>
                      <h3 className="text-2xl font-semibold">{session.name}</h3>
                  </Card>

                  <div className="grid gap-6 lg:grid-cols-2">
                      <AdminUserList 
                          users={dashboard?.users ?? []} // Passa gli utenti della dashboard
                          onDeleteUser={admin.requestDeleteUser} // Funzione di richiesta eliminazione utente
                      />

                      <AdminBookingList 
                          bookings={dashboard?.bookings ?? []} 
                          onDeleteBooking={admin.requestDeleteBooking} 
                      />

                      <AdminFieldList 
                          fields={dashboard?.fields ?? []} 
                          onDeleteField={fields.requestDeleteField} 
                      />
                  </div>
              </div>
          )}

          {activeSection === "Impostazioni" && (
              <ProfileSettingsForm
                profileName={profile.profileName} setProfileName={profile.setProfileName} // Nome del profilo
                oldPassword={profile.oldPassword} setOldPassword={profile.setOldPassword} // Vecchia password
                newPassword={profile.newPassword} setNewPassword={profile.setNewPassword} // Nuova password
                confirmPassword={profile.confirmPassword} setConfirmPassword={profile.setConfirmPassword} // Conferma nuova password
                showForm={profile.showProfileForm} setShowForm={profile.setShowProfileForm} // Mostra/nascondi form
                loading={profile.profileLoading} deleteLoading={profile.deleteProfileLoading} // Stati di caricamento
                error={profile.profileError} success={profile.profileSuccess} // Messaggi di errore/successo
                onSave={handleProfileSave} onDeleteRequest={() => profile.setDeleteProfileConfirmOpen(true)} // Gestori di salvataggio ed eliminazione
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

      <AdminDeleteUserModal // Modale di eliminazione utente
        user={admin.adminDeleteUser} isLoading={admin.adminDeleteUserLoading} // Passa l'utente da eliminare e lo stato di caricamento
        onClose={() => admin.setAdminDeleteUser(null)} onConfirm={handleConfirmDeleteUser} // Funzione di conferma
      />
      <AdminDeleteBookingModal // Modale di eliminazione prenotazione
        booking={admin.adminDeleteBooking} isLoading={admin.adminDeleteBookingLoading}
        onClose={() => admin.setAdminDeleteBooking(null)} onConfirm={handleConfirmDeleteBooking}
      />
      <DeleteFieldModal // Modale di eliminazione campo
        field={fields.deleteFieldTarget} isLoading={fields.deleteFieldLoading}
        onClose={() => fields.setDeleteFieldTarget(null)} onConfirm={handleConfirmDeleteField}
      />
    </div>
  );
}