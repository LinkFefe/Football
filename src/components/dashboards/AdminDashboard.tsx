"use client";

import { useState, useEffect } from "react";
import { Session, DashboardData } from "@/lib/types";
import { useAdminPanel } from "@/hooks/useAdminPanel";
import { useProfile } from "@/hooks/useProfile";
import { useFields } from "@/hooks/useFields";
import { useSidebar } from "../modals/SidebarModals";
import { Card } from "@/components/ui/Card";
import { ProfileSettingsForm } from "@/components/dashboards/ProfileSettingsForm";
import { AdminDeleteUserModal, AdminDeleteBookingModal, DeleteFieldModal } from "@/components/modals";

import { AdminUserList } from "./admin/AdminUserList";
import { AdminBookingList } from "./admin/AdminBookingList";
import { AdminFieldList } from "./admin/AdminFieldList";

interface AdminDashboardProps {
  session: Session;
  dashboard: DashboardData;
  reloadData: () => void;
  setSession: (s: Session) => void;
}

export function AdminDashboard({ session, dashboard, reloadData, setSession }: AdminDashboardProps) {
    // Funzione per eliminare il profilo e reindirizzare
    const handleDeleteProfileAndRedirect = () => {
      profile.handleProfileDelete(session.id, () => {
        window.location.href = "/";
      });
    };
  const admin = useAdminPanel();
  const profile = useProfile();
  const fields = useFields();
  const { isOpen, close } = useSidebar();

  const [activeSection, setActiveSection] = useState<"Home" | "Impostazioni">("Home");

  useEffect(() => {
    if (session) profile.setProfileName(session.name);
  }, [session]);

  const handleConfirmDeleteUser = async () => {
    if (!admin.adminDeleteUser) return;
    await admin.confirmDeleteUser(session.id, admin.adminDeleteUser.id, reloadData);
  };

  const handleConfirmDeleteBooking = async () => {
    if (!admin.adminDeleteBooking) return;
    await admin.confirmDeleteBooking(session.id, admin.adminDeleteBooking.id, reloadData);
  };

  const handleConfirmDeleteField = async () => {
     if (!fields.deleteFieldTarget) return;
     await fields.confirmDeleteField(session.id, fields.deleteFieldTarget.id, true, session.id, reloadData);
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
                          users={dashboard?.users ?? []} 
                          onDeleteUser={admin.requestDeleteUser} 
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

      <AdminDeleteUserModal
        user={admin.adminDeleteUser} isLoading={admin.adminDeleteUserLoading}
        onClose={() => admin.setAdminDeleteUser(null)} onConfirm={handleConfirmDeleteUser}
      />
      <AdminDeleteBookingModal
        booking={admin.adminDeleteBooking} isLoading={admin.adminDeleteBookingLoading}
        onClose={() => admin.setAdminDeleteBooking(null)} onConfirm={handleConfirmDeleteBooking}
      />
      <DeleteFieldModal
        field={fields.deleteFieldTarget} isLoading={fields.deleteFieldLoading}
        onClose={() => fields.setDeleteFieldTarget(null)} onConfirm={handleConfirmDeleteField}
      />
    </div>
  );
}