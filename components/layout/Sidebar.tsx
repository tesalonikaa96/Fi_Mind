"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Briefcase, Heart, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: CheckSquare, label: "Focus Flow", href: "/tasks" },
  { icon: Heart, label: "Mood Sanctuary", href: "/mood" },
  { icon: Briefcase, label: "Career Path", href: "/career" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col transition-colors duration-500">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-white font-bold">
          F
        </div>
        <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight transition-colors">Fi-Mind</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-sky-500 dark:text-sky-400" : "text-slate-400 dark:text-slate-500")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-1 transition-colors duration-500">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
        >
          <Settings className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          Settings
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300"
        >
          <LogOut className="h-5 w-5 text-red-400" />
          Logout
        </Link>
      </div>
    </aside>
  );
}