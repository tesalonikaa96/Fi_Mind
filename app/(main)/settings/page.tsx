"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Bell, GraduationCap, Moon, Sun, Shield, 
  LogOut, ChevronRight, ChevronLeft, Check, 
  Mail, Eye, Lock, Smartphone, RefreshCw, Database,
  Clock, Monitor, Trash2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type SettingView = 'main' | 'notifications' | 'privacy' | 'security' | 'sessions';

export default function SettingsPage() {
  const router = useRouter();
  
  const [currentView, setCurrentView] = useState<SettingView>('main');
  const [userName, setUserName] = useState("Tesalonika Tamba");
  const [userMajor, setUserMajor] = useState("English Literature • Jakarta International University");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [notifs, setNotifs] = useState({ email: true, push: true, deadline: true, quiet: false });
  const [privacy, setPrivacy] = useState({ profilePublic: false, shareActivity: true, syncClassroom: true });
  const [security, setSecurity] = useState({ twoFactor: false, loginAlerts: true });

  useEffect(() => {
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
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const bgGradient = isDarkMode 
    ? "linear-gradient(to bottom right, #020617 0%, #0f172a 100%)" 
    : "linear-gradient(to bottom right, #F0F7FF 0%, #FFFFFF 100%)";

  const cardClass = isDarkMode 
    ? "rounded-[32px] border border-slate-800 bg-slate-900/50 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl" 
    : "rounded-[32px] border border-white bg-white/80 p-5 sm:p-6 shadow-2xl shadow-blue-900/5 backdrop-blur-2xl";

  const itemClass = isDarkMode
    ? "flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-blue-500 cursor-pointer"
    : "flex items-center justify-between rounded-2xl border border-slate-50 bg-white p-4 transition-all hover:border-blue-200 cursor-pointer shadow-sm";

  const textPrimary = isDarkMode ? "text-white" : "text-slate-900";
  const textSecondary = isDarkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div 
      className="min-h-screen p-4 sm:p-6 md:p-10 font-sans pb-24 transition-all duration-500 relative overflow-hidden"
      style={{ background: bgGradient }}
    >
      {/* ── BACKGROUND MESH ── */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-400 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-400 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-2xl lg:max-w-5xl space-y-6 sm:space-y-8 relative z-10">
        
        {/* ── HEADER ── */}
        <header className="flex items-center gap-4">
          {currentView !== 'main' && (
            <button 
              onClick={() => setCurrentView(currentView === 'sessions' ? 'security' : 'main')}
              className={`p-2.5 sm:p-3 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800 shadow-sm'}`}
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="text-left">
            <h1 className={`text-2xl sm:text-4xl font-black tracking-tighter italic transition-colors ${textPrimary}`}>
              {currentView === 'main' ? 'Settings' : 
               currentView === 'notifications' ? 'Notifications' : 
               currentView === 'privacy' ? 'Privacy' : 
               currentView === 'security' ? 'Security' : 'Active Sessions'}
            </h1>
            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] mt-1 text-blue-600">
              Sanctuary Preferences • {userName.split(' ')[0]}
            </p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {currentView === 'main' && (
            <motion.div 
              key="main" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* PROFILE ARCHITECTURE */}
              <section className={`${cardClass} lg:col-span-1`}>
                <h2 className="mb-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Profile Architecture</h2>
                <div className={itemClass}>
                  <div className="flex items-center gap-3 sm:gap-4 text-left">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-xl sm:text-2xl shadow-lg shadow-blue-600/20">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`font-black tracking-tight text-sm sm:text-base truncate ${textPrimary}`}>{userName}</h3>
                      <p className={`text-[10px] sm:text-[11px] font-bold truncate ${textSecondary}`}>{userMajor}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ACADEMIC SYNC */}
              <section className={cardClass}>
                <h2 className="mb-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Academic Sync</h2>
                <div className={itemClass}>
                  <div className="flex items-center gap-3 sm:gap-4 text-left">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <h3 className={`font-black text-xs sm:text-sm tracking-tight ${textPrimary}`}>Google Classroom</h3>
                      <p className={`text-[9px] sm:text-[10px] font-bold ${textSecondary}`}>Identity Synchronized</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    <Check size={12} /> Connected
                  </div>
                  <Check size={18} className="sm:hidden text-emerald-600" />
                </div>
              </section>

              {/* CONFIGURATION HUB */}
              <section className={`${cardClass} lg:col-span-2`}>
                <h2 className="mb-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div onClick={() => setCurrentView('notifications')} className={itemClass}>
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10"><Bell size={20} /></div>
                      <h3 className={`font-black text-xs sm:text-sm tracking-tight ${textPrimary}`}>Notifications</h3>
                    </div>
                    <ChevronRight size={18} className={textSecondary} />
                  </div>

                  <div onClick={toggleDarkMode} className={itemClass}>
                    <div className="flex items-center gap-4 text-left">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                      </div>
                      <h3 className={`font-black text-xs sm:text-sm tracking-tight ${textPrimary}`}>Appearance</h3>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>{isDarkMode ? 'Dark' : 'Light'}</span>
                      <ToggleSwitch active={isDarkMode} onToggle={toggleDarkMode} />
                    </div>
                  </div>

                  <div onClick={() => setCurrentView('privacy')} className={itemClass}>
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10"><Eye size={20} /></div>
                      <h3 className={`font-black text-xs sm:text-sm tracking-tight ${textPrimary}`}>Privacy Control</h3>
                    </div>
                    <ChevronRight size={18} className={textSecondary} />
                  </div>

                  <div onClick={() => setCurrentView('security')} className={itemClass}>
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10"><Shield size={20} /></div>
                      <h3 className={`font-black text-xs sm:text-sm tracking-tight ${textPrimary}`}>Security & Access</h3>
                    </div>
                    <ChevronRight size={18} className={textSecondary} />
                  </div>
                </div>
              </section>

              <div className="lg:col-span-2">
                <button 
                  onClick={handleLogout}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl border-2 py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] ${
                    isDarkMode 
                      ? 'border-rose-900 bg-rose-950/20 text-rose-500' 
                      : 'border-rose-100 bg-rose-50 text-rose-600'
                  }`}
                >
                  <LogOut size={16} /> Terminate Session
                </button>
              </div>
            </motion.div>
          )}

          {/* ── SUB-VIEWS (NOTIFS, PRIVACY, SECURITY, SESSIONS) ── */}
          {(currentView !== 'main') && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mx-auto w-full max-w-2xl"
            >
              <section className={cardClass}>
                <div className="space-y-3 sm:space-y-4">
                  {currentView === 'notifications' && (
                    <>
                      <NotificationItem icon={<Mail size={18} />} title="Email Alerts" desc="Daily sanctuary summaries" active={notifs.email} onToggle={() => setNotifs({...notifs, email: !notifs.email})} isDarkMode={isDarkMode} />
                      <NotificationItem icon={<Bell size={18} />} title="Push Notifications" desc="Real-time flow updates" active={notifs.push} onToggle={() => setNotifs({...notifs, push: !notifs.push})} isDarkMode={isDarkMode} />
                      <NotificationItem icon={<Clock size={18} />} title="Deadline Alarms" desc="24h before submission" active={notifs.deadline} onToggle={() => setNotifs({...notifs, deadline: !notifs.deadline})} isDarkMode={isDarkMode} />
                    </>
                  )}
                  {currentView === 'privacy' && (
                    <>
                      <NotificationItem icon={<Eye size={18} />} title="Public Profile" desc="Show major and status to others" active={privacy.profilePublic} onToggle={() => setPrivacy({...privacy, profilePublic: !privacy.profilePublic})} isDarkMode={isDarkMode} />
                      <NotificationItem icon={<Database size={18} />} title="Classroom Sync" desc="Let Fi-Mind analyze your tasks" active={privacy.syncClassroom} onToggle={() => setPrivacy({...privacy, syncClassroom: !privacy.syncClassroom})} isDarkMode={isDarkMode} />
                    </>
                  )}
                  {currentView === 'security' && (
                    <>
                      <NotificationItem icon={<Lock size={18} />} title="Two-Factor Auth" desc="High-level identity protection" active={security.twoFactor} onToggle={() => setSecurity({...security, twoFactor: !security.twoFactor})} isDarkMode={isDarkMode} />
                      <NotificationItem icon={<Smartphone size={18} />} title="Login Alerts" desc="Notify on new device activity" active={security.loginAlerts} onToggle={() => setSecurity({...security, loginAlerts: !security.loginAlerts})} isDarkMode={isDarkMode} />
                      <div onClick={() => setCurrentView('sessions')} className={itemClass}>
                        <div className="flex items-center gap-4 text-left">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800"><RefreshCw size={18} /></div>
                          <h4 className={`font-black text-xs sm:text-sm ${textPrimary}`}>Active Sessions</h4>
                        </div>
                        <ChevronRight size={18} className={textSecondary} />
                      </div>
                    </>
                  )}
                  {currentView === 'sessions' && (
                    <div className="space-y-4">
                      <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-50 bg-white'}`}>
                        <div className="flex items-center gap-4 text-left">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><Monitor size={18} /></div>
                          <div>
                            <h4 className={`font-black text-xs sm:text-sm ${textPrimary}`}>Windows Desktop</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Bekasi Regency • Active Now</p>
                          </div>
                        </div>
                        <span className="text-[8px] font-black text-blue-600 uppercase px-2 py-1 bg-blue-50 rounded-md">Current</span>
                      </div>
                      <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-50 bg-white'}`}>
                        <div className="flex items-center gap-4 text-left">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400`}><Smartphone size={18} /></div>
                          <div>
                            <h4 className={`font-black text-xs sm:text-sm ${textPrimary}`}>iPhone 15 Pro</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Jakarta • 2 hours ago</p>
                          </div>
                        </div>
                        <button className="text-rose-500 p-2"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── REUSABLE MINI-COMPONENTS ──

function ToggleSwitch({ active, onToggle }: { active: boolean, onToggle: () => void }) {
  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={`relative flex h-5 w-9 sm:h-6 sm:w-11 shrink-0 items-center rounded-full transition-colors duration-300 cursor-pointer ${active ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
    >
      <motion.span animate={{ x: active ? (typeof window !== 'undefined' && window.innerWidth < 640 ? 18 : 22) : 2 }} className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm" />
    </div>
  );
}

function NotificationItem({ icon, title, desc, active, onToggle, isDarkMode }: any) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-50 bg-white shadow-sm'}`}>
      <div className="flex items-center gap-3 sm:gap-4 text-left">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <h4 className={`font-black text-xs sm:text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{desc}</p>
        </div>
      </div>
      <ToggleSwitch active={active} onToggle={onToggle} />
    </div>
  );
}