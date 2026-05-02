"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wind, PenTool, CalendarDays, Send, 
  ChevronLeft, ChevronRight, TrendingUp, X, 
  BookOpen, Zap, Play, Flame, ShieldCheck, ChevronRight as ChevronRightIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── COMPONENT: FIMI THE FOX (DYNAMICAL SVG) ──
const FimiMascotSVG = ({ isTalking }: { isTalking: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path d="M85 60C95 50 95 30 85 20C75 10 60 10 50 20C40 30 40 50 50 60" fill="#FB923C" animate={{ rotate: isTalking ? [0, 5, 0] : 0 }} transition={{ repeat: Infinity, duration: 1 }} />
    <path d="M85 60C90 55 90 45 85 40L75 50L85 60Z" fill="white" /> 
    <circle cx="50" cy="60" r="25" fill="#FB923C" />
    <circle cx="50" cy="65" r="18" fill="white" /> 
    <motion.g animate={{ y: isTalking ? [-1, 1, -1] : 0 }} transition={{ repeat: Infinity, duration: 0.5 }}>
      <path d="M25 40L50 15L75 40C75 55 60 65 50 65C40 65 25 55 25 40Z" fill="#F97316" /> 
      <path d="M25 40L15 20L35 30L25 40Z" fill="#F97316" />
      <path d="M30 35L22 25L32 30L30 35Z" fill="#FECACA" /> 
      <path d="M75 40L85 20L65 30L75 40Z" fill="#F97316" />
      <path d="M70 35L78 25L68 30L70 35Z" fill="#FECACA" />
      <path d="M50 65C60 65 70 58 70 50C70 42 60 38 50 38C40 38 30 42 30 50C30 58 40 65 50 65Z" fill="white" />
      <circle cx="50" cy="50" r="3" fill="#1F2937" />
      <motion.path 
        d="M45 56C47 58 53 58 55 56" 
        stroke="#1F2937" strokeWidth="2" strokeLinecap="round" 
        animate={isTalking ? { d: ["M45 56C47 58 53 58 55 56", "M45 56C47 60 53 60 55 56", "M45 56C47 58 53 58 55 56"] } : { d: "M45 56C47 58 53 58 55 56" }}
        transition={{ repeat: Infinity, duration: 0.3 }}
      />
      <motion.ellipse cx="38" cy="45" rx="3" ry="5" fill="#1F2937" animate={{ scaleY: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1], delay: 1 }} />
      <motion.ellipse cx="62" cy="45" rx="3" ry="5" fill="#1F2937" animate={{ scaleY: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1], delay: 1 }} />
    </motion.g>
  </svg>
);

