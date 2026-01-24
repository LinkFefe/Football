"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "featured";
}

export function Card({
  children,
  className = "",
  variant = "default",
}: CardProps) {
  const variantStyles = {
    default: "rounded-3xl border border-white/10 bg-white/5 p-6",
    gradient:
      "rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-blue-500/20 p-6",
    featured:
      "rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/45 via-emerald-500/20 to-blue-500/25 p-6 shadow-[0_20px_50px_rgba(16,185,129,0.25)]",
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>{children}</div>
  );
}
