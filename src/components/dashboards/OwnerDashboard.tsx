"use client";

import { useState, useMemo, useEffect } from "react";
import { Session, DashboardData, FieldItem } from "@/lib/types";
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

interface OwnerDashboardProps {
  session: Session;
  dashboard: DashboardData;
  reloadData: () => void;
  setSession: (s: Session) => void;
}

export function OwnerDashboard({ session, dashboard, reloadData, setSession }: OwnerDashboardProps) {
  const fields = useFields();
  const profile = useProfile();
  const { isOpen, close } = useSidebar();
  
  const [activeSection, setActiveSection] = useState<"Home" | "Impostazioni" | "Prenotazioni" | "Campi">("Home");
  const [selectedField, setSelectedField] = useState<FieldItem | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    if (session) profile.setProfileName(session.name);
  }, [session]);

  const ownerBookings = useMemo(() => {
    const f = dashboard?.owner?.fields ?? [];
    const all = f.flatMap((field) =>
      field.bookings.map((booking) => ({
        ...booking,
        field: { name: field.name, size: field.size, imageUrl: field.imageUrl ?? null },
      }))
    );
    return all.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [dashboard]);

  // Wrappers per le azioni
  const handleConfirmCreateField = async () => {
    await fields.confirmCreateField(
      session.id, fields.createFieldName, fields.createFieldSize,
      fields.createFieldLocation, fields.createFieldImageUrl, reloadData
    );
  };

  const handleConfirmEditField = async () => {
    if (!fields.editingField) return;
    await fields.confirmEditField(
      session.id, fields.editingField.id, fields.fieldName,
      fields.fieldSize, fields.fieldLocation, reloadData
    );
  };

  const handleConfirmDeleteField = async () => {
    if (!fields.deleteFieldTarget) return;
    await fields.confirmDeleteField(session.id, fields.deleteFieldTarget.id, false, undefined, reloadData);
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
      
      {/* Sidebar - Riutilizziamo il componente Sidebar generico o custom per Owner */}
      <Sidebar
        isOpen={isOpen}
        onClose={close}
        activeSection={activeSection}
        onSectionChange={(section) => setActiveSection(section as any)}
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
                            onClick={() => setSelectedDay(day)}
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
                fields={dashboard?.owner?.fields ?? []}
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
              showForm={profile.showProfileForm} setShowForm={profile.setShowProfileForm}
              loading={profile.profileLoading} deleteLoading={profile.deleteProfileLoading}
              error={profile.profileError} success={profile.profileSuccess}
              onSave={handleProfileSave} onDeleteRequest={() => profile.setDeleteProfileConfirmOpen(true)}
            />
        )}
      </div>

      {/* Modali Gestione Campi */}
      <CreateFieldModal 
        isOpen={fields.createFieldOpen} fieldName={fields.createFieldName} setFieldName={fields.setCreateFieldName}
        fieldSize={fields.createFieldSize} setFieldSize={fields.setCreateFieldSize}
        fieldLocation={fields.createFieldLocation} setFieldLocation={fields.setCreateFieldLocation}
        fieldImageUrl={fields.createFieldImageUrl} setFieldImageUrl={fields.setCreateFieldImageUrl}
        isLoading={fields.createFieldLoading} error={fields.createFieldError}
        onClose={() => fields.setCreateFieldOpen(false)} onConfirm={handleConfirmCreateField}
      />
      <FieldModal
        field={fields.editingField} fieldName={fields.fieldName} setFieldName={fields.setFieldName}
        fieldSize={fields.fieldSize} setFieldSize={fields.setFieldSize}
        fieldLocation={fields.fieldLocation} setFieldLocation={fields.setFieldLocation}
        isLoading={fields.fieldLoading} error={fields.fieldError}
        onClose={() => fields.setEditingField(null)} onConfirm={handleConfirmEditField}
      />
      <DeleteFieldModal
        field={fields.deleteFieldTarget} isLoading={fields.deleteFieldLoading}
        onClose={() => fields.setDeleteFieldTarget(null)} onConfirm={handleConfirmDeleteField}
      />
    </div>
  );
}