const LANES = 4;
const moodOptions = [
  { emoji: "🤩", label: "Energized" }, { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Okay" }, { emoji: "🥱", label: "Tired" },
  { emoji: "😵‍💫", label: "Burnout" }, { emoji: "😰", label: "Anxious" },
];

export default function MoodSanctuaryPage() {
  const [userName, setUserName] = useState("Tesalonika");
  const [journalText, setJournalText] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<{date: string, mood: string, note: string} | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathePhase, setBreathePhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [diaryData, setDiaryData] = useState<Record<string, {mood: string, note: string}>>({});
  const todayStr = new Date().toISOString().split('T')[0];

  // Fimi State
  const [showFimi, setShowFimi] = useState(false);
  const [fimiStep, setFimiStep] = useState(0);
  const fimiDialogues = [
    "Writing things down is a great way to clear your head, Tesalonika! 🦊",
    "Your diary is a safe space. No judgment here, only peace.",
    "I've saved your entry in the sanctuary. Take another deep breath! ✨"
  ];

  useEffect(() => {
    const savedData = localStorage.getItem("fi-mind-diary");
    if (savedData) setDiaryData(JSON.parse(savedData));
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.full_name) {
        setUserName(session.user.user_metadata.full_name.split(' ')[0]);
      }
    });
  }, []);

  const handleReleaseJournal = () => {
    if (!journalText.trim()) return;
    const currentEntry = diaryData[todayStr] || { mood: "😐", note: "" };
    const newData = { ...diaryData, [todayStr]: { ...currentEntry, note: journalText } };
    setDiaryData(newData);
    localStorage.setItem("fi-mind-diary", JSON.stringify(newData));
    setJournalText("");
    
    // Trigger Fimi
    setFimiStep(0);
    setShowFimi(true);
  };

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const dominantMood = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i);
      return diaryData[d.toISOString().split('T')[0]]?.mood;
    }).filter(Boolean);
    if (last7Days.length === 0) return { emoji: "✨", label: "No data" };
    const counts = last7Days.reduce((acc: any, m) => { acc[m] = (acc[m] || 0) + 1; return acc; }, {});
    const topEmoji = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    return { emoji: topEmoji, label: moodOptions.find(m => m.emoji === topEmoji)?.label || "Steady" };
  }, [diaryData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathePhase(p => p === "Inhale" ? "Hold" : p === "Hold" ? "Exhale" : "Inhale");
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  return (
    <div className="min-h-screen p-4 md:p-10 pb-24 relative overflow-hidden bg-[#F0F7FF] dark:bg-slate-950 transition-colors duration-500">
      
      {/* ── BACKGROUND MESH GRADIENTS ── */}
      <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-20">
         <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-blue-300 rounded-full blur-[120px]" />
         <div className="absolute top-1/2 -left-48 w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl space-y-8 relative z-10">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="text-left">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
              Mood Sanctuary <span className="text-blue-600 text-xl font-medium tracking-normal font-serif">/ Diary</span>
            </h1>
            <p className="text-blue-700 font-bold uppercase tracking-[0.2em] text-[8px] mt-1 flex items-center gap-2">
              <ShieldCheck size={12} /> Sanctuary Identity: Synced
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl px-6 py-4 rounded-[28px] border-2 border-white shadow-xl shadow-blue-900/5 flex items-center gap-4">
             <div className="text-right">
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">7-Day Dominant</p>
                <p className="text-sm font-black text-slate-800">{dominantMood.label}</p>
             </div>
             <div className="text-4xl">{dominantMood.emoji}</div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* ── KALENDER UTAMA ── */}
          <section className="lg:col-span-8 bg-white/90 backdrop-blur-2xl rounded-[40px] border-2 border-white p-8 shadow-2xl shadow-blue-900/5 relative">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-blue-800 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-800/20">
                      <CalendarDays size={18} />
                   </div>
                   <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">
                      {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                   </h2>
                </div>
                <div className="flex gap-2">
                   <button className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-100 text-slate-400 hover:text-blue-700 transition-colors"><ChevronLeft size={20} /></button>
                   <button className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-100 text-slate-400 hover:text-blue-700 transition-colors"><ChevronRight size={20} /></button>
                </div>
             </div>

             <div className="grid grid-cols-7 gap-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-[8px] font-black text-slate-300 uppercase tracking-widest mb-2">{d}</div>
                ))}
                
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`p-${i}`} />)}
                
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const entry = diaryData[dateKey];
                  const isToday = day === now.getDate();

                  return (
                    <motion.button 
                      key={day}
                      whileHover={{ y: -3, scale: 1.02 }}
                      onClick={() => entry && setSelectedEntry({date: dateKey, ...entry})}
                      className={`aspect-[4/5] rounded-[24px] flex flex-col items-center justify-center relative border-2 transition-all ${
                        isToday ? "border-blue-600 bg-blue-50 shadow-xl shadow-blue-600/10" : "border-slate-50 bg-white hover:border-blue-200"
                      }`}
                    >
                      <span className="absolute top-3 left-4 text-[9px] font-black text-slate-300">{day}</span>
                      {entry?.mood && <span className="text-2xl mb-1">{entry.mood}</span>}
                      {entry?.note && (
                        <div className="absolute bottom-2 right-2 h-4 w-4 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                          <PenTool size={10} />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
             </div>
          </section>

          {/* ── ASIDE ── */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Brain Dump Journal */}
            <section className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
               <div className="relative z-10 text-left">
                  <div className="flex items-center gap-2 text-blue-400 font-black text-[9px] uppercase tracking-[0.2em] mb-5">
                     <BookOpen size={14} /> Brain Dump Journal
                  </div>
                  <textarea 
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="Write your story today..."
                    className="w-full h-32 bg-white/5 border-2 border-white/5 rounded-3xl p-4 text-sm text-slate-100 placeholder:text-white/20 outline-none focus:border-blue-500 transition-all resize-none font-medium"
                  />
                  <button 
                    onClick={handleReleaseJournal}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-blue-900/40"
                  >
                    <Send size={14} /> Save to Diary
                  </button>
               </div>
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            </section>

            {/* Breathing Room */}
            <section className="bg-white/90 backdrop-blur-xl rounded-[40px] border-2 border-white p-8 shadow-xl text-center relative overflow-hidden">
               <div className="absolute top-6 left-8 flex items-center gap-2 text-teal-600 font-black text-[9px] uppercase tracking-widest">
                 <Wind size={14} /> Breathing Room
               </div>
               <div className="relative mt-8 mx-auto flex h-28 w-28 items-center justify-center">
                 <motion.div 
                   className="absolute inset-0 rounded-full bg-teal-100/50" 
                   animate={isBreathing ? { scale: breathePhase === "Inhale" ? 1.4 : breathePhase === "Exhale" ? 0.8 : 1.4 } : { scale: 1 }} 
                   transition={{ duration: 3, ease: "easeInOut" }} 
                 />
                 <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl border border-teal-50">
                   <span className="text-[10px] font-black text-teal-700 uppercase tracking-tighter">{isBreathing ? breathePhase : "Ready"}</span>
                 </div>
               </div>
               <button 
                 onClick={() => setIsBreathing(!isBreathing)} 
                 className={`mt-8 rounded-2xl w-full py-4 text-[10px] font-black shadow-xl transition-all active:scale-95 uppercase tracking-widest ${isBreathing ? "bg-slate-100 text-slate-600 shadow-none" : "bg-teal-600 text-white hover:bg-teal-500 shadow-teal-900/10"}`}
               >
                 {isBreathing ? "Stop" : "Start"}
               </button>
            </section>

            {/* Rhythm Session */}
            <section className="bg-white/90 backdrop-blur-xl rounded-[40px] border-2 border-white p-8 shadow-xl cursor-pointer group text-left" onClick={() => setIsGameModalOpen(true)}>
               <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-blue-50 text-blue-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Zap size={20} /></div>
                  <h3 className="font-black text-slate-800 uppercase text-[9px] tracking-widest">Rhythm Session</h3>
               </div>
               <p className="text-[10px] font-bold text-slate-400 leading-relaxed mb-5 pr-4">Feeling overwhelmed? Let the melody guide your focus back to peace.</p>
               <button className="w-full bg-blue-800 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/10 flex items-center justify-center gap-2">
                  <Play size={14} fill="currentColor" /> Play Game
               </button>
            </section>

          </aside>
        </div>
      </div>

      {/* ── FIMI MASKOT POPUP (DIARY REWARD) ── */}
      <AnimatePresence>
        {showFimi && (
          <div className="fixed inset-0 z-[250] flex items-end justify-end p-8 pointer-events-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/20 backdrop-blur-[2px] pointer-events-auto" onClick={() => setShowFimi(false)} />
            <motion.div 
              initial={{ y: 150, opacity: 0, scale: 0.8 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 100, opacity: 0 }} 
              transition={{ type: "spring", bounce: 0.4 }}
              className="relative z-[260] flex items-end gap-5 max-w-sm w-full pointer-events-auto text-left"
            >
              <div className="bg-white p-6 rounded-[32px] rounded-br-sm shadow-3xl border-2 border-blue-200 relative flex-1 mb-10">
                <p className="text-slate-800 text-sm font-bold leading-relaxed">
                  {fimiDialogues[fimiStep]}
                </p>
                <button onClick={() => fimiStep < fimiDialogues.length - 1 ? setFimiStep(s => s + 1) : setShowFimi(false)} className="mt-5 w-full bg-blue-800 text-white font-black text-[10px] py-4 rounded-xl uppercase tracking-widest shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 active:scale-95">
                  {fimiStep < fimiDialogues.length - 1 ? "Next" : "Got it, Fimi!"} <ChevronRightIcon size={14} />
                </button>
                <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white border-b-2 border-r-2 border-blue-200 transform rotate-45" />
              </div>
              <div className="w-20 h-20 shrink-0"><FimiMascotSVG isTalking={true} /></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODALS (EXISTING) ── */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[48px] overflow-hidden shadow-2xl border-2 border-white">
              <div className="p-10 bg-blue-50 flex items-center justify-between text-left">
                <div className="flex items-center gap-5">
                  <span className="text-6xl">{selectedEntry.mood}</span>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">{new Date(selectedEntry.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Sanctuary Records</p>
                  </div>
                </div>
                <button onClick={() => setSelectedEntry(null)} className="p-3 bg-white shadow-sm rounded-full transition-colors hover:text-blue-600"><X size={24} /></button>
              </div>
              <div className="p-10 text-left">
                <div className="bg-slate-50 rounded-[32px] p-8 min-h-[180px] border-2 border-slate-100">
                  <p className="text-slate-700 leading-relaxed italic text-sm font-medium">&quot;{selectedEntry.note || "No notes recorded for this date."}&quot;</p>
                </div>
                <button onClick={() => setSelectedEntry(null)} className="w-full mt-10 bg-blue-800 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10">Return to Sanctuary</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGameModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-slate-950/95 backdrop-blur-3xl flex items-center justify-center p-4">
            <button onClick={() => setIsGameModalOpen(false)} className="absolute top-10 right-10 text-white p-5 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10"><X /></button>
            <div className="text-white text-center max-w-sm">
               <h2 className="text-4xl font-black italic mb-4 tracking-tighter italic">RHYTHM PRO</h2>
               <p className="text-slate-400 font-bold text-xs leading-relaxed mb-10">Sync your heartbeat with the flow. Use your keyboard to hit the targets as they descend.</p>
               <button onClick={() => setIsGameModalOpen(false)} className="bg-blue-600 hover:bg-blue-500 px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/40">Enter the Flow</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Atmospheric depth blobs */}
      <div className="fixed top-1/4 left-0 w-64 h-64 bg-blue-400/5 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-indigo-400/5 blur-[120px] pointer-events-none" />
    </div>
  );
}