"use client";

import React from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  sections: string[];
}

export function Sidebar({
  isOpen,
  onClose,
  activeSection,
  onSectionChange,
  sections,
}: SidebarProps) {
  if (!isOpen) return null;

  return (
    <aside className="h-full rounded-2xl border border-white/10 bg-[#0b0f14]/90 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Menu</p>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white"
          type="button"
          aria-label="Chiudi menu"
        >
          ✕
        </button>
      </div>
      <nav className="mt-6 space-y-3 text-sm">
        {sections.map((item) => (
          <button
            key={item}
            onClick={() => onSectionChange(item)}
            className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-white/70 hover:border-emerald-300 hover:text-white transition-all"
            type="button"
            data-active={activeSection === item}
            style={
              activeSection === item
                ? { borderColor: "rgba(52, 211, 153, 0.8)", color: "#ecfdf5" }
                : undefined
            }
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
