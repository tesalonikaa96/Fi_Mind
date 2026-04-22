"use client";
import Sidebar from "@/components/layout/Sidebar"; // Pastikan path ini benar

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar akan selalu muncul di sebelah kiri */}
      <Sidebar />
      
      {/* Area Konten Utama (Dashboard, Tasks, dll) */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}