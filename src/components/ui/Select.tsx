"use client";

import React from "react";

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string | null;
  options: Array<{ value: string | number; label: string }>;
}

export function Select({
  label,
  error,
  options,
  id,
  className = "",
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-white/80"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full rounded-xl border px-4 py-2.5 outline-none transition-all duration-200
          ${
            error
              ? "bg-red-500/10 border-red-500/50 text-red-200 placeholder:text-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
              : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 focus:border-emerald-400 focus:bg-white/10 focus:ring-2 focus:ring-emerald-400/20"
          } ${className}`}
      >
        {/* L'opzione di default */}
        <option value="" className="bg-gray-900 text-gray-300">
          Seleziona un'opzione
        </option>

        {/* Le altre opzioni */}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-900 text-white">
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
