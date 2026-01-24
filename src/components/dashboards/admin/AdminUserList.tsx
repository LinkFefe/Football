import React, { useState } from "react";
import { UserItem, Role } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface AdminUserListProps {
  users: UserItem[];
  onDeleteUser: (user: UserItem) => void;
}

const roleLabels: Record<Role, string> = {
  PLAYER: "Giocatore",
  OWNER: "Proprietario",
  ADMIN: "Amministratore",
};

export function AdminUserList({ users, onDeleteUser }: AdminUserListProps) {
  const [expanded, setExpanded] = useState(false);
  const VISIBLE_COUNT = 7;
  const visibleUsers = expanded ? users : users.slice(0, VISIBLE_COUNT);
  return (
    <Card>
      <h4 className="text-sm font-semibold text-emerald-200">Utenti</h4>
      <div className="mt-4 space-y-3 text-sm">
        {visibleUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0b0f14]/70 px-4 py-3"
          >
            <div className="flex flex-col">
              <span>{user.name}</span>
              <span className="text-xs text-white/60">
                {user.email} - {roleLabels[user.role]}
              </span>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDeleteUser(user)}
              className="rounded-full text-xs font-semibold"
            >
              Elimina
            </Button>
          </div>
        ))}
        {users.length === 0 && <p className="text-white/40 italic">Nessun utente registrato.</p>}
        {users.length > VISIBLE_COUNT && (
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 w-full rounded-full text-xs font-semibold"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Mostra meno" : "Mostra tutti"}
          </Button>
        )}
      </div>
    </Card>
  );
}