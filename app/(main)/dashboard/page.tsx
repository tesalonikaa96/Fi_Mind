"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Quote, ArrowRight, CheckCircle, 
  Loader2, RefreshCw, ChevronRight
} from "lucide-react";
import { supabase } from "@/lib/supabase"; 
import Link from "next/link";

// ── COMPONENT: FIMI THE FOX (MASCOT) ──
const FimiMascotSVG = ({ isTalking }: { isTalking: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const STATUS_THEMES: Record<string, any> = {
  anxious: { 
    emoji: "😰", 
    label: "Anxious / Overdue", 
    color: "bg-white/95 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 ring-4 ring-orange-100 shadow-xl shadow-orange-200/50",
    recommendation: "Take a deep breath. Let's tackle the overdue tasks first, one by one."
  },
  energized: { 
    emoji: "🤩", 
    label: "On Track / Focused", 
    color: "bg-white/95 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 ring-4 ring-yellow-100 shadow-xl shadow-yellow-200/50",
    recommendation: "You have active tasks today! Great energy—let's keep the momentum going."
  },
  calm: { 
    emoji: "😌", 
    label: "All Clear / Peaceful", 
    color: "bg-blue-50/90 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-400 ring-4 ring-blue-100 shadow-xl shadow-blue-300/50",
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
  const [cycleEmoji, setCycleEmoji] = useState("✨");
  const [introState, setIntroState] = useState({ text: "Syncing your sanctuary..." });
  const [currentStatusKey, setCurrentStatusKey] = useState<string>("calm");
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [userName, setUserName] = useState("Tesalonika");

  const [showMascot, setShowMascot] = useState(false);
  const [mascotStep, setMascotStep] = useState(0);
  const [currentDialogues, setCurrentDialogues] = useState<string[]>([]);

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
      const sessionMascotShown = sessionStorage.getItem("sessionMascotShown");

      const { data: { session } } = await supabase.auth.getSession();
      
      let firstName = "Tesalonika";
      if (session?.user?.user_metadata?.full_name) {
        firstName = session.user.user_metadata.full_name.split(' ')[0];
        setUserName(firstName);
      }

      if (!hasSeenIntro) setShowIntro(true);

      let counts = { missingCount: 0, activeCount: 0 };
      if (session?.provider_token) {
        counts = await fetchClassroomTasks(session.provider_token);
      } else {
        setIsLoadingTasks(false);
      }

      let statusKey = "calm";
      let intro = { text: "All tasks completed! Enjoy your peaceful day. 🍃" };

      if (counts.missingCount > 0) {
        statusKey = "anxious";
        intro = { text: `You have ${counts.missingCount} overdue tasks. Stay calm, let's solve them! 💪` };
      } else if (counts.activeCount > 0) {
        statusKey = "energized";
        intro = { text: `You have ${counts.activeCount} active tasks. Let's conquer the day! ✨` };
      }

      setCurrentStatusKey(statusKey);
      setIntroState(intro);

      if (!hasSeenIntro) {
        const emojiSequence = ["✨", "😌", "🤩", "😰", "🦊", "📖", "🌙", "🌊"];
        let i = 0;
        const interval = setInterval(() => {
          setCycleEmoji(emojiSequence[i % emojiSequence.length]);
          i++;
        }, 350);

        setTimeout(() => {
          clearInterval(interval);
          setShowIntro(false);
          sessionStorage.setItem("hasSeenIntro", "true");
          if (!sessionMascotShown) {
            setCurrentDialogues([
              `Hi ${firstName}! I'm Fimi 🦊. Welcome to your sanctuary.`,
              "I've synchronized your Classroom data to help you stay on track.",
              "Let's focus on one thing at a time. You've got this! ✨"
            ]);
            setTimeout(() => setShowMascot(true), 1000);
            sessionStorage.setItem("sessionMascotShown", "true");
          }
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
              key={cycleEmoji}
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-[80px] sm:text-[100px] md:text-[120px] block mb-8"
            >
              {cycleEmoji}
            </motion.span>
            <motion.h2 
              key={introState.text}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight max-w-lg"
            >
              {introState.text}
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen p-4 sm:p-6 md:p-10 pb-24 relative overflow-hidden bg-[#F0F7FF] dark:bg-slate-950 transition-colors duration-500">
        
        {/* Background Meshes */}
        <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-20">
           <div className="absolute -top-48 -right-48 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-300 rounded-full blur-[120px]" />
           <div className="absolute top-1/2 -left-48 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-300 rounded-full blur-[120px]" />
           <div className="absolute -bottom-48 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-sky-200 rounded-full blur-[120px]" />
        </div>

        <div className="mx-auto max-w-3xl lg:max-w-4xl space-y-8 relative z-10">
          
          {/* Welcome Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              Welcome back, {userName}. 🌙
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest text-[8px] sm:text-[10px]">
              Sanctuary Synchronized • {tasks.length > 0 ? "Action Required" : "Total Peace Mode"}
            </p>
          </motion.div>

          {/* Status Card (Mobile Stack, Tablet/Desktop Row) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className={`rounded-[32px] sm:rounded-[40px] border-2 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl transition-all duration-700 ${currentStatus.color}`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="text-5xl sm:text-6xl md:text-7xl bg-white/80 dark:bg-black/20 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-[24px] sm:rounded-[32px] shadow-inner border border-white">
                {currentStatus.emoji}
              </div>
              <div className="flex-1">
                <h2 className="flex items-center justify-center md:justify-start gap-2 font-black uppercase tracking-tighter text-[9px] sm:text-[11px] mb-2 opacity-80">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  Calculated Academic Status
                </h2>
                <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">{currentStatus.label}</h3>
                <p className="text-xs sm:text-sm font-bold opacity-90">{currentStatus.recommendation}</p>
              </div>
              <Link href="/tasks" className="w-full md:w-auto bg-blue-800 text-white px-8 py-4 rounded-2xl sm:rounded-3xl text-sm font-black shadow-xl hover:bg-blue-900 active:scale-95 transition-all text-center">
                Handle Tasks
              </Link>
            </div>
          </motion.div>

          {/* Classroom Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="rounded-[32px] sm:rounded-[40px] bg-white/80 dark:bg-slate-800/80 p-6 sm:p-8 shadow-2xl border border-white dark:border-slate-700 relative backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 bg-blue-700 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-700/20">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter text-sm sm:text-base">Classroom Live</h3>
                    <p className="text-[8px] sm:text-[10px] font-black text-blue-500 uppercase tracking-widest">Real-time sync active</p>
                  </div>
                </div>
                <button onClick={() => window.location.reload()} className="text-blue-700 hover:rotate-180 transition-all duration-500 bg-blue-50 p-2 rounded-full">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {isLoadingTasks ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <motion.div key={task.id} whileHover={{ x: 5 }} className="flex items-center justify-between p-4 sm:p-5 bg-white dark:bg-slate-700/50 rounded-[24px] sm:rounded-[28px] border-2 border-slate-50 dark:border-slate-700 group hover:border-blue-400 transition-all shadow-sm">
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`text-[8px] sm:text-[10px] font-black uppercase mb-1 ${task.status === 'missing' ? 'text-rose-600' : 'text-blue-700'}`}>
                          {task.courseName} {task.status === 'missing' && "• OVERDUE"}
                        </p>
                        <h5 className="font-black text-slate-900 dark:text-slate-200 text-sm sm:text-base truncate pr-4">{task.title}</h5>
                      </div>
                      <a href={task.link} target="_blank" rel="noopener noreferrer" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-700 border-2 border-blue-100 shadow-sm transition-all hover:bg-blue-700 hover:text-white">
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs sm:text-sm italic font-black">Academic feed clear. Tranquility mode active. 🕊️</div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quote Section */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-slate-900 rounded-[32px] sm:rounded-[40px] shadow-2xl relative overflow-hidden group">
            <Quote className="mb-6 h-6 w-6 sm:h-8 sm:w-8 text-blue-500 opacity-50 relative z-10" />
            <p className="text-lg sm:text-xl italic text-slate-100 leading-relaxed font-serif px-4 relative z-10">
              &quot;{randomQuote.text}&quot;
            </p>
            <p className="mt-6 text-[8px] sm:text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] relative z-10">
              — {randomQuote.author}
            </p>
            <div className="absolute top-0 right-0 p-24 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          </motion.div>

        </div>
      </div>

      {/* Mascot Interface (Responsive Box) */}
      <AnimatePresence>
        {showMascot && (
          <div className="fixed inset-0 z-[250] flex items-end justify-end p-4 sm:p-8 pointer-events-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/20 backdrop-blur-[2px] pointer-events-auto" onClick={() => setShowMascot(false)} />
            <motion.div 
              initial={{ y: 150, opacity: 0, scale: 0.8 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 100, opacity: 0 }} 
              transition={{ type: "spring", bounce: 0.4 }}
              className="relative z-[260] flex items-end gap-3 sm:gap-5 max-w-[calc(100%-2rem)] sm:max-w-sm w-full pointer-events-auto"
            >
              <div className="bg-white p-5 sm:p-7 rounded-[28px] sm:rounded-[32px] rounded-br-sm shadow-2xl border-2 border-blue-200 relative flex-1 mb-6 sm:mb-10 text-left">
                <p className="text-slate-800 text-xs sm:text-sm font-black leading-relaxed">
                  {currentDialogues[mascotStep]}
                </p>
                <button onClick={() => mascotStep < currentDialogues.length - 1 ? setMascotStep(s => s + 1) : setShowMascot(false)} className="mt-5 w-full bg-blue-800 text-white font-black text-[10px] sm:text-xs py-3 sm:py-4 rounded-xl sm:rounded-2xl uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95">
                  {mascotStep < currentDialogues.length - 1 ? "Read More" : "Got it, Fimi!"} <ChevronRight size={14} />
                </button>
                <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white border-b-2 border-r-2 border-blue-200 transform rotate-45" />
              </div>
              <div className="w-16 h-16 sm:w-24 sm:h-24 shrink-0"><FimiMascotSVG isTalking={true} /></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}