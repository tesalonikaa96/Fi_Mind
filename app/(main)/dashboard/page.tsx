"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Quote, ArrowRight, CheckCircle, 
  Loader2, RefreshCw, Zap, Coffee, AlertCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase"; 
import Link from "next/link";

// ── DATA KONFIGURASI STATUS OTOMATIS ──
const STATUS_THEMES: Record<string, any> = {
  anxious: { 
    emoji: "😰", 
    label: "Anxious / Overdue", 
    color: "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-orange-200",
    recommendation: "Take a deep breath. Let's tackle the overdue tasks first, one by one."
  },
  energized: { 
    emoji: "🤩", 
    label: "On Track / Focused", 
    color: "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 border-yellow-200",
    recommendation: "You have active tasks today! Great energy—let's keep the momentum going."
  },
  calm: { 
    emoji: "😌", 
    label: "All Clear / Peaceful", 
    color: "bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-200",
    recommendation: "Zero pending tasks. This is the perfect time for a hobby or some self-care."
  }
};

const dailyQuotes = [
  { text: "We read to know we are not alone.", author: "C.S. Lewis" },
  { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
  { text: "Words can be like X-rays if you use them properly.", author: "Aldous Huxley" },
  { text: "I can shake off everything as I write; my sorrows disappear.", author: "Anne Frank" },
];

export default function DashboardPage() {
  const [randomQuote, setRandomQuote] = useState(dailyQuotes[0]);
  const [showIntro, setShowIntro] = useState(false);
  const [introState, setIntroState] = useState({ emoji: "✨", text: "Syncing your sanctuary..." });
  
  // State Baru: Menyimpan status otomatis berdasarkan tugas
  const [currentStatusKey, setCurrentStatusKey] = useState<string>("calm");
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [userName, setUserName] = useState("Tesalonika");

  const fetchClassroomTasks = async (token: string) => {
    setIsLoadingTasks(true);
    let missingCount = 0;
    let activeCount = 0;

    try {
      const courseRes = await fetch("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const courseData = await courseRes.json();

      if (courseData.courses) {
        const allTasksPromises = courseData.courses.map(async (course: any) => {
          const taskRes = await fetch(`https://classroom.googleapis.com/v1/courses/${course.id}/courseWork`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const taskData = await taskRes.json();
          if (!taskData.courseWork) return [];

          const subRes = await fetch(`https://classroom.googleapis.com/v1/courses/${course.id}/courseWork/-/studentSubmissions`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const subData = await subRes.json();

          return taskData.courseWork.map((t: any) => {
            const submission = subData.studentSubmissions?.find((s: any) => s.courseWorkId === t.id);
            const isTurnedIn = submission?.state === "TURNED_IN" || submission?.state === "RETURNED";
            const dueDate = t.dueDate ? new Date(t.dueDate.year, t.dueDate.month - 1, t.dueDate.day) : null;
            const isOverdue = dueDate ? dueDate < new Date() : false;
            
            if (isOverdue && !isTurnedIn) missingCount++;
            else if (!isTurnedIn) activeCount++;

            return {
              id: t.id,
              title: t.title,
              courseName: course.name,
              link: t.alternateLink,
              status: isTurnedIn ? "completed" : (isOverdue ? "missing" : "active")
            };
          });
        });

        const results = await Promise.all(allTasksPromises);
        const flatTasks = results.flat().filter(t => t !== undefined);
        setTasks(flatTasks.filter(t => t.status !== "completed").slice(0, 4)); 
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setIsLoadingTasks(false);
    }
    return { missingCount, activeCount };
  };

  useEffect(() => {
    const initDashboard = async () => {
      const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.user_metadata?.full_name) {
        setUserName(session.user.user_metadata.full_name.split(' ')[0]);
      }

      if (!hasSeenIntro) setShowIntro(true);

      let counts = { missingCount: 0, activeCount: 0 };
      if (session?.provider_token) {
        counts = await fetchClassroomTasks(session.provider_token);
      } else {
        setIsLoadingTasks(false);
      }

      // TENTUKAN STATUS BERDASARKAN HASIL SYNC
      let statusKey = "calm";
      let intro = { emoji: "😌", text: "Semua tugas beres! Nikmati hari tenangnya. 🍃" };

      if (counts.missingCount > 0) {
        statusKey = "anxious";
        intro = { emoji: "😰", text: `Ada ${counts.missingCount} tugas terlewat. Tetap tenang, kita selesaikan ya! 💪` };
      } else if (counts.activeCount > 0) {
        statusKey = "energized";
        intro = { emoji: "🤩", text: `Ada ${counts.activeCount} tugas aktif menanti. Yuk, sikat habis hari ini! ✨` };
      }

      setCurrentStatusKey(statusKey);
      setIntroState(intro);

      if (!hasSeenIntro) {
        setTimeout(() => {
          setShowIntro(false);
          sessionStorage.setItem("hasSeenIntro", "true");
        }, 3500);
      }
    };

    initDashboard();
    setRandomQuote(dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]);
  }, []);

  const currentStatus = STATUS_THEMES[currentStatusKey];

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} 
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white dark:bg-slate-900 px-6 text-center"
          >
            <motion.span 
              key={introState.emoji}
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-[120px] block mb-8"
            >
              {introState.emoji}
            </motion.span>
            <motion.h2 
              key={introState.text}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight max-w-lg"
            >
              {introState.text}
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
            <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium">
              Sanctuary is synced. {tasks.length > 0 ? "You have work to do." : "Peace is yours today."}
            </p>
          </motion.div>

          {/* ── SMART STATUS CARD (PENGGANTI MOOD GRID) ── */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className={`rounded-[40px] border p-8 shadow-xl backdrop-blur-xl transition-all duration-700 ${currentStatus.color}`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-7xl bg-white/50 dark:bg-black/20 w-24 h-24 flex items-center justify-center rounded-[32px] shadow-inner">
                {currentStatus.emoji}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="flex items-center justify-center md:justify-start gap-2 font-bold uppercase tracking-widest text-[11px] mb-2">
                  <Sparkles className="h-4 w-4" />
                  Calculated Academic Status
                </h2>
                <h3 className="text-2xl font-black mb-2 tracking-tight">{currentStatus.label}</h3>
                <p className="text-sm font-medium opacity-80">{currentStatus.recommendation}</p>
              </div>
              <Link href="/tasks" className="bg-slate-900 text-white px-8 py-4 rounded-3xl text-sm font-bold hover:scale-105 active:scale-95 transition-all">
                Handle Tasks
              </Link>
            </div>
          </motion.div>

          {/* CLASSROOM OVERVIEW */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="rounded-[40px] bg-white dark:bg-slate-800 p-8 shadow-xl shadow-sky-100/50 dark:shadow-none border border-white dark:border-slate-700 relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">Sync Active</h3>
                    <p className="text-[10px] font-bold text-slate-400">Classroom Data Loaded</p>
                  </div>
                </div>
                <button onClick={() => window.location.reload()} className="text-slate-300 hover:text-sky-500 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {isLoadingTasks ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-sky-500" /></div>
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <motion.div key={task.id} whileHover={{ x: 5 }} className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-700/30 rounded-[24px] border border-slate-50 dark:border-slate-700/50 group hover:border-sky-100 transition-all">
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`text-[9px] font-black uppercase mb-0.5 ${task.status === 'missing' ? 'text-rose-500' : 'text-sky-600'}`}>
                          {task.courseName} {task.status === 'missing' && "• OVERDUE"}
                        </p>
                        <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate pr-4">{task.title}</h5>
                      </div>
                      <a href={task.link} target="_blank" className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-400 text-sm italic">No assignments. Enjoy! ✨</div>
                )}
              </div>
            </div>
          </motion.div>

          {/* QUOTE SECTION */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center p-8">
            <Quote className="mb-6 h-8 w-8 text-sky-300 opacity-50" />
            <p className="text-xl italic text-slate-700 dark:text-slate-300 leading-relaxed font-serif px-4">
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