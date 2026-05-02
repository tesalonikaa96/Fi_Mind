import Sidebar from "@/components/layout/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // Di Laptop (lg), layout berdampingan (flex). Di HP, layout menumpuk (block).
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F0F7FF] dark:bg-slate-950 transition-colors duration-500">
      
      {/* Sidebar yang sekarang sudah "Overlay" di HP */}
      <Sidebar />
      
      {/* DASHBOARD AREA: Di HP lebar 100% penuh */}
      <main className="flex-1 w-full min-w-0">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}