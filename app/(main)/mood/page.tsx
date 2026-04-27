"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wind, PenTool, Music, Film, Heart, CloudRain, Send, 
  CalendarDays, PlusCircle, Play, X, Zap, Flame 
} from "lucide-react";

const LANES = 4;
const MELODY = [
  329.63, 392.00, 440.00, 523.25, 659.25,
  523.25, 440.00, 392.00, 329.63, 261.63,
  261.63, 329.63, 392.00, 523.25, 392.00
];

const moodOptions = [
  { emoji: "🤩", label: "Energized" }, { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Okay" }, { emoji: "🥱", label: "Tired" },
  { emoji: "😵‍💫", label: "Burnout" }, { emoji: "😰", label: "Anxious" },
];

export default function MoodSanctuaryPage() {
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [journalText, setJournalText] = useState("");
  const [isReleased, setIsReleased] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathePhase, setBreathePhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");

  // ── STATE RHYTHM PRO GAME (SUPER SMOOTH VERSION) ──
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameOver">("idle");
  const [tiles, setTiles] = useState<{ id: number; lane: number; speed: number }[]>([]);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  
  const audioCtx = useRef<AudioContext | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const melodyIndex = useRef(0);
  const currentSpeed = useRef(3.5); // Durasi animasi jatuh dalam detik
  const spawnRate = useRef(800); 

  const pastMoods = ["🤩", "😌", "😐", "🥱", "😵‍💫", "😰", "😌", "😌", "🤩", "😐", "😌", "🥱", "😌", "🤩"];

  // ── FUNGSI AUDIO ──
  const playNextNote = useCallback(() => {
    if (typeof window === "undefined") return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx.current) audioCtx.current = new AudioContext();
    
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const freq = MELODY[melodyIndex.current % MELODY.length];
    melodyIndex.current++; 

    osc.frequency.value = freq;
    osc.type = "sine"; 

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02); 
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  }, []);

  const spawnParticles = (lane: number) => {
    const laneWidth = window.innerWidth > 768 ? 600 / 4 : (window.innerWidth - 64) / 4; 
    const startX = (lane * laneWidth) + (laneWidth / 2);
    
    const newParticles = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      x: startX + (Math.random() * 40 - 20),
      y: window.innerHeight > 800 ? 500 : window.innerHeight - 300,
      color: ["bg-sky-300", "bg-white", "bg-indigo-300"][Math.floor(Math.random() * 3)]
    }));

    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 600);
  };

  // ── GAME LOGIC (GPU ACCELERATED) ──
  const startGame = () => {
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    setScore(0);
    setCombo(0);
    setTiles([]);
    setParticles([]);
    melodyIndex.current = 0;
    currentSpeed.current = 3.5; 
    spawnRate.current = 800; 
    setGameState("playing");

    spawnTimerRef.current = setInterval(() => {
      setTiles((prev) => [...prev, { id: Date.now(), lane: Math.floor(Math.random() * LANES), speed: currentSpeed.current }]);
    }, spawnRate.current);
  };

  // Dipanggil otomatis oleh browser saat animasi CSS selesai (Ubin sampai bawah)
  const handleTileMiss = useCallback(() => {
    setGameState(prev => {
        if (prev === "playing") {
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
            return "gameOver";
        }
        return prev;
    });
  }, []);

  const handleTileTap = (id: number, lane: number) => {
    if (gameState !== "playing") return;
    
    playNextNote();
    spawnParticles(lane);
    
    setCombo(prev => {
      const newCombo = prev + 1;
      const points = newCombo > 10 ? 30 : newCombo > 5 ? 20 : 10;
      setScore(s => s + points);
      
      // Tambah kecepatan pelan-pelan
      if (newCombo % 15 === 0 && currentSpeed.current > 1.5) {
        currentSpeed.current -= 0.2;
      }
      return newCombo;
    });

    // Hapus ubin dari layar agar animasi CSS terpotong dan tidak memicu Game Over
    setTiles((prev) => prev.filter(tile => tile.id !== id));
  };

  useEffect(() => {
    if (!isGameModalOpen) { 
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      setGameState("idle"); 
    }
  }, [isGameModalOpen]);

  // Efek Breathing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathePhase((prev) => prev === "Inhale" ? "Hold" : prev === "Hold" ? "Exhale" : "Inhale");
      }, 3000); 
    } else {
      setBreathePhase("Inhale");
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans pb-24 selection:bg-teal-200" style={{ background: "linear-gradient(to bottom right, #f0fdfa 0%, #e0f2fe 50%, #f8fafc 100%)" }}>
      
      {/* ── CSS SUPER SMOOTH ANIMATION INJECTION ── */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fallDownGPU {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .gpu-tile {
          animation-name: fallDownGPU;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          will-change: transform;
        }
      `}} />

      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">Mood Sanctuary 🌿</h1>
          <p className="mt-1 text-sm text-slate-600 font-medium">Breathe, release your thoughts, and track your peace.</p>
        </header>

        <section className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl grid gap-6 md:grid-cols-3 md:divide-x divide-slate-100">
          <div className="md:pr-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 text-sky-600"><PlusCircle className="h-5 w-5" /> Today's Check-in</h2>
            <div className="grid grid-cols-3 gap-2">
              {moodOptions.map((mood) => (
                <button key={mood.label} onClick={() => setTodayMood(mood.emoji)} className={`flex flex-col items-center justify-center rounded-xl border p-2 transition-all ${todayMood === mood.emoji ? "bg-sky-100 border-sky-300 scale-105 shadow-sm" : "bg-white border-slate-100"}`}>
                  <span className="text-2xl">{mood.emoji}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 md:pl-6 flex flex-col justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 text-sky-600 mb-4"><CalendarDays className="h-5 w-5" /> Recent Journey</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="h-10 w-10 shrink-0 rounded-lg bg-white/50 border border-slate-100 flex items-center justify-center text-lg shadow-sm">
                  {i === 13 ? (todayMood || "") : (pastMoods[i % pastMoods.length])}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col rounded-3xl border border-indigo-300 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 shadow-xl cursor-pointer hover:scale-[1.02] transition-transform text-white group relative overflow-hidden"
            onClick={() => setIsGameModalOpen(true)}
          >
            <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-colors" />
            <div className="flex items-center gap-3 mb-4 z-10">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md"><Zap className="h-6 w-6 text-yellow-300" /></div>
                <h2 className="text-xl font-black italic tracking-wide">RHYTHM PRO</h2>
            </div>
            <p className="text-sm font-medium text-indigo-100 leading-relaxed mb-6 z-10">
                Play the advanced mode. Features real melody sequencing, combo multipliers, particle effects, and dynamic difficulty.
            </p>
            <div className="mt-auto flex gap-3 z-10">
              <button className="rounded-xl bg-white text-indigo-600 px-6 py-3 font-black text-xs flex items-center gap-2 shadow-lg hover:bg-slate-50 transition-all active:scale-95">
                <Play className="h-4 w-4 fill-indigo-600" /> PLAY PRO MODE
              </button>
            </div>
          </motion.div>

          <motion.section 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-teal-100 bg-white/60 p-6 text-center shadow-sm backdrop-blur-xl relative overflow-hidden h-64"
          >
            <div className="absolute top-4 left-5 flex items-center gap-2 text-teal-600"><Wind className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-widest">Breathing Room</span></div>
            <div className="relative mt-4 flex h-32 w-32 items-center justify-center">
              <motion.div className="absolute inset-0 rounded-full bg-teal-100/50" animate={isBreathing ? { scale: breathePhase === "Inhale" ? 1.4 : breathePhase === "Exhale" ? 0.8 : 1.4 } : { scale: 1 }} transition={{ duration: 3, ease: "easeInOut" }} />
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md border border-teal-50">
                <span className="text-sm font-bold text-teal-700">{isBreathing ? breathePhase : "Ready"}</span>
              </div>
            </div>
            <button onClick={() => setIsBreathing(!isBreathing)} className={`mt-6 rounded-full px-6 py-2 text-xs font-bold shadow-sm transition-all active:scale-95 ${isBreathing ? "bg-slate-100 text-slate-600" : "bg-teal-500 text-white"}`}>
              {isBreathing ? "Stop" : "Start Breathing"}
            </button>
          </motion.section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
           <motion.section className="flex flex-col rounded-3xl border border-sky-100 bg-white/60 p-6 shadow-sm backdrop-blur-xl h-64">
            <div className="mb-2 flex items-center gap-2 text-sky-600"><PenTool className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-widest">Brain Dump</span></div>
            <textarea value={journalText} onChange={(e) => setJournalText(e.target.value)} placeholder="Type whatever is heavy..." className="flex-1 mt-2 resize-none rounded-xl border border-slate-200 bg-white/50 p-4 text-sm text-slate-700 outline-none focus:border-sky-300" />
            <button onClick={() => { setIsReleased(true); setTimeout(() => { setJournalText(""); setIsReleased(false); }, 1500); }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-900 active:scale-95">
              <Send className="h-3 w-3" /> Release
            </button>
          </motion.section>
          
          <motion.section className="rounded-3xl border border-pink-100 bg-pink-50/30 p-6 shadow-sm backdrop-blur-xl h-64 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-pink-600 mb-2"><Heart className="h-5 w-5" /><h2 className="text-base font-bold text-slate-800">The Escape Kit</h2></div>
            <div className="space-y-3">
              {[ { icon: Music, text: "Vocal Release", color: "pink" }, { icon: Film, text: "Western Cinema", color: "indigo" }, { icon: CloudRain, text: "Nature & Lo-Fi", color: "emerald" } ].map((item, i) => (
                <div key={i} className="flex cursor-pointer items-center gap-4 rounded-xl border border-white bg-white p-3 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-${item.color}-100 text-${item.color}-500`}><item.icon className="h-5 w-5" /></div>
                  <h3 className="font-bold text-sm text-slate-800">{item.text}</h3>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      <AnimatePresence>
        {isGameModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-[600px] aspect-[9/16] md:aspect-[3/4] bg-slate-900 rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden flex flex-col border border-white/10"
            >
              <div className="flex items-center justify-between text-white z-10 mb-4">
                <div>
                   <h2 className="text-xl font-black italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">RHYTHM PRO</h2>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Melodic Sequencing</p>
                </div>
                <button onClick={() => setIsGameModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"><X className="h-5 w-5" /></button>
              </div>

              <div className="flex justify-between items-end z-10 mb-4 px-2">
                 <div>
                    <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">Score</div>
                    <div className="font-black text-4xl leading-none text-white">{score}</div>
                 </div>
                 {combo > 2 && (
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={combo} className="flex flex-col items-end">
                       <div className="flex items-center gap-1 text-orange-400 font-black italic text-xl">
                          {combo > 10 && <Flame className="h-5 w-5 animate-pulse" />} 
                          {combo}x COMBO!
                       </div>
                       {combo > 10 && <div className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold mt-1 animate-bounce">FEVER MODE</div>}
                    </motion.div>
                 )}
              </div>

              <div className="flex-1 rounded-2xl border-2 border-white/5 bg-slate-950 relative overflow-hidden flex divide-x divide-white/5 cursor-crosshair">
                {Array.from({ length: LANES }).map((_, i) => (<div key={i} className="flex-1 relative pointer-events-none" />))}

                {/* SUPER SMOOTH GPU TILES */}
                {tiles.map((tile) => (
                  <div
                    key={tile.id}
                    onPointerDown={(e) => {
                      e.stopPropagation(); // Mencegah klik tembus
                      handleTileTap(tile.id, tile.lane);
                    }} 
                    className={`gpu-tile absolute top-0 w-full rounded-md shadow-lg cursor-pointer ${combo > 10 ? 'bg-gradient-to-b from-orange-400 to-rose-500 shadow-orange-500/50' : 'bg-gradient-to-b from-sky-300 to-indigo-400 shadow-sky-400/50'}`}
                    style={{ 
                      left: `calc(${(100 / LANES) * tile.lane}% + 4px)`, 
                      width: `calc(${100 / LANES}% - 8px)`, 
                      height: `22%`,
                      animationDuration: `${tile.speed}s` 
                    }}
                    onAnimationEnd={handleTileMiss} // NATIVE BROWSER EVENT! (Sangat Akurat)
                  />
                ))}

                {/* Partikel Efek Ledakan */}
                {particles.map(p => (
                   <motion.div 
                      key={p.id}
                      className={`absolute w-4 h-4 rounded-full ${p.color} shadow-[0_0_15px_rgba(255,255,255,1)] pointer-events-none z-50`}
                      initial={{ left: p.x, top: p.y, scale: 1, opacity: 1 }}
                      animate={{ top: p.y - (Math.random() * 150), left: p.x + (Math.random() * 150 - 75), scale: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                   />
                ))}

                <div className="absolute bottom-4 inset-x-0 h-[2px] bg-white/20 pointer-events-none" />
                
                {(gameState === "idle" || gameState === "gameOver") && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-slate-950/90 backdrop-blur-sm text-center">
                        {gameState === "idle" && (
                            <>
                                <Zap className="h-16 w-16 text-indigo-400 mb-4" />
                                <h3 className="text-2xl font-black text-white">READY TO FOCUS?</h3>
                                <p className="text-slate-400 text-xs mt-2 mb-8 max-w-xs leading-relaxed">Tap tiles to play the melody. Build combos to activate fever mode.</p>
                                <button onClick={startGame} className="px-12 py-4 rounded-full bg-indigo-500 text-white font-black text-sm flex items-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:bg-indigo-400 active:scale-95 transition-all">
                                    <Play className="h-5 w-5 fill-white" /> START
                                </button>
                            </>
                        )}
                        {gameState === "gameOver" && (
                            <>
                                <h3 className="text-3xl font-black text-rose-500 mb-2">MISSED!</h3>
                                <p className="text-slate-300 text-sm mb-1">Final Score: <strong className="text-2xl text-white block mt-2">{score}</strong></p>
                                <p className="text-orange-400 text-xs font-bold mb-8">Max Combo: {combo}x</p>
                                <div className="flex gap-3">
                                    <button onClick={startGame} className="px-8 py-3 rounded-full bg-white text-slate-900 font-bold text-xs flex items-center gap-2 hover:bg-slate-200 transition-all active:scale-95">
                                        <Play className="h-4 w-4 fill-slate-900" /> RETRY
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}