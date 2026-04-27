"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wind, PenTool, Music, Film, CloudRain, Send, 
  CalendarDays, BarChart2, PlusCircle, Play, X 
} from "lucide-react";

// ── NADA PENTATONIK (Memberikan efek sangat menenangkan) ──
const PENTATONIC_FREQUENCIES = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
];

const moodOptions = [
  { emoji: "🤩", label: "Energized" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Okay" },
  { emoji: "🥱", label: "Tired" },
  { emoji: "😵‍💫", label: "Burnout" },
  { emoji: "😰", label: "Anxious" },
];

export default function MoodSanctuaryPage() {
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [journalText, setJournalText] = useState("");
  const [isReleased, setIsReleased] = useState(false);
  
  // State untuk Breathing
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathePhase, setBreathePhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");

  // State untuk Zen Game Pop-up
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const pastMoods = [
    "🤩", "😌", "😐", "🥱", "😵‍💫", "😰", "😌",
    "😌", "🤩", "😐", "😌", "🥱", "😌", "🤩",
    "😐", "😌", "🤩", "🥱", "😰", "😌" 
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathePhase((prev) => {
          if (prev === "Inhale") return "Hold";
          if (prev === "Hold") return "Exhale";
          return "Inhale";
        });
      }, 3000); 
    } else {
      setBreathePhase("Inhale");
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  const handleRelease = () => {
    if (!journalText.trim()) return;
    setIsReleased(true);
    setTimeout(() => {
      setJournalText("");
      setIsReleased(false);
    }, 2000);
  };

  // ── FUNGSI WEB AUDIO API UNTUK GAME ──
  const playChime = useCallback((yPosition: number, windowHeight: number) => {
    if (typeof window === "undefined") return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    
    // Menentukan nada berdasarkan posisi Y (makin atas makin tinggi)
    const index = Math.floor((1 - (yPosition / windowHeight)) * PENTATONIC_FREQUENCIES.length);
    const safeIndex = Math.max(0, Math.min(index, PENTATONIC_FREQUENCIES.length - 1));
    osc.frequency.value = PENTATONIC_FREQUENCIES[safeIndex];

    // Efek Fade In & Fade Out yang sangat halus (seperti suara lonceng)
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);

    osc.start();
    osc.stop(ctx.currentTime + 3);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Mainkan suara
    playChime(y, window.innerHeight);

    // Warna acak pastel untuk visual
    const colors = ["border-sky-300", "border-pink-300", "border-teal-300", "border-indigo-300", "border-yellow-300"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newRipple = { id: Date.now(), x, y, color: randomColor };
    setRipples((prev) => [...prev, newRipple]);

    // Hapus ripple setelah animasi selesai
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 2000);
  };

  return (
    <div 
      className="min-h-screen p-4 md:p-8 font-sans pb-24 selection:bg-teal-200"
      style={{ background: "linear-gradient(to bottom right, #f0fdfa 0%, #e0f2fe 50%, #f8fafc 100%)" }}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            Mood Sanctuary 🌿
          </h1>
          <p className="mt-1 text-sm text-slate-600 font-medium">
            Breathe, release your thoughts, and track your peace.
          </p>
        </motion.div>

        {/* ── MOOD CALENDAR & TODAY'S CHECK-IN ── */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
          className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl"
        >
          <div className="grid gap-6 md:grid-cols-3 md:divide-x divide-slate-100">
            <div className="md:pr-6 space-y-4">
              <div className="flex items-center gap-2 text-sky-600">
                <PlusCircle className="h-5 w-5" />
                <h2 className="text-base font-bold text-slate-800">How are you today?</h2>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => setTodayMood(mood.emoji)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2 transition-all hover:bg-sky-50 ${todayMood === mood.emoji ? "bg-sky-100 border-sky-300 scale-105 shadow-sm" : "bg-white border-slate-100"}`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 md:pl-6 space-y-4">
              <div className="flex items-center gap-2 text-sky-600">
                <CalendarDays className="h-5 w-5" />
                <h2 className="text-base font-bold text-slate-800">Recent Journey</h2>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div key={i} className="text-center text-[10px] font-bold text-slate-400">{day}</div>
                ))}
                {pastMoods.slice(-14).map((mood, index) => (
                  <div key={index} className="flex aspect-square items-center justify-center rounded-lg border border-slate-100 bg-white/50 text-xl shadow-sm">
                    {mood}
                  </div>
                ))}
                <div className={`flex aspect-square items-center justify-center rounded-lg border-2 border-dashed ${todayMood ? "border-sky-300 bg-sky-50 text-xl" : "border-slate-300 bg-slate-50"}`}>
                  {todayMood || ""}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── GRID TENGAH: BREATHING & ADVANCED ZEN GAME ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* ZONA 1: BREATHING ROOM */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-teal-100 bg-white/60 p-6 text-center shadow-sm backdrop-blur-xl relative overflow-hidden h-56"
          >
            <div className="absolute top-4 left-5 flex items-center gap-2 text-teal-600">
              <Wind className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">Breathing Room</span>
            </div>

            <div className="relative mt-4 flex h-32 w-32 items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full bg-teal-100/50"
                animate={isBreathing ? { scale: breathePhase === "Inhale" ? 1.4 : breathePhase === "Exhale" ? 0.8 : 1.4 } : { scale: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md border-2 border-teal-50">
                <span className="text-sm font-bold text-teal-700">{isBreathing ? breathePhase : "Ready"}</span>
              </div>
            </div>
            <button 
              onClick={() => setIsBreathing(!isBreathing)}
              className={`mt-4 rounded-full px-6 py-2 text-xs font-bold shadow-sm transition-all active:scale-95 ${isBreathing ? "bg-slate-100 text-slate-600" : "bg-teal-500 text-white hover:bg-teal-600"}`}
            >
              {isBreathing ? "Stop" : "Start"}
            </button>
          </motion.section>

          {/* ZONA 2: ADVANCED ZEN GAME BUTTON */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-sm backdrop-blur-xl h-56 relative overflow-hidden group cursor-pointer hover:shadow-md transition-all"
            onClick={() => setIsGameOpen(true)}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-200/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300 mb-4 z-10">
              <Play className="h-6 w-6 ml-1" />
            </div>
            <h3 className="text-lg font-bold text-indigo-900 z-10">Musical Canvas</h3>
            <p className="text-xs text-indigo-600 font-medium mt-1 z-10">Immersive Audio Experience</p>
          </motion.section>
        </div>

        {/* ── GRID BAWAH: BRAIN DUMP & ESCAPE KIT ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ZONA 3: BRAIN DUMP */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col rounded-3xl border border-sky-100 bg-white/60 p-6 shadow-sm backdrop-blur-xl h-56"
          >
            <div className="mb-2 flex items-center gap-2 text-sky-600">
              <PenTool className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">Brain Dump</span>
            </div>
            <div className="relative flex-1 mt-2">
              <AnimatePresence>
                {isReleased && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/90 text-sky-500 font-bold text-sm">
                    Letting go...
                  </motion.div>
                )}
              </AnimatePresence>
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Type what's heavy on your mind..."
                className="h-full w-full resize-none rounded-xl border border-slate-200 bg-white/50 p-4 text-sm text-slate-700 outline-none focus:border-sky-300"
              />
            </div>
            <button 
              onClick={handleRelease} disabled={!journalText.trim() || isReleased}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-900 active:scale-95 disabled:opacity-50"
            >
              <Send className="h-3 w-3" /> Release
            </button>
          </motion.section>

          {/* ZONA 4: THE ESCAPE KIT */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-3xl border border-pink-100 bg-pink-50/30 p-6 shadow-sm backdrop-blur-xl h-56 flex flex-col justify-between"
          >
            <div className="mb-2 flex items-center gap-2 text-pink-600">
              <Heart className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">The Escape Kit</span>
            </div>

            <div className="grid gap-3">
              <div className="group flex cursor-pointer items-center gap-4 rounded-xl border border-white bg-white p-2.5 shadow-sm hover:-translate-y-0.5 transition-all">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-500">
                  <Music className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-800">Vocal Release (Singing)</h3>
              </div>
              <div className="group flex cursor-pointer items-center gap-4 rounded-xl border border-white bg-white p-2.5 shadow-sm hover:-translate-y-0.5 transition-all">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-500">
                  <Film className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-800">Western Cinema</h3>
              </div>
              <div className="group flex cursor-pointer items-center gap-4 rounded-xl border border-white bg-white p-2.5 shadow-sm hover:-translate-y-0.5 transition-all">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-500">
                  <CloudRain className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-800">Lo-Fi & Nature Sounds</h3>
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* ── ZEN GAME FULLSCREEN MODAL ── */}
      <AnimatePresence>
        {isGameOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center overflow-hidden cursor-crosshair"
            onClick={handleCanvasClick}
          >
            {/* Tombol Tutup Game */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsGameOpen(false); }}
              className="absolute top-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-md"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Tulisan Panduan */}
            <div className="absolute top-12 inset-x-0 text-center pointer-events-none">
              <h2 className="text-2xl font-light text-white/50 tracking-widest">Musical Canvas</h2>
              <p className="text-sm text-white/30 mt-2">Tap anywhere. Higher = Higher pitch.</p>
            </div>

            {/* Render Gelombang Cahaya */}
            <AnimatePresence>
              {ripples.map((ripple) => (
                <motion.div
                  key={ripple.id}
                  initial={{ opacity: 0.8, scale: 0, borderWidth: "8px" }}
                  animate={{ opacity: 0, scale: 5, borderWidth: "0px" }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className={`absolute rounded-full border-solid ${ripple.color}`}
                  style={{ 
                    left: ripple.x - 50, 
                    top: ripple.y - 50, 
                    width: 100, 
                    height: 100 
                  }}
                />
              ))}
            </AnimatePresence>

            {/* Efek Bintang Latar Belakang */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}