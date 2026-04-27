"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Quote, ArrowRight, ListTodo, CheckCircle, 
  Loader2, Coffee, CheckSquare, GraduationCap, RefreshCw
} from "lucide-react";
import { supabase } from "@/lib/supabase"; 
import Link from "next/link";

// ── DATA KONFIGURASI ──
const moodOptions = [
  { emoji: "🤩", label: "Energized", color: "bg-yellow-100 text-yellow-600 border-yellow-200" },
  { emoji: "😌", label: "Calm", color: "bg-sky-100 text-sky-600 border-sky-200" },
  { emoji: "😐", label: "Okay", color: "bg-slate-100 text-slate-600 border-slate-200" },
  { emoji: "🥱", label: "Tired", color: "bg-indigo-100 text-indigo-500 border-indigo-200" },
  { emoji: "😵‍💫", label: "Burnout", color: "bg-orange-100 text-orange-500 border-orange-200" },
  { emoji: "😰", label: "Anxious", color: "bg-teal-100 text-teal-600 border-teal-200" },
];

const introEmojis = ["🤩", "😌", "😐", "🥱", "😵‍💫", "😰"];

const dailyQuotes = [
  { text: "We read to know we are not alone.", author: "C.S. Lewis" },
  { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
  { text: "Words can be like X-rays if you use them properly—they'll go through anything.", author: "Aldous Huxley" },
  { text: "I can shake off everything as I write; my sorrows disappear, my courage is reborn.", author: "Anne Frank" },
];

export default function DashboardPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [currentEmojiIdx, setCurrentEmojiIdx] = useState(0);
  const [randomQuote, setRandomQuote] = useState(dailyQuotes[0]);
  
  // ── STATE UNTUK CLASSROOM ──
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [userName, setUserName] = useState("Tesalonika");

  // ── 1. OTOMATIS AMBIL TUGAS SAAT MOUNT ──
  useEffect(() => {
    const initDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Ambil nama user dari profil Google
      if (session?.user?.user_metadata?.full_name) {
        setUserName(session.user.user_metadata.full_name.split(' ')[0]);
      }

      if (session?.provider_token) {
        fetchClassroomTasks(session.provider_token);
      } else {
        setIsLoadingTasks(false);
      }
    };
    initDashboard();
  }, []);

  const fetchClassroomTasks = async (token: string) => {
    setIsLoadingTasks(true);
    try {
      const courseRes = await fetch("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const courseData = await courseRes.json();

      if (courseData.courses) {
        const allTasks: any[] = [];
        // Ambil dari 3 kelas teratas untuk performa cepat
        for (const course of courseData.courses.slice(0, 3)) {
          const taskRes = await fetch(`https://classroom.googleapis.com/v1/courses/${course.id}/courseWork`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const taskData = await taskRes.json();
          if (taskData.courseWork) {
            taskData.courseWork.forEach((t: any) => allTasks.push({ 
              id: t.id, 
              title: t.title, 
              courseName: course.name,
              link: t.alternateLink 
            }));
          }
        }
        setTasks(allTasks.slice(0, 4)); 
      }
    } catch (err) {
      console.error("Gagal sinkronisasi Classroom:", err);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  useEffect(() => {
    setRandomQuote(dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]);
    const emojiInterval = setInterval(() => setCurrentEmojiIdx((prev) => (prev + 1) % introEmojis.length), 800);
    const introTimeout = setTimeout(() => setShowIntro(false), 4000); 
    return () => { clearInterval(emojiInterval); clearTimeout(introTimeout); };
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-6 text-center backdrop-blur-3xl">
            <motion.span key={currentEmojiIdx} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-[120px]">{introEmojis[currentEmojiIdx]}</motion.span>
            <h2 className="mt-8 text-3xl font-black text-slate-800 tracking-tighter">Setting up your sanctuary...</h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen p-6 md:p-10 pb-24 bg-[#F0F9FF]">
        <div className="mx-auto max-w-3xl space-y-8">
          
          {/* HEADER */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">
              Welcome back, {userName}. 🌙
            </h1>
            <p className="mt-2 text-slate-600 font-medium">
              Everything is synced. You&apos;re in control now.
            </p>
          </motion.div>

          {/* MOOD CHECK-IN */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[40px] border border-white bg-white/70 p-8 shadow-xl shadow-sky-100/50 backdrop-blur-xl">
            <h2 className="mb-8 flex items-center gap-2 font-bold text-slate-800 text-lg uppercase tracking-widest text-[11px]">
              <Sparkles className="h-4 w-4 text-sky-500" />
              How are you feeling right now?
            </h2>
            <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
              {moodOptions.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={`flex flex-col items-center justify-center gap-3 rounded-[30px] border py-6 transition-all active:scale-95 ${selectedMood === mood.label ? mood.color + " border-sky-400 shadow-lg scale-105" : "bg-white border-slate-50 hover:border-sky-100"}`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-[10px] font-black uppercase">{mood.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {selectedMood && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-8 pt-8 border-t border-slate-100">
                  <div className="flex gap-3">
                    <div className="bg-sky-50 p-4 rounded-3xl flex-1">
                      <p className="text-xs font-bold text-sky-600 mb-1 uppercase tracking-wider">Quick Recommendation</p>
                      <p className="text-sm text-slate-700 font-medium">You seem {selectedMood}. Try a 25-min focus session with a lo-fi beat.</p>
                    </div>
                    <button className="bg-slate-900 text-white px-6 rounded-3xl text-sm font-bold hover:bg-sky-600 transition-colors">Start</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── CLASSROOM OVERVIEW (REPLACED LOGIN BUTTON) ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="rounded-[40px] bg-white p-8 shadow-xl shadow-sky-100/50 border border-white overflow-hidden relative">
              {/* Sync Badge */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 uppercase tracking-tighter">Classroom Synced</h3>
                    <p className="text-[10px] font-bold text-slate-400">Live updates from Google</p>
                  </div>
                </div>
                <button onClick={() => window.location.reload()} className="text-slate-300 hover:text-sky-500 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              {/* Assignments List */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pending Tasks</h4>
                {isLoadingTasks ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
                  </div>
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <motion.div key={task.id} whileHover={{ x: 5 }} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[24px] border border-slate-50 group hover:border-sky-100 hover:bg-white transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-sky-600 uppercase mb-0.5">{task.courseName}</p>
                        <h5 className="font-bold text-slate-800 text-sm truncate pr-4">{task.title}</h5>
                      </div>
                      <a href={task.link} target="_blank" className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover:text-sky-500 group-hover:border-sky-100 transition-all">
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-slate-400 text-sm font-medium italic">No assignments found. Enjoy your peace! ✨</p>
                  </div>
                )}
              </div>

<Link href="/tasks" className="mt-8 block w-full text-center py-4 bg-slate-900 rounded-[24px] text-white text-xs font-black uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg shadow-slate-200">
  Go to Focus Flow
</Link>
            </div>
          </motion.div>

          {/* RANDOM QUOTES */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center p-8">
            <Quote className="mb-6 h-8 w-8 text-sky-300 opacity-50" />
            <p className="text-xl italic text-slate-700 leading-relaxed font-serif px-4">
              &quot;{randomQuote.text}&quot;
            </p>
            <p className="mt-6 text-[10px] font-black text-sky-500 uppercase tracking-[0.3em]">
              — {randomQuote.author}
            </p>
          </motion.div>

        </div>
      </div>
    </>
  );
}