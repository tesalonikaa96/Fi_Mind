import Sidebar from "@/components/layout/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F0F7FF] dark:bg-slate-950">
      
      {/* Sidebar tetap kita panggil (dia yang pegang logika buka-tutup) */}
      <Sidebar />
      
      <main className="flex-1 w-full min-w-0">
        {/* Konten Dashboard: 
            Di HP kita kasih padding top (pt-20) supaya nggak nabrak Header Mobile.
            Di Laptop padding top-nya balik normal (lg:pt-0). 
        */}
        <div className="h-full pt-20 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}