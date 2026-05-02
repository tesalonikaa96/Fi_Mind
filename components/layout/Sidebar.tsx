"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Briefcase, Heart, Settings, LogOut, Menu, X } from "lucide-react";
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

  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <>
      {/* ── MOBILE HEADER BAR (Solusi biar nggak nutupin konten) ── */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-[100] flex items-center justify-between px-5 lg:hidden">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="Logo" className="h-6 w-6" />
          <span className="font-black text-slate-800 dark:text-white tracking-tighter">Fi-Mind</span>
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── BACKDROP ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[110] bg-slate-950/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR DRAWER ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[120] w-72 bg-white dark:bg-slate-900 p-6 flex flex-col transition-transform duration-500 ease-in-out lg:sticky lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo (Hanya muncul di Desktop Sidebar) */}
        <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 shadow-inner border border-sky-100">
            <img src="/icon.png" alt="Fi-Mind" className="h-6 w-6 object-contain" />
          </div>
          <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">Fi-Mind</span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2 mt-10 lg:mt-0">
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

        {/* Bottom Menu */}
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
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all text-left"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}