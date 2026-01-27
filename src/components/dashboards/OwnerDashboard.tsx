"use client"; // Abilita il rendering lato client

import { useState, useMemo, useEffect } from "react"; // Importa useState, useMemo e useEffect da React
import { Session, DashboardData, FieldItem } from "@/lib/types"; // Importa i tipi Session, DashboardData e FieldItem
import { useFields } from "@/hooks/useFields";
import { useProfile } from "@/hooks/useProfile";
import { useSidebar } from "../modals/SidebarModals";
import { Sidebar } from "@/components/layout"; 
import { ProfileSettingsForm } from "@/components/dashboards/ProfileSettingsForm";
import { CreateFieldModal, FieldModal, DeleteFieldModal } from "@/components/modals";
import { FieldSlotsInfoModal } from "@/components/modals/FieldSlotsInfoModal";

// Importa i nuovi componenti modulari
import { OwnerStatsCard } from "./owner/OwnerStatsCard";
import { OwnerHomeFieldList } from "./owner/OwnerHomeFieldList";
import { OwnerFieldManagementList } from "./owner/OwnerFieldManagementList";
import { OwnerBookingList } from "./owner/OwnerBookingList";

// Definisci le proprietà del componente OwnerDashboard
interface OwnerDashboardProps {
  session: Session;
  dashboard: DashboardData;
  reloadData: () => void;
  setSession: (s: Session) => void; 
}

