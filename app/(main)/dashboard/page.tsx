"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Quote, ArrowRight, ListTodo, CheckCircle, 
  Loader2, RefreshCw
} from "lucide-react";
import { supabase } from "@/lib/supabase"; 
import Link from "next/link";

// ── DATA KONFIGURASI ──
const moodOptions = [
  { emoji: "🤩", label: "Energized", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/50" },
  { emoji: "😌", label: "Calm", color: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-700/50" },
  { emoji: "😐", label: "Okay", color: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
  { emoji: "🥱", label: "Tired", color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 border-indigo-200 dark:border-indigo-700/50" },
  { emoji: "😵‍💫", label: "Burnout", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 border-orange-200 dark:border-orange-700/50" },
  { emoji: "😰", label: "Anxious", color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-700/50" },
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
  const [showIntro, setShowIntro] = useState(false); // Default false
  const [currentEmojiIdx, setCurrentEmojiIdx] = useState(0);
  const [randomQuote, setRandomQuote] = useState(dailyQuotes[0]);
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [userName, setUserName] = useState("Tesalonika");

  useEffect(() => {
    // ── LOGIKA INTRO 3 DETIK (HANYA SEKALI PER LOGIN) ──
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    
    if (!hasSeenIntro) {
      setShowIntro(true);
      const emojiInterval = setInterval(() => {
        setCurrentEmojiIdx((prev) => (prev + 1) % introEmojis.length);
      }, 500); // Ganti emoji lebih cepat agar dramatis
      
      const introTimeout = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("hasSeenIntro", "true"); // Tandai sudah lihat
      }, 3000); // ── DURASI 3 DETIK ──

      return () => {
        clearInterval(emojiInterval);
        clearTimeout(introTimeout);
      };
    }
  }, []);

  useEffect(() => {
    const initDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
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
    setRandomQuote(dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]);
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

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }} 
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white dark:bg-slate-900 px-6 text-center transition-colors duration-500"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-sky-400/20 blur-3xl rounded-full" />
              <motion.span key={currentEmojiIdx} className="relative text-[120px] block">
                {introEmojis[currentEmojiIdx]}
              </motion.span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-3xl font-black text-slate-800 dark:text-white tracking-tighter"
            >
              Protect your <span className="text-sky-500">peace.</span>
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen p-6 md:p-10 pb-24 bg-[#F0F9FF] dark:bg-slate-900 transition-colors duration-500">
        <div className="mx-auto max-w-3xl space-y-8">
          
          {/* HEADER */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight transition-colors">
              Welcome back, {userName}. 🌙
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium transition-colors">
              Everything is synced. You&apos;re in control now.
            </p>
          </motion.div>

          {/* MOOD CHECK-IN */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[40px] border border-white dark:border-slate-800 bg-white/70 dark:bg-slate-800/70 p-8 shadow-xl shadow-sky-100/50 dark:shadow-none backdrop-blur-xl transition-all duration-500">
            <h2 className="mb-8 flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-lg uppercase tracking-widest text-[11px] transition-colors">
              <Sparkles className="h-4 w-4 text-sky-500" />
              How are you feeling right now?
            </h2>
            <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
              {moodOptions.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={`flex flex-col items-center justify-center gap-3 rounded-[30px] border py-6 transition-all duration-300 active:scale-95 ${
                    selectedMood === mood.label 
                      ? mood.color + " border-sky-400 dark:border-sky-500 shadow-lg scale-105" 
                      : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-sky-100 dark:hover:border-sky-900 text-slate-800 dark:text-slate-300"
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-[10px] font-black uppercase">{mood.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {selectedMood && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex gap-3">
                    <div className="bg-sky-50 dark:bg-sky-500/10 p-4 rounded-3xl flex-1 transition-colors">
                      <p className="text-xs font-bold text-sky-600 dark:text-sky-400 mb-1 uppercase tracking-wider">Quick Recommendation</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">You seem {selectedMood}. Try a 25-min focus session with a lo-fi beat.</p>
                    </div>
                    <button className="bg-slate-900 dark:bg-sky-600 text-white px-6 rounded-3xl text-sm font-bold hover:bg-sky-600 dark:hover:bg-sky-500 transition-colors">Start</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── CLASSROOM OVERVIEW ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="rounded-[40px] bg-white dark:bg-slate-800 p-8 shadow-xl shadow-sky-100/50 dark:shadow-none border border-white dark:border-slate-700 overflow-hidden relative transition-colors duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center transition-colors">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter transition-colors">Classroom Synced</h3>
                    <p className="text-[10px] font-bold text-slate-400">Live updates from Google</p>
                  </div>
                </div>
                <button onClick={() => window.location.reload()} className="text-slate-300 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pending Tasks</h4>
                {isLoadingTasks ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
                  </div>
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <motion.div key={task.id} whileHover={{ x: 5 }} className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-700/30 rounded-[24px] border border-slate-50 dark:border-slate-700/50 group hover:border-sky-100 dark:hover:border-sky-900 hover:bg-white dark:hover:bg-slate-700 transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-sky-600 dark:text-sky-400 uppercase mb-0.5">{task.courseName}</p>
                        <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate pr-4 transition-colors">{task.title}</h5>
                      </div>
                      <a href={task.link} target="_blank" className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:text-sky-500 dark:group-hover:text-sky-400 group-hover:border-sky-100 dark:group-hover:border-sky-900 transition-all">
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

              <Link href="/tasks" className="mt-8 block w-full text-center py-4 bg-slate-900 dark:bg-sky-600 rounded-[24px] text-white text-xs font-black uppercase tracking-widest hover:bg-sky-600 dark:hover:bg-sky-500 transition-all shadow-lg shadow-slate-200 dark:shadow-none">
                Go to Focus Flow
              </Link>
            </div>
          </motion.div>

          {/* RANDOM QUOTES */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center p-8">
            <Quote className="mb-6 h-8 w-8 text-sky-300 dark:text-sky-900 opacity-50" />
            <p className="text-xl italic text-slate-700 dark:text-slate-300 leading-relaxed font-serif px-4 transition-colors">
              &quot;{randomQuote.text}&quot;
            </p>
            <p className="mt-6 text-[10px] font-black text-sky-500 dark:text-sky-400 uppercase tracking-[0.3em] transition-colors">
              — {randomQuote.author}
            </p>
          </motion.div>

        </div>
      </div>
    </>
  );
}