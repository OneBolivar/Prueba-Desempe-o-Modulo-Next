import React from "react";

export function Spinner({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin text-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export function Badge({
  children,
  variant = "purple",
}: {
  children: React.ReactNode;
  variant?: "purple" | "pink" | "emerald" | "red" | "gray";
}) {
  const styles = {
    purple: "bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA]",
    pink: "bg-[#EC4899]/15 text-[#EC4899] dark:text-[#F472B6]",
    emerald: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400",
    red: "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400",
    gray: "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

