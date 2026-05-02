"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Bell, GraduationCap, Moon, Sun, Shield, 
  LogOut, ChevronRight, ChevronLeft, Check, 
  Mail, Eye, Lock, Smartphone, RefreshCw, Database,
  Clock, Settings, Monitor, Trash2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ── TYPES FOR NAVIGATION ──
// Ditambahkan 'sessions' agar view bisa berganti
type SettingView = 'main' | 'notifications' | 'privacy' | 'security' | 'sessions';

export default function SettingsPage() {
  const router = useRouter();
  
  // ── CORE STATES ──
  const [currentView, setCurrentView] = useState<SettingView>('main');
  const [userName, setUserName] = useState("Tesalonika Tamba");
  const [userMajor, setUserMajor] = useState("English Literature • Jakarta International University");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ── PREFERENCE STATES (TOGGLES) ──
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

  // ── STYLING LOGIC ──
  const bgGradient = isDarkMode 
    ? "linear-gradient(to bottom right, #020617 0%, #0f172a 100%)" 
    : "linear-gradient(to bottom right, #F0F7FF 0%, #FFFFFF 100%)";

  const cardClass = isDarkMode 
    ? "rounded-[32px] border border-slate-800 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-2xl" 
    : "rounded-[32px] border border-white bg-white/80 p-6 shadow-2xl shadow-blue-900/5 backdrop-blur-2xl";

  const itemClass = isDarkMode
    ? "flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-blue-500 cursor-pointer"
    : "flex items-center justify-between rounded-2xl border border-slate-50 bg-white p-4 transition-all hover:border-blue-200 cursor-pointer shadow-sm";

  const textPrimary = isDarkMode ? "text-white" : "text-slate-900";
  const textSecondary = isDarkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div 
      className="min-h-screen p-6 md:p-10 font-sans pb-24 transition-all duration-500 relative overflow-hidden"
      style={{ background: bgGradient }}
    >
      {/* ── BACKGROUND MESH ── */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-2xl space-y-8 relative z-10">
        
        {/* ── HEADER ── */}
        <header className="flex items-center gap-4">
          {currentView !== 'main' && (
            <button 
              // Jika di sessions, balik ke security. Jika di security, balik ke main.
              onClick={() => setCurrentView(currentView === 'sessions' ? 'security' : 'main')}
              className={`p-3 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800 shadow-sm'}`}
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="text-left">
            <h1 className={`text-4xl font-black tracking-tighter italic transition-colors ${textPrimary}`}>
              {currentView === 'main' ? 'Settings' : 
               currentView === 'notifications' ? 'Notifications' : 
               currentView === 'privacy' ? 'Privacy' : 
               currentView === 'security' ? 'Security' : 'Active Sessions'}
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-1 text-blue-600">
              Sanctuary Preferences • {userName.split(' ')[0]}
            </p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {currentView === 'main' && (
            <motion.div 
              key="main" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* PROFILE */}
              <section className={cardClass}>
                <h2 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Profile Architecture</h2>
                <div className={itemClass}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-2xl shadow-lg shadow-blue-600/20">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <h3 className={`font-black tracking-tight ${textPrimary}`}>{userName}</h3>
                      <p className={`text-[11px] font-bold ${textSecondary}`}>{userMajor}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className={textSecondary} />
                </div>
              </section>

              {/* INTEGRATIONS */}
              <section className={cardClass}>
                <h2 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Academic Sync</h2>
                <div className={itemClass}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                      <GraduationCap size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className={`font-black text-sm tracking-tight ${textPrimary}`}>Google Classroom</h3>
                      <p className={`text-[10px] font-bold ${textSecondary}`}>Identity Synchronized</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    <Check size={12} /> Connected
                  </div>
                </div>
              </section>

              {/* PREFERENCES */}
              <section className={cardClass}>
                <h2 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Configuration</h2>
                <div className="space-y-3">
                  <div onClick={() => setCurrentView('notifications')} className={itemClass}>
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10"><Bell size={20} /></div>
                      <h3 className={`font-black text-sm tracking-tight ${textPrimary}`}>Notifications</h3>
                    </div>
                    <ChevronRight size={18} className={textSecondary} />
                  </div>

                  <div onClick={toggleDarkMode} className={itemClass}>
                    <div className="flex items-center gap-4 text-left">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                      </div>
                      <h3 className={`font-black text-sm tracking-tight ${textPrimary}`}>Appearance</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>{isDarkMode ? 'Dark' : 'Light'}</span>
                      <ToggleSwitch active={isDarkMode} onToggle={toggleDarkMode} />
                    </div>
                  </div>

                  <div onClick={() => setCurrentView('privacy')} className={itemClass}>
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10"><Eye size={20} /></div>
                      <h3 className={`font-black text-sm tracking-tight ${textPrimary}`}>Privacy Control</h3>
                    </div>
                    <ChevronRight size={18} className={textSecondary} />
                  </div>

                  <div onClick={() => setCurrentView('security')} className={itemClass}>
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10"><Shield size={20} /></div>
                      <h3 className={`font-black text-sm tracking-tight ${textPrimary}`}>Security & Access</h3>
                    </div>
                    <ChevronRight size={18} className={textSecondary} />
                  </div>
                </div>
              </section>

              <button 
                onClick={handleLogout}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl border-2 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] ${
                  isDarkMode 
                    ? 'border-rose-900 bg-rose-950/20 text-rose-500 hover:bg-rose-900/40' 
                    : 'border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-xl shadow-rose-900/5'
                }`}
              >
                <LogOut size={16} /> Terminate Session
              </button>
            </motion.div>
          )}

          {/* ── NOTIFICATIONS VIEW ── */}
          {currentView === 'notifications' && (
            <motion.div 
              key="notifs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <section className={cardClass}>
                <div className="space-y-4">
                  <NotificationItem 
                    icon={<Mail size={18} />} 
                    title="Email Alerts" 
                    desc="Daily sanctuary summaries"
                    active={notifs.email} 
                    onToggle={() => setNotifs({...notifs, email: !notifs.email})}
                    isDarkMode={isDarkMode}
                  />
                  <NotificationItem 
                    icon={<Bell size={18} />} 
                    title="Push Notifications" 
                    desc="Real-time flow updates"
                    active={notifs.push} 
                    onToggle={() => setNotifs({...notifs, push: !notifs.push})}
                    isDarkMode={isDarkMode}
                  />
                  <NotificationItem 
                    icon={<Clock size={18} />} 
                    title="Deadline Alarms" 
                    desc="24h before submission"
                    active={notifs.deadline} 
                    onToggle={() => setNotifs({...notifs, deadline: !notifs.deadline})}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </section>
            </motion.div>
          )}

          {/* ── PRIVACY VIEW ── */}
          {currentView === 'privacy' && (
            <motion.div 
              key="privacy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <section className={cardClass}>
                <div className="space-y-4">
                  <NotificationItem 
                    icon={<Eye size={18} />} 
                    title="Public Profile" 
                    desc="Show major and status to others"
                    active={privacy.profilePublic} 
                    onToggle={() => setPrivacy({...privacy, profilePublic: !privacy.profilePublic})}
                    isDarkMode={isDarkMode}
                  />
                  <NotificationItem 
                    icon={<Database size={18} />} 
                    title="Classroom Sync" 
                    desc="Let Fi-Mind analyze your tasks"
                    active={privacy.syncClassroom} 
                    onToggle={() => setPrivacy({...privacy, syncClassroom: !privacy.syncClassroom})}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </section>
            </motion.div>
          )}

          {/* ── SECURITY VIEW ── */}
          {currentView === 'security' && (
            <motion.div 
              key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <section className={cardClass}>
                <div className="space-y-4">
                  <NotificationItem 
                    icon={<Lock size={18} />} 
                    title="Two-Factor Auth" 
                    desc="High-level identity protection"
                    active={security.twoFactor} 
                    onToggle={() => setSecurity({...security, twoFactor: !security.twoFactor})}
                    isDarkMode={isDarkMode}
                  />
                  <NotificationItem 
                    icon={<Smartphone size={18} />} 
                    title="Login Alerts" 
                    desc="Notify on new device activity"
                    active={security.loginAlerts} 
                    onToggle={() => setSecurity({...security, loginAlerts: !security.loginAlerts})}
                    isDarkMode={isDarkMode}
                  />
                  {/* DIUBAH DISINI: Menambahkan onClick untuk mengganti view */}
                  <div 
                    onClick={() => setCurrentView('sessions')} 
                    className={itemClass}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800"><RefreshCw size={18} /></div>
                      <h4 className={`font-black text-sm ${textPrimary}`}>Active Sessions</h4>
                    </div>
                    <ChevronRight size={18} className={textSecondary} />
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* ── SESSIONS VIEW (BARU) ── */}
          {currentView === 'sessions' && (
            <motion.div 
              key="sessions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-left"
            >
              <section className={cardClass}>
                <h2 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Manage Devices</h2>
                <div className="space-y-4">
                  {/* Device 1 */}
                  <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-50 bg-white'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                        <Monitor size={18} />
                      </div>
                      <div>
                        <h4 className={`font-black text-sm ${textPrimary}`}>Windows Desktop</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Bekasi Regency • Active Now</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-blue-600 uppercase px-2 py-1 bg-blue-50 rounded-md">This Device</span>
                  </div>

                  {/* Device 2 */}
                  <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-50 bg-white'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-400'}`}>
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <h4 className={`font-black text-sm ${textPrimary}`}>iPhone 15 Pro</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Jakarta • 2 hours ago</p>
                      </div>
                    </div>
                    <button className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
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
      className={`relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 cursor-pointer ${active ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
    >
      <motion.span 
        animate={{ x: active ? 24 : 4 }}
        className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm" 
      />
    </div>
  );
}

function NotificationItem({ icon, title, desc, active, onToggle, isDarkMode }: any) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-50 bg-white shadow-sm'}`}>
      <div className="flex items-center gap-4 text-left">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
          {icon}
        </div>
        <div>
          <h4 className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{desc}</p>
        </div>
      </div>
      <ToggleSwitch active={active} onToggle={onToggle} />
    </div>
  );
}