// Componente OwnerDashboard
export function OwnerDashboard({ session, dashboard, reloadData, setSession }: OwnerDashboardProps) {
  const fields = useFields(); // Importa l'hook useFields
  const profile = useProfile();
  const { isOpen, close } = useSidebar(); // Importa l'hook useSidebar
  
  // Stato per la sezione attiva del dashboard
  const [activeSection, setActiveSection] = useState<"Home" | "Impostazioni" | "Prenotazioni" | "Campi">("Home");
  const [selectedField, setSelectedField] = useState<FieldItem | null>(null); // Stato per il campo selezionato
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // Stato per il giorno selezionato
 
  // Aggiorna il nome del profilo quando la sessione cambia
  useEffect(() => {
    if (session) profile.setProfileName(session.name);
  }, [session]);

  // Calcola le prenotazioni del proprietario
  const ownerBookings = useMemo(() => {
    const f = dashboard?.owner?.fields ?? []; // Ottieni i campi del proprietario
    const all = f.flatMap((field) => // Appiattisci le prenotazioni di tutti i campi
      field.bookings.map((booking) => ({ // Mappa ogni prenotazione
        ...booking,
        field: { name: field.name, size: field.size, imageUrl: field.imageUrl ?? null }, // Aggiungi i dettagli del campo alla prenotazione
      }))
    );
    return all.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()); // Ordina le prenotazioni per data (più recenti prima)
  }, [dashboard]);

  // Funzione per confermare la creazione di un campo
  const handleConfirmCreateField = async () => {
    await fields.confirmCreateField(
      session.id, fields.createFieldName, fields.createFieldSize,
      fields.createFieldLocation, fields.createFieldImageUrl, reloadData
    );
  };

  // Funzione per confermare la modifica di un campo
  const handleConfirmEditField = async () => {
    if (!fields.editingField) return;
    await fields.confirmEditField(
      session.id, fields.editingField.id, fields.fieldName,
      fields.fieldSize, fields.fieldLocation, fields.fieldImageUrl, reloadData
    );
  };

  // Funzione per confermare l'eliminazione di un campo
  const handleConfirmDeleteField = async () => {
    if (!fields.deleteFieldTarget) return;
    await fields.confirmDeleteField(session.id, fields.deleteFieldTarget.id, false, undefined, reloadData);
  };
  
  // Funzione per salvare le modifiche al profilo
  const handleProfileSave = async (e: React.FormEvent) => { // Gestore dell'evento di salvataggio del profilo
    e.preventDefault(); // Previeni il comportamento predefinito del form
    await profile.handleProfileSave(
      session.id, profile.profileName, profile.oldPassword || undefined,
      profile.newPassword || undefined, profile.confirmPassword || undefined, setSession
    );
  };

  // Funzione per eliminare il profilo e reindirizzare
  const handleDeleteProfileAndRedirect = () => {
    profile.handleProfileDelete(session.id, () => {
      window.location.href = "/";
    });
  };

  // Renderizza il componente OwnerDashboard
  return (
    <div className={`grid gap-6 ${isOpen ? "lg:grid-cols-[240px_1fr]" : "lg:grid-cols-[1fr]"}`}>
      {/* Sidebar - Riutilizziamo il componente Sidebar generico o custom per Owner */}
      <Sidebar
        isOpen={isOpen} // Stato di apertura della sidebar
        onClose={close} // Funzione per chiudere la sidebar
        activeSection={activeSection} // Sezione attiva della dashboard
        onSectionChange={(section) => setActiveSection(section as any)} // Gestore del cambiamento di sezione
        sections={["Home", "Prenotazioni", "Campi", "Impostazioni"]}
      />

      <div className="space-y-6">
        {activeSection === "Home" && (
            <div className="space-y-6">
                {/* 1. Stats Card */}
                <OwnerStatsCard 
                    displayName={dashboard?.owner?.user.name ?? session.name}
                    bookingsCount={ownerBookings.length}
                />

                {/* 2. Home Fields List */}
                <OwnerHomeFieldList 
                    fields={dashboard?.owner?.fields ?? [] as any} 
                    onInfoClick={(field) => { setSelectedField(field); setSelectedDay(null); }}
                />

                {/* Modale Info Campo (Shared Logic) */}
                {selectedField && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="relative w-full max-w-md mx-auto bg-[#0b0f14] rounded-3xl border border-white/10 p-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: '90vh' }}>
                      <button className="absolute top-4 right-4 text-white" onClick={() => setSelectedField(null)}>×</button>
                      <img
                        src={selectedField.imageUrl ?? "/images/field-1.svg"}
                        alt={selectedField.name}
                        className="mx-auto mb-4 rounded-2xl object-cover" style={{ width: 320, height: 200 }}
                      />
                      <h2 className="text-2xl font-bold text-center text-white mb-2">{selectedField.name}</h2>
                      <p className="text-center text-emerald-200 mb-2">Seleziona un giorno</p>
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                          <button
                            key={day}
                            onClick={() => setSelectedDay(day)} // Imposta il giorno selezionato
                            className={`h-8 w-8 rounded text-xs ${selectedDay === day ? "bg-emerald-400 text-black" : "bg-white/10 text-white hover:bg-emerald-500/20"}`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                      {selectedDay && <FieldSlotsInfoModal fieldId={selectedField.id} selectedDay={selectedDay} />}
                    </div>
                  </div>
                )}
            </div>
        )}

        {activeSection === "Campi" && (
            // 3. Field Management List
            <OwnerFieldManagementList 
                fields={dashboard?.owner?.fields ?? []} // Campi gestiti dal proprietario
                onCreateClick={() => fields.setCreateFieldOpen(true)}
                onEditClick={fields.openEditField}
                onDeleteClick={fields.requestDeleteField}
            />
        )}

        {activeSection === "Prenotazioni" && (
            // 4. Bookings List
            <OwnerBookingList 
                bookings={ownerBookings}
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

      {/* Modali Gestione Campi */}
      <CreateFieldModal // Modale di creazione campo 
        isOpen={fields.createFieldOpen} fieldName={fields.createFieldName} setFieldName={fields.setCreateFieldName}
        fieldSize={fields.createFieldSize} setFieldSize={fields.setCreateFieldSize}
        fieldLocation={fields.createFieldLocation} setFieldLocation={fields.setCreateFieldLocation}
        fieldImageUrl={fields.createFieldImageUrl} setFieldImageUrl={fields.setCreateFieldImageUrl}
        isLoading={fields.createFieldLoading} error={fields.createFieldError} // Messaggio di errore
        onClose={() => fields.setCreateFieldOpen(false)} onConfirm={handleConfirmCreateField} // Funzione di conferma
      />
      <FieldModal // Modale di modifica campo
        field={fields.editingField}
        fieldName={fields.fieldName}
        setFieldName={fields.setFieldName}
        fieldSize={fields.fieldSize}
        setFieldSize={fields.setFieldSize}
        fieldLocation={fields.fieldLocation}
        setFieldLocation={fields.setFieldLocation}
        fieldImageUrl={fields.fieldImageUrl}
        setFieldImageUrl={fields.setFieldImageUrl}
        isLoading={fields.fieldLoading}
        error={fields.fieldError}
        onClose={() => fields.setEditingField(null)} // Funzione di chiusura
        onConfirm={handleConfirmEditField} // Funzione di conferma
      />
      <DeleteFieldModal // Modale di eliminazione campo
        field={fields.deleteFieldTarget} isLoading={fields.deleteFieldLoading} // Stato di caricamento
        onClose={() => fields.setDeleteFieldTarget(null)} onConfirm={handleConfirmDeleteField} // Funzione di conferma
      />
    </div>
  );
}