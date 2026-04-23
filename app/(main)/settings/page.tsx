"use client";
import { motion } from "framer-motion";
import { User, Bell, GraduationCap, Moon, Shield, LogOut, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  return (
    <div 
      className="min-h-screen p-6 md:p-10 font-sans pb-24"
      style={{ background: "linear-gradient(to bottom right, #e0f2fe 0%, #f0f9ff 50%, #f8fafc 100%)" }}
    >
      <div className="mx-auto max-w-3xl space-y-8">
        
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Settings
          </h1>
          <p className="mt-2 text-slate-600 font-medium">
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
          <section className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Profile</h2>
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-sky-200 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-500 font-bold text-xl">
                  T
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Tesalonika Tamba</h3>
                  <p className="text-sm text-slate-500">English Literature • Jakarta International University</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </div>
          </section>

          {/* INTEGRATIONS SECTION */}
          <section className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Integrations</h2>
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-emerald-200 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Google Classroom</h3>
                  <p className="text-sm text-slate-500">Connected to student email</p>
                </div>
              </div>
              <button className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">Connected</button>
            </div>
          </section>

          {/* PREFERENCES SECTION */}
          <section className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Preferences</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-sky-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                    <Bell className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300" />
              </div>
              
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-sky-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Moon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-800">Appearance</h3>
                </div>
                <span className="text-sm font-medium text-slate-400 mr-2">Light Mode</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-sky-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-800">Privacy & Security</h3>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300" />
              </div>
            </div>
          </section>

          {/* LOGOUT BUTTON */}
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100 active:scale-[0.98]">
            <LogOut className="h-5 w-5" /> Log Out
          </button>

        </motion.div>
      </div>
    </div>
  );
}