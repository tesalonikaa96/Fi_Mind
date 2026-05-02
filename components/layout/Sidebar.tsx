"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, CheckSquare, Briefcase, 
  Heart, Settings, LogOut, Menu, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: CheckSquare, label: "Focus Flow", href: "/tasks" },
  { icon: Heart, label: "Mood Sanctuary", href: "/mood" },
  { icon: Briefcase, label: "Career Path", href: "/career" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Nutup sidebar otomatis pas pindah halaman
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ── TOMBOL BURGER (Hanya muncul di HP/Tablet) ── */}
      <div className="fixed top-5 left-5 z-[110] lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-sky-600 active:scale-90 transition-all"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── BACKDROP (Layar Gelap biar Dashboard gak kegeser) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR CORE ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[105] w-72 bg-white dark:bg-slate-900 p-6 flex flex-col transition-transform duration-500 ease-in-out lg:sticky lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 mb-10 px-2 mt-16 lg:mt-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 shadow-inner border border-sky-100">
            <img src="/icon.png" alt="Fi-Mind" className="h-6 w-6 object-contain" />
          </div>
          <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">Fi-Mind</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all",
                  isActive 
                    ? "bg-sky-600 text-white shadow-lg shadow-sky-600/20" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all",
              pathname === "/settings" ? "bg-sky-50 text-sky-600" : "text-slate-500"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <button
            onClick={() => window.location.href = "/"}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}