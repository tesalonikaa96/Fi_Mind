"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wind, PenTool, CalendarDays, Send, 
  ChevronLeft, ChevronRight, X, 
  BookOpen, Zap, Play, ShieldCheck, ChevronRight as ChevronRightIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── COMPONENT: FIMI THE FOX (MASCOT) ──
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

const moodOptions = [
  { emoji: "🤩", label: "Energized" }, { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Okay" }, { emoji: "🥱", label: "Tired" },
  { emoji: "😵‍💫", label: "Burnout" }, { emoji: "😰", label: "Anxious" },
];

export default function MoodSanctuaryPage() {
  const [userName, setUserName] = useState("User");
  const [journalText, setJournalText] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<{date: string, mood: string, note: string} | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathePhase, setBreathePhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [diaryData, setDiaryData] = useState<Record<string, {mood: string, note: string}>>({});
  const todayStr = new Date().toISOString().split('T')[0];

  const [showFimi, setShowFimi] = useState(false);
  const [fimiStep, setFimiStep] = useState(0);
  const fimiDialogues = useMemo(() => [
    `Writing things down is a great way to clear your head, ${userName}! 🦊`,
    "Your diary is a safe space. No judgment here, only peace.",
    "I've saved your entry in the sanctuary. Take another deep breath! ✨"
  ], [userName]);

  // ✅ AUDIO LOGIC (Synthesized Piano - 100% Reliable)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthesizedPiano = (currentScore: number) => {
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Piano frequencies (C4, D4, E4, F4, G4, A4, B4, C5)
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    osc.type = "sine"; 
    osc.frequency.setValueAtTime(notes[currentScore % notes.length], ctx.currentTime);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  useEffect(() => {
    const savedData = localStorage.getItem("fi-mind-diary");
    if (savedData) setDiaryData(JSON.parse(savedData));
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.full_name) {
        setUserName(session.user.user_metadata.full_name.split(' ')[0]);
      } else if (session?.user?.email) {
        setUserName(session.user.email.split('@')[0]);
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

  // ── PIANO RHYTHM GAME STATE ──
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [tiles, setTiles] = useState<Array<{id: number, col: number, y: number, clicked: boolean}>>([]);
  const [speed, setSpeed] = useState(2);

  // Piano Game Engine
  useEffect(() => {
    if (gameState !== "playing") return;
    
    const interval = setInterval(() => {
      setTiles(prev => {
        let newTiles = prev.map(t => ({ ...t, y: t.y + speed }));
        if (newTiles.some(t => t.y > 100 && !t.clicked)) {
          setGameState("gameover");
          return prev;
        }
        newTiles = newTiles.filter(t => !(t.clicked && t.y > 100));
        const lastTile = newTiles[newTiles.length - 1];
        if (!lastTile || lastTile.y > 25) {
          newTiles.push({ 
            id: Date.now() + Math.random(), 
            col: Math.floor(Math.random() * 4), 
            y: lastTile ? lastTile.y - 25 : -25, 
            clicked: false 
          });
        }
        return newTiles;
      });
    }, 30); 
    return () => clearInterval(interval);
  }, [gameState, speed]);

  const startGame = () => {
    // Memancing AudioContext agar aktif (syarat browser)
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
    }

    setScore(0);
    setSpeed(1.5);
    setTiles([{ id: Date.now(), col: Math.floor(Math.random() * 4), y: -25, clicked: false }]);
    setGameState("playing");
  };

  const clickTile = (id: number) => {
    setTiles(prev => {
      const unclicked = prev.filter(t => !t.clicked);
      const lowest = unclicked.reduce((acc, curr) => (acc.y > curr.y ? acc : curr), unclicked[0]);
      
      if (lowest && lowest.id === id) {
        // ✅ PLAY SOUND
        playSynthesizedPiano(score);

        setScore(s => {
          const newScore = s + 1;
          if (newScore > 0 && newScore % 10 === 0) setSpeed(sp => sp + 0.3);
          return newScore;
        });
        return prev.map(t => t.id === id ? { ...t, clicked: true } : t);
      } else {
        setGameState("gameover");
        return prev;
      }
    });
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-10 pb-24 relative overflow-hidden bg-[#F0F7FF] dark:bg-slate-950 transition-colors duration-500 text-left">
      
      {/* ── BACKGROUND MESH ── */}
      <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-20">
         <div className="absolute -top-48 -right-48 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-300 dark:bg-blue-800 rounded-full blur-[120px]" />
         <div className="absolute top-1/2 -left-48 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-300 dark:bg-indigo-900 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl space-y-8 relative z-10">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-left">
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
              {userName}&apos;s Mood Sanctuary <span className="text-blue-600 dark:text-blue-400 text-lg font-medium tracking-normal font-serif">/ Fimi&apos;s Diary</span>
            </h1>
            <p className="text-blue-700 dark:text-blue-500 font-bold uppercase tracking-[0.2em] text-[8px] mt-1 flex items-center gap-2">
              <ShieldCheck size={12} /> Sanctuary Identity: Synced
            </p>
          </div>
          <div className="w-full sm:w-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-4 rounded-[28px] border-2 border-white dark:border-slate-800 shadow-xl shadow-blue-900/5 flex items-center justify-between sm:justify-start gap-4">
             <div className="text-right">
                <p className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">7-Day Dominant</p>
                <p className="text-sm font-black text-slate-800 dark:text-slate-200">{dominantMood.label}</p>
             </div>
             <div className="text-3xl sm:text-4xl">{dominantMood.emoji}</div>
          </div>
        </header>

        {/* ── MAIN RESPONSIVE GRID ── */}
        <div className="grid gap-8 lg:grid-cols-12 text-left">
          
          {/* CALENDAR SECTION */}
          <section className="lg:col-span-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] sm:rounded-[40px] border-2 border-white dark:border-slate-800 p-5 sm:p-8 shadow-2xl shadow-blue-900/5 relative text-left">
             <div className="flex items-center justify-between mb-8 sm:mb-10 text-left">
                <div className="flex items-center gap-3">
                   <div className="h-9 w-9 sm:h-10 sm:w-10 bg-blue-800 dark:bg-blue-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-800/20 dark:shadow-none">
                      <CalendarDays size={18} />
                   </div>
                   <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter text-left">
                      {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                   </h2>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"><ChevronLeft size={18} /></button>
                   <button className="p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"><ChevronRight size={18} /></button>
                </div>
             </div>

             <div className="grid grid-cols-7 gap-1.5 sm:gap-3 text-left">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-[7px] sm:text-[8px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest mb-2">{d}</div>
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
                      whileHover={{ y: -2, scale: 1.02 }}
                      onClick={() => entry && setSelectedEntry({date: dateKey, ...entry})}
                      className={`aspect-[4/5] rounded-[16px] sm:rounded-[24px] flex flex-col items-center justify-center relative border-2 transition-all ${
                        isToday 
                          ? "border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-xl shadow-blue-600/10 dark:shadow-none" 
                          : "border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700"
                      }`}
                    >
                      <span className="absolute top-1.5 sm:top-3 left-2 sm:left-4 text-[7px] sm:text-[9px] font-black text-slate-300 dark:text-slate-500">{day}</span>
                      {entry?.mood && <span className="text-lg sm:text-2xl mb-1">{entry.mood}</span>}
                      {entry?.note && (
                        <div className="absolute bottom-1.5 right-1.5 h-3 w-3 sm:h-4 sm:w-4 bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-md sm:rounded-lg flex items-center justify-center">
                          <PenTool size={8} className="sm:w-[10px]" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
             </div>
          </section>

          {/* ASIDE - SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6 text-left">
            
            {/* Brain Dump Journal (Fimi's Diary) */}
            <section className="bg-slate-900 dark:bg-slate-950 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden text-left border border-transparent dark:border-slate-800">
               <div className="relative z-10 text-left">
                  <div className="flex items-center gap-2 text-blue-400 font-black text-[9px] uppercase tracking-[0.2em] mb-5 text-left">
                     <BookOpen size={14} /> Fimi&apos;s Diary
                  </div>
                  <textarea 
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder={`Tell Fimi your story, ${userName}...`}
                    className="w-full h-28 sm:h-32 bg-white/5 border-2 border-white/5 rounded-2xl sm:rounded-3xl p-4 text-sm text-slate-100 placeholder:text-white/20 outline-none focus:border-blue-500 transition-all resize-none font-medium text-left"
                  />
                  <button 
                    onClick={handleReleaseJournal}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl sm:rounded-2xl text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-blue-900/40 text-left"
                  >
                    <Send size={14} /> Save to Fimi&apos;s Diary
                  </button>
               </div>
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            </section>

            {/* Breathing Room */}
            <section className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[32px] sm:rounded-[40px] border-2 border-white dark:border-slate-800 p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
               <div className="absolute top-6 left-8 flex items-center gap-2 text-teal-600 dark:text-teal-400 font-black text-[9px] uppercase tracking-widest text-left">
                 <Wind size={14} /> Breathing Room
               </div>
               <div className="relative mt-8 mx-auto flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center">
                 <motion.div 
                   className="absolute inset-0 rounded-full bg-teal-100/50 dark:bg-teal-900/30" 
                   animate={isBreathing ? { scale: breathePhase === "Inhale" ? 1.4 : breathePhase === "Exhale" ? 0.8 : 1.4 } : { scale: 1 }} 
                   transition={{ duration: 3, ease: "easeInOut" }} 
                 />
                 <div className="relative z-10 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-xl border border-teal-50 dark:border-slate-700">
                   <span className="text-[9px] sm:text-[10px] font-black text-teal-700 dark:text-teal-400 uppercase tracking-tighter">{isBreathing ? breathePhase : "Ready"}</span>
                 </div>
               </div>
               <button 
                 onClick={() => setIsBreathing(!isBreathing)} 
                 className={`mt-8 rounded-xl sm:rounded-2xl w-full py-4 text-[10px] font-black shadow-xl transition-all active:scale-95 uppercase tracking-widest ${
                   isBreathing 
                     ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-none" 
                     : "bg-teal-600 dark:bg-teal-700 text-white shadow-teal-900/10 dark:shadow-none"
                 }`}
               >
                 {isBreathing ? "Stop" : "Start"}
               </button>
            </section>

            {/* Rhythm Session */}
            <section className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[32px] sm:rounded-[40px] border-2 border-white dark:border-slate-800 p-6 sm:p-8 shadow-xl cursor-pointer group text-left" onClick={() => setIsGameModalOpen(true)}>
               <div className="flex items-center gap-3 mb-4 text-left">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 bg-blue-50 dark:bg-slate-800 text-blue-800 dark:text-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Zap size={20} /></div>
                  <h3 className="font-black text-slate-800 dark:text-white uppercase text-[9px] tracking-widest text-left">Rhythm Session</h3>
               </div>
               <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 leading-relaxed mb-5 text-left">Feeling overwhelmed? Let the melody guide your focus back to peace.</p>
               <button className="w-full bg-blue-800 dark:bg-blue-600 text-white py-4 rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 text-left">
                  <Play size={14} fill="currentColor" /> Play Game
               </button>
            </section>

          </aside>
        </div>
      </div>

      {/* FIMI MASKOT POPUP */}
      <AnimatePresence>
        {showFimi && (
          <div className="fixed inset-0 z-[250] flex items-end justify-end p-4 sm:p-8 pointer-events-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/20 dark:bg-slate-950/60 backdrop-blur-[2px] pointer-events-auto" onClick={() => setShowFimi(false)} />
            <motion.div 
              initial={{ y: 150, opacity: 0, scale: 0.8 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 100, opacity: 0 }} 
              className="relative z-[260] flex items-end gap-3 sm:gap-5 max-w-[calc(100%-2rem)] sm:max-w-sm w-full pointer-events-auto text-left text-left"
            >
              <div className="bg-white dark:bg-slate-800 p-5 sm:p-7 rounded-[28px] sm:rounded-[32px] rounded-br-sm shadow-3xl border-2 border-blue-200 dark:border-slate-700 relative flex-1 mb-6 sm:mb-10 text-left">
                <p className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold leading-relaxed text-left">{fimiDialogues[fimiStep]}</p>
                <button onClick={() => fimiStep < fimiDialogues.length - 1 ? setFimiStep(s => s + 1) : setShowFimi(false)} className="mt-5 w-full bg-blue-800 text-white font-black text-[10px] py-3.5 sm:py-4 rounded-xl uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 text-left">
                  {fimiStep < fimiDialogues.length - 1 ? "Next" : "Got it!"} <ChevronRightIcon size={14} />
                </button>
                <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white dark:bg-slate-800 border-b-2 border-r-2 border-blue-200 dark:border-slate-700 transform rotate-45" />
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 mb-6 sm:mb-10"><FimiMascotSVG isTalking={true} /></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RHYTHM GAME MODAL */}
      <AnimatePresence>
        {isGameModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-slate-950/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4">
            <button 
              onClick={() => { setIsGameModalOpen(false); setGameState("idle"); }} 
              className="absolute top-6 sm:top-10 right-6 sm:right-10 text-white p-3 sm:p-5 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-colors z-[350]"
            >
              <X />
            </button>
            
            {gameState === "idle" && (
              <div className="text-white text-center max-w-sm text-left">
                 <h2 className="text-3xl sm:text-4xl font-black italic mb-4 tracking-tighter text-left uppercase">RHYTHM PRO</h2>
                 <p className="text-slate-400 font-bold text-xs leading-relaxed mb-8 sm:mb-10 px-4 text-left">
                   Tap the black tiles to match the rhythm. Don&apos;t let them pass, and don&apos;t tap the white space!
                 </p>
                 <button onClick={startGame} className="bg-blue-600 hover:bg-blue-500 px-10 sm:px-12 py-4 sm:py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/40 transition-all active:scale-95">
                   Enter the Flow
                 </button>
              </div>
            )}

            {gameState === "playing" && (
              <div className="relative flex flex-col items-center w-full">
                <div className="text-blue-400 font-black text-5xl mb-8 drop-shadow-lg">{score}</div>
                <div 
                  className="relative w-full max-w-xs sm:max-w-sm h-[400px] sm:h-[500px] bg-white border-4 border-slate-800 overflow-hidden cursor-pointer rounded-lg shadow-2xl"
                  onPointerDown={() => setGameState("gameover")}
                >
                  <div className="absolute inset-0 flex pointer-events-none">
                    <div className="flex-1 border-r border-slate-200"></div>
                    <div className="flex-1 border-r border-slate-200"></div>
                    <div className="flex-1 border-r border-slate-200"></div>
                    <div className="flex-1"></div>
                  </div>
                  {tiles.map(tile => (
                    <div 
                      key={tile.id}
                      onPointerDown={(e) => { 
                        e.stopPropagation(); 
                        clickTile(tile.id); 
                      }}
                      className={`absolute w-1/4 h-[25%] transition-colors duration-[50ms] border border-white/10 ${tile.clicked ? "bg-slate-300/50" : "bg-slate-900 shadow-inner"}`}
                      style={{ left: `${tile.col * 25}%`, top: `${tile.y}%` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {gameState === "gameover" && (
              <div className="text-white text-center max-w-sm mt-8 text-left">
                 <h2 className="text-4xl sm:text-5xl font-black italic mb-2 tracking-tighter text-rose-500 uppercase text-left">GAME OVER</h2>
                 <p className="text-slate-300 font-bold text-lg leading-relaxed mb-8 sm:mb-10 px-4 text-left">
                   Final Score: <span className="text-white text-4xl font-black block mt-2 text-left">{score}</span>
                 </p>
                 <button onClick={startGame} className="bg-blue-600 hover:bg-blue-500 px-10 sm:px-12 py-4 sm:py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/40 transition-all active:scale-95 text-left">
                   Try Again
                 </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}