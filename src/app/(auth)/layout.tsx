import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex items-center justify-center py-6 sm:py-12 px-4">
      {children}
    </div>
  );
}
