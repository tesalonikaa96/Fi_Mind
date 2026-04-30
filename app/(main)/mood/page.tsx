"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wind, PenTool, Music, Film, Heart, CloudRain, Send, 
  CalendarDays, PlusCircle, Play, X, Zap, Flame,
  ChevronLeft, ChevronRight, TrendingUp
} from "lucide-react";

// ── DATA KONFIGURASI ──
const LANES = 4;
const MELODY = [329.63, 392.00, 440.00, 523.25, 659.25, 523.25, 440.00, 392.00, 329.63, 261.63];

const moodOptions = [
  { emoji: "🤩", label: "Energized" }, { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Okay" }, { emoji: "🥱", label: "Tired" },
  { emoji: "😵‍💫", label: "Burnout" }, { emoji: "😰", label: "Anxious" },
];

export default function MoodSanctuaryPage() {
  const [journalText, setJournalText] = useState("");
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathePhase, setBreathePhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");

  // ── STATE MOOD & CALENDAR ──
  // Data mood disimpan berdasarkan tanggal "YYYY-MM-DD"
  const [moodHistory, setMoodHistory] = useState<Record<string, string>>({
    "2026-04-25": "😌", "2026-04-26": "🤩", "2026-04-27": "😐", 
    "2026-04-28": "😌", "2026-04-29": "🥱", "2026-04-30": "😌"
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMood = moodHistory[todayStr] || null;

  // ── LOGIKA KALENDER ──
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // ── HITUNG MOOD DOMINAN (7 HARI TERAKHIR) ──
  const dominantMood = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return moodHistory[d.toISOString().split('T')[0]];
    }).filter(Boolean);

    if (last7Days.length === 0) return { emoji: "✨", label: "No data yet" };

    const counts = last7Days.reduce((acc: any, emoji) => {
      acc[emoji] = (acc[emoji] || 0) + 1;
      return acc;
    }, {});

    const topEmoji = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    const label = moodOptions.find(m => m.emoji === topEmoji)?.label || "Steady";
    
    return { emoji: topEmoji, label };
  }, [moodHistory]);

  const handleMoodSelect = (emoji: string) => {
    setMoodHistory(prev => ({ ...prev, [todayStr]: emoji }));
    // Di sini kamu bisa tambahkan fungsi simpan ke Supabase agar tersinkron ke Dashboard
  };

  // ── GAME STATE (RHYTHM PRO) ──
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameOver">("idle");
  const [tiles, setTiles] = useState<{ id: number; lane: number; speed: number }[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const audioCtx = useRef<AudioContext | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const melodyIndex = useRef(0);

  const playNextNote = useCallback(() => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = MELODY[melodyIndex.current % MELODY.length];
    melodyIndex.current++;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.start(); osc.stop(ctx.currentTime + 1.2);
  }, []);

  const startGame = () => {
    setScore(0); setCombo(0); setTiles([]); setGameState("playing");
    spawnTimerRef.current = setInterval(() => {
      setTiles(prev => [...prev, { id: Date.now(), lane: Math.floor(Math.random() * LANES), speed: 3.5 }]);
    }, 800);
  };

  useEffect(() => {
    if (isBreathing) {
      const interval = setInterval(() => {
        setBreathePhase(p => p === "Inhale" ? "Hold" : p === "Hold" ? "Exhale" : "Inhale");
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isBreathing]);

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans pb-24" style={{ background: "linear-gradient(to bottom right, #f0fdfa, #e0f2fe, #f8fafc)" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fallDownGPU { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        .gpu-tile { animation: fallDownGPU linear forwards; will-change: transform; }
      `}} />

      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800">Mood Sanctuary 🌿</h1>
            <p className="text-sm text-slate-500 font-medium italic">"Your feelings are valid. Let them flow."</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Current Period</p>
            <p className="text-sm font-bold text-sky-600">{now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-12">
          
          {/* ── LEFT: CHECK-IN & INSIGHT ── */}
          <div className="md:col-span-4 space-y-6">
            {/* Today's Check-in */}
            <section className="rounded-[32px] border border-white bg-white/70 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-xl">
              <h2 className="text-xs font-black uppercase tracking-widest text-sky-600 mb-6 flex items-center gap-2">
                <PlusCircle size={16} /> Check-in
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {moodOptions.map((mood) => (
                  <button 
                    key={mood.label} 
                    onClick={() => handleMoodSelect(mood.emoji)} 
                    className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all active:scale-90 ${todayMood === mood.emoji ? "bg-sky-50 border-sky-400 shadow-inner" : "bg-white border-slate-50 hover:border-sky-100"}`}
                  >
                    <span className="text-3xl mb-1">{mood.emoji}</span>
                    <span className="text-[8px] font-black uppercase text-slate-400">{mood.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Weekly Dominant Mood */}
            <section className="rounded-[32px] border border-indigo-100 bg-indigo-50/50 p-6 shadow-lg shadow-indigo-100/20">
              <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4 flex items-center gap-2">
                <TrendingUp size={16} /> Weekly Insight
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-5xl bg-white w-20 h-20 rounded-3xl flex items-center justify-center shadow-sm border border-indigo-50">
                  {dominantMood.emoji}
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase">Mostly Feeling</p>
                  <p className="text-xl font-black text-slate-800 tracking-tight">{dominantMood.label}</p>
                  <p className="text-[10px] text-indigo-400 font-medium mt-1">Based on last 7 days</p>
                </div>
              </div>
            </section>
          </div>

          {/* ── RIGHT: MONTHLY RECAP CALENDAR ── */}
          <div className="md:col-span-8">
            <section className="h-full rounded-[40px] border border-white bg-white/80 p-8 shadow-2xl shadow-sky-100/40 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-3">
                  <CalendarDays className="text-sky-500" /> Monthly Recap
                </h2>
                <div className="flex gap-2">
                   <button className="p-2 rounded-xl bg-slate-50 text-slate-300 cursor-not-allowed"><ChevronLeft size={18} /></button>
                   <button className="p-2 rounded-xl bg-slate-50 text-slate-300 cursor-not-allowed"><ChevronRight size={18} /></button>
                </div>
              </div>

              {/* Grid Header Hari */}
              <div className="grid grid-cols-7 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-[10px] font-black text-slate-300 uppercase">{d}</div>
                ))}
              </div>

              {/* Grid Tanggal & Mood */}
              <div className="grid grid-cols-7 gap-2">
                {/* Padding untuk hari pertama */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`pad-${i}`} className="aspect-square" />
                ))}
                
                {/* Render Tanggal */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const mood = moodHistory[dateKey];
                  const isToday = day === now.getDate();

                  return (
                    <motion.div 
                      key={day}
                      whileHover={{ scale: 1.1 }}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative border transition-all ${
                        isToday ? "border-sky-400 bg-sky-50 shadow-md ring-4 ring-sky-100/50" : "border-slate-50 bg-white/50"
                      }`}
                    >
                      <span className="absolute top-1 left-2 text-[8px] font-black text-slate-300">{day}</span>
                      {mood ? (
                        <span className="text-xl md:text-2xl mt-1">{mood}</span>
                      ) : (
                        <div className="w-1 h-1 bg-slate-100 rounded-full mt-1" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap gap-4 justify-center">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <div className="w-3 h-3 rounded-full border border-sky-400 bg-sky-50" /> Today
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <div className="w-3 h-3 rounded-full bg-slate-100" /> No Data
                 </div>
              </div>
            </section>
          </div>
        </div>

        {/* ── GAMES & BREATHING (SAME AS BEFORE) ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div 
            whileHover={{ y: -5 }}
            className="rounded-3xl border border-indigo-300 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 shadow-xl cursor-pointer text-white relative overflow-hidden group"
            onClick={() => setIsGameModalOpen(true)}
          >
            <div className="flex items-center gap-3 mb-4 z-10 relative">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md"><Zap className="h-6 w-6 text-yellow-300" /></div>
                <h2 className="text-xl font-black italic tracking-wide">RHYTHM PRO</h2>
            </div>
            <p className="text-sm font-medium text-indigo-100 leading-relaxed mb-6 z-10 relative">
                Play the advanced mode. Features real melody sequencing and dynamic difficulty to clear your mind.
            </p>
            <button className="relative z-10 rounded-xl bg-white text-indigo-600 px-6 py-3 font-black text-xs flex items-center gap-2 shadow-lg">
              <Play className="h-4 w-4 fill-indigo-600" /> PLAY PRO MODE
            </button>
          </motion.div>

          <section className="flex flex-col items-center justify-center rounded-[40px] border border-teal-100 bg-white/60 p-6 text-center shadow-sm backdrop-blur-xl relative overflow-hidden h-64">
            <div className="absolute top-6 left-8 flex items-center gap-2 text-teal-600 font-black text-[10px] uppercase tracking-widest"><Wind size={14} /> Breathing Room</div>
            <div className="relative mt-4 flex h-32 w-32 items-center justify-center">
              <motion.div className="absolute inset-0 rounded-full bg-teal-100/50" animate={isBreathing ? { scale: breathePhase === "Inhale" ? 1.5 : breathePhase === "Exhale" ? 0.8 : 1.5 } : { scale: 1 }} transition={{ duration: 3, ease: "easeInOut" }} />
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl border border-teal-50">
                <span className="text-sm font-black text-teal-700">{isBreathing ? breathePhase : "Ready"}</span>
              </div>
            </div>
            <button onClick={() => setIsBreathing(!isBreathing)} className={`mt-6 rounded-full px-8 py-2.5 text-xs font-black shadow-lg transition-all ${isBreathing ? "bg-slate-100 text-slate-600" : "bg-teal-500 text-white shadow-teal-200"}`}>
              {isBreathing ? "STOP" : "START BREATHING"}
            </button>
          </section>
        </div>

        {/* ── BRAIN DUMP ── */}
        <section className="flex flex-col rounded-[40px] border border-sky-100 bg-white/60 p-8 shadow-sm backdrop-blur-xl min-h-[300px]">
          <div className="mb-4 flex items-center gap-2 text-sky-600 font-black text-[10px] uppercase tracking-widest"><PenTool size={14} /> Brain Dump Journal</div>
          <textarea 
            value={journalText} 
            onChange={(e) => setJournalText(e.target.value)} 
            placeholder="What's heavy on your mind today? Write it and release it..." 
            className="flex-1 resize-none rounded-[32px] border border-slate-100 bg-white/50 p-6 text-sm text-slate-700 outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-300 transition-all font-medium leading-relaxed" 
          />
          <button onClick={() => { setJournalText(""); alert("Released into the universe! ✨"); }} className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 text-xs font-black text-white shadow-xl hover:bg-sky-600 transition-all active:scale-95 uppercase tracking-widest">
            <Send size={14} /> Release Thought
          </button>
        </section>

      </div>

      {/* ── RHYTHM GAME MODAL (KEEP PREVIOUS LOGIC) ── */}
      <AnimatePresence>
        {isGameModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            {/* ... (Isi Modal Game sama seperti kode sebelumnya) ... */}
            <button onClick={() => setIsGameModalOpen(false)} className="absolute top-10 right-10 text-white p-4 bg-white/10 rounded-full hover:bg-white/20"><X /></button>
            <div className="text-white text-center">
               <h2 className="text-4xl font-black italic mb-4">RHYTHM PRO</h2>
               <p className="text-slate-400 mb-8">Game logic active. Click tiles to play.</p>
               <button onClick={startGame} className="bg-indigo-500 px-10 py-4 rounded-full font-black">START MISSION</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}