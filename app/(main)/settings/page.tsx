"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bell, GraduationCap, Moon, Sun, Shield, LogOut, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  
  // State untuk Data User
  const [userName, setUserName] = useState("Tesalonika Tamba");
  const [userMajor, setUserMajor] = useState("English Literature • Jakarta International University");
  
  // State untuk Mode Gelap
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Mengambil nama user dari sesi Google via Supabase
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.full_name) {
        setUserName(session.user.user_metadata.full_name);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Jika kamu menggunakan Tailwind 'class' strategy, ini akan menerapkan class dark di html
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // --- STYLING DINAMIS BERDASARKAN MODE ---
  const bgGradient = isDarkMode 
    ? "linear-gradient(to bottom right, #0f172a 0%, #1e293b 50%, #020617 100%)" 
    : "linear-gradient(to bottom right, #e0f2fe 0%, #f0f9ff 50%, #f8fafc 100%)";

  const cardClass = isDarkMode 
    ? "rounded-3xl border border-slate-700 bg-slate-800/80 p-6 shadow-sm backdrop-blur-xl" 
    : "rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl";

  const itemClass = isDarkMode
    ? "flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800 p-4 transition-all hover:border-sky-500 cursor-pointer"
    : "flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-sky-200 cursor-pointer";

  const textPrimary = isDarkMode ? "text-white" : "text-slate-800";
  const textSecondary = isDarkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div 
      className="min-h-screen p-6 md:p-10 font-sans pb-24 transition-all duration-500"
      style={{ background: bgGradient }}
    >
      <div className="mx-auto max-w-3xl space-y-8">
        
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className={`text-3xl font-extrabold tracking-tight transition-colors ${textPrimary}`}>
            Settings
          </h1>
          <p className={`mt-2 font-medium transition-colors ${textSecondary}`}>
            Manage your academic preferences and account details.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          {/* PROFILE SECTION */}
          <section className={cardClass}>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Profile</h2>
            <div className={itemClass}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-500 font-bold text-xl">
                  {/* Mengambil inisial huruf pertama dari nama */}
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className={`font-bold transition-colors ${textPrimary}`}>{userName}</h3>
                  <p className={`text-sm transition-colors ${textSecondary}`}>{userMajor}</p>
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
            </div>
          </section>

          {/* INTEGRATIONS SECTION */}
          <section className={cardClass}>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Integrations</h2>
            <div className={`${itemClass} hover:border-emerald-500`}>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`font-bold transition-colors ${textPrimary}`}>Google Classroom</h3>
                  <p className={`text-sm transition-colors ${textSecondary}`}>Connected to student email</p>
                </div>
              </div>
              <button className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">Connected</button>
            </div>
          </section>

          {/* PREFERENCES SECTION */}
          <section className={cardClass}>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Preferences</h2>
            <div className="space-y-3">
              <div className={itemClass}>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                    <Bell className="h-5 w-5" />
                  </div>
                  <h3 className={`font-bold transition-colors ${textPrimary}`}>Notifications</h3>
                </div>
                <ChevronRight className={`h-5 w-5 transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              </div>
              
              {/* APPEARANCE TOGGLE BUTTON */}
              <div onClick={toggleDarkMode} className={itemClass}>
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${isDarkMode ? 'bg-slate-700 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </div>
                  <h3 className={`font-bold transition-colors ${textPrimary}`}>Appearance</h3>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium transition-colors ${textSecondary}`}>
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  </span>
                  {/* Komponen Toggle Switch Animasi */}
                  <div className={`relative flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-sky-500' : 'bg-slate-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </div>
              </div>

              <div className={itemClass}>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h3 className={`font-bold transition-colors ${textPrimary}`}>Privacy & Security</h3>
                </div>
                <ChevronRight className={`h-5 w-5 transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              </div>
            </div>
          </section>

          {/* LOGOUT BUTTON */}
          <button 
            onClick={handleLogout}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl border p-4 text-sm font-bold transition-all active:scale-[0.98] ${
              isDarkMode 
                ? 'border-rose-900 bg-rose-950/30 text-rose-500 hover:bg-rose-900/50' 
                : 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
            }`}
          >
            <LogOut className="h-5 w-5" /> Log Out
          </button>

        </motion.div>
      </div>
    </div>
  );
}