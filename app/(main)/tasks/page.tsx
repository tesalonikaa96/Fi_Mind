"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, RotateCcw, AlertOctagon, Flame, 
  Clock, Trophy, CheckCircle, 
  ArrowUpRight, Award, BookOpen, Folder, Loader2, ChevronRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type TabType = 'active' | 'missing' | 'completed';

// ── KOMPONEN FIMI SI RUBAH ──
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

const groupTasksByCourse = (tasks: any[]) => {
  return tasks.reduce((groups, task) => {
    const courseName = task.course;
    if (!groups[courseName]) groups[courseName] = [];
    groups[courseName].push(task);
    return groups;
  }, {} as Record<string, any[]>);
};

export default function FocusFlowPage() {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fimi State
  const [showFimi, setShowFimi] = useState(false);
  const [fimiStep, setFimiStep] = useState(0);
  const fimiDialogues = [
    "Amazing, Tesalonika! 🎉 You finished a focus session.",
    "Rest is just as important as work. Your brain deserves it.",
    "Go drink some water, stretch, and come back whenever you're ready! 🦊"
  ];

  const fetchClassroomData = useCallback(async (token: string) => {
    setIsLoading(true);
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
            const grade = submission?.assignedGrade ? `${submission.assignedGrade}/${t.maxPoints}` : null;
            const dueDate = t.dueDate ? new Date(t.dueDate.year, t.dueDate.month - 1, t.dueDate.day) : null;
            const isOverdue = dueDate ? dueDate < new Date() : false;

            return {
              id: t.id, title: t.title, course: course.name, link: t.alternateLink,
              completed: isTurnedIn, grade: grade,
              deadlineStr: dueDate ? dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : "No Deadline",
              status: isTurnedIn ? "completed" : (isOverdue ? "missing" : "active")
            };
          });
        });

        const results = await Promise.all(allTasksPromises);
        setTasks(results.flat().filter(t => t !== undefined));
      }
    } catch (error) {
      console.error("Gagal menarik data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.provider_token) fetchClassroomData(session.provider_token);
      else setIsLoading(false);
    };
    checkUser();
  }, [fetchClassroomData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setFimiStep(0);
      setShowFimi(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const missingTasks = tasks.filter(t => t.status === "missing");
  const activeTasks = tasks.filter(t => t.status === "active");
  const completedTasks = tasks.filter(t => t.status === "completed");

  const currentTasks = activeTab === 'active' ? activeTasks : activeTab === 'missing' ? missingTasks : completedTasks;
  const groupedTasks = groupTasksByCourse(currentTasks);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-10 font-sans pb-24 bg-[#F0F7FF] dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
      
      {/* ── BACKGROUND MESH ── */}
      <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-20">
         <div className="absolute -top-48 -right-48 w-[500px] h-[500px] bg-blue-300 rounded-full blur-[120px]" />
         <div className="absolute top-1/2 -left-48 w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Focus Flow 🌊</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Academic peace: Active</p>
          </div>
          
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <StatCard label="Missing" count={missingTasks.length} color="text-rose-600" bg="bg-white/80" />
            <StatCard label="Active" count={activeTasks.length} color="text-blue-700" bg="bg-white/80" />
            <StatCard label="Done" count={completedTasks.length} color="text-emerald-600" bg="bg-white/80" />
          </div>
        </header>

        {/* ── RESPONSIVE GRID ── */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* TIMER SECTION (Top on mobile, Side on desktop) */}
          <div className="lg:col-span-4 lg:order-2 self-start lg:sticky lg:top-10">
            <div className="space-y-6">
              <section className="bg-white/90 backdrop-blur-xl rounded-[32px] sm:rounded-[48px] p-6 sm:p-8 shadow-2xl border border-white flex flex-col items-center">
                <div className="flex items-center gap-2 mb-6 sm:mb-8 text-blue-700 font-black text-[10px] uppercase tracking-[0.3em]">
                  <Clock size={14} /> Focus Session
                </div>
                
                <div className="relative flex items-center justify-center w-40 h-40 sm:w-52 sm:h-52 mb-8 sm:mb-10">
                  <svg className="absolute w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" stroke="#F1F5F9" strokeWidth="8" fill="transparent" />
                    <motion.circle 
                      cx="50%" cy="50%" r="45%" stroke="#1D4ED8" strokeWidth="8" fill="transparent" 
                      strokeDasharray="283%"
                      animate={{ strokeDashoffset: isNaN(timeLeft) ? "283%" : `${283 - (283 * (timeLeft / (25 * 60)))}%` }}
                      transition={{ duration: 1 }}
                    />
                  </svg>
                  <div className="text-4xl sm:text-6xl font-black text-slate-900 tabular-nums tracking-tighter">{formatTime(timeLeft)}</div>
                </div>

                <div className="flex gap-3 w-full">
                  <button onClick={() => setIsRunning(!isRunning)} className={`flex-1 flex items-center justify-center gap-2 py-4 sm:py-5 rounded-2xl font-black text-white transition-all shadow-xl active:scale-95 ${isRunning ? 'bg-orange-500 shadow-orange-100' : 'bg-blue-800 shadow-blue-100'}`}>
                    {isRunning ? <Pause size={20} /> : <Play size={20} />} {isRunning ? "Pause" : "Start"}
                  </button>
                  <button onClick={() => {setTimeLeft(25*60); setIsRunning(false)}} className="p-4 sm:p-5 bg-slate-100 rounded-2xl text-slate-500 hover:bg-blue-700 hover:text-white transition-colors">
                    <RotateCcw size={20} />
                  </button>
                </div>
              </section>

              <div className="hidden md:block bg-[#082F49] rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl text-left">
                <div className="relative z-10">
                  <p className="text-sky-300 text-[10px] font-black uppercase tracking-widest mb-3">Study Tip</p>
                  <p className="text-sm font-medium leading-relaxed italic text-slate-100">&quot;Tidying your room for 5 minutes can clear your mental space for 2 hours.&quot;</p>
                </div>
                <div className="absolute -bottom-6 -right-6 opacity-20">
                  <BookOpen size={120} />
                </div>
              </div>
            </div>
          </div>

          {/* TASK LIST SECTION */}
          <div className="lg:col-span-8 lg:order-1">
            <div className="mb-6 flex gap-1 sm:gap-2 p-1 bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-sm w-full sm:w-fit overflow-x-auto scrollbar-hide">
              <TabButton active={activeTab === 'active'} onClick={() => setActiveTab('active')} label="Active" icon={<Flame size={16} />} />
              <TabButton active={activeTab === 'missing'} onClick={() => setActiveTab('missing')} label="Missing" icon={<AlertOctagon size={16} />} />
              <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} label="Done" icon={<CheckCircle size={16} />} />
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 sm:p-20 bg-white/40 backdrop-blur-xl rounded-[32px] border-2 border-dashed border-blue-200">
                <Loader2 className="h-10 w-10 animate-spin text-blue-700 mb-4" />
                <p className="text-blue-900 font-black uppercase tracking-widest text-[10px]">Syncing sanctuary...</p>
              </div>
            ) : (
              <div className="space-y-8 pb-10">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    {Object.keys(groupedTasks).length > 0 ? (
                      Object.entries(groupedTasks).map(([courseName, courseTasks]) => (
                        <div key={courseName} className="space-y-3">
                          <div className="flex items-center gap-2 ml-2 mb-4 text-left">
                            <div className="bg-blue-700 p-1.5 rounded-lg text-white shadow-lg shadow-blue-700/20">
                              <Folder size={16} />
                            </div>
                            <h2 className="text-[9px] sm:text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] truncate">{courseName}</h2>
                          </div>
                          
                          <div className="grid gap-3">
                            {(courseTasks as any[]).map((t: any) => <TaskCard key={t.id} task={t} type={activeTab} />)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState message={
                        activeTab === 'active' ? "No active tasks. Time to rest? ☕" : 
                        activeTab === 'missing' ? "Nothing missing! You're on fire! 🔥" : 
                        "Complete a task to see it here. 🏆"
                      } />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── FIMI POPUP (Responsive Box) ── */}
      <AnimatePresence>
        {showFimi && (
          <div className="fixed inset-0 z-[250] flex items-end justify-end p-4 sm:p-8 pointer-events-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/20 backdrop-blur-[2px] pointer-events-auto" onClick={() => setShowFimi(false)} />
            <motion.div 
              initial={{ y: 150, opacity: 0, scale: 0.8 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 100, opacity: 0 }} 
              className="relative z-[260] flex items-end gap-3 sm:gap-5 max-w-[calc(100%-2rem)] sm:max-w-sm w-full pointer-events-auto"
            >
              <div className="bg-white p-5 sm:p-7 rounded-[28px] sm:rounded-[32px] rounded-br-sm shadow-2xl border-2 border-blue-200 relative flex-1 mb-6 sm:mb-10 text-left">
                <p className="text-slate-800 text-xs sm:text-sm font-black leading-relaxed">{fimiDialogues[fimiStep]}</p>
                <button onClick={() => fimiStep < fimiDialogues.length - 1 ? setFimiStep(s => s + 1) : setShowFimi(false)} className="mt-5 w-full bg-blue-800 text-white font-black text-[10px] sm:text-xs py-3 sm:py-4 rounded-xl sm:rounded-2xl uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95">
                  {fimiStep < fimiDialogues.length - 1 ? "Read More" : "Got it, Fimi!"} <ChevronRight size={14} />
                </button>
                <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white border-b-2 border-r-2 border-blue-200 transform rotate-45" />
              </div>
              <div className="w-16 h-16 sm:w-24 sm:h-24 shrink-0 mb-6 sm:mb-10"><FimiMascotSVG isTalking={true} /></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── REUSABLE MINI-COMPONENTS ──

function StatCard({ label, count, color, bg }: any) {
  return (
    <div className={`${bg} border-2 border-white px-3 sm:px-6 py-3 sm:py-4 rounded-[20px] sm:rounded-[24px] shadow-xl min-w-[90px] sm:min-w-[110px] backdrop-blur-md`}>
      <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase mb-0.5 tracking-tighter">{label}</p>
      <p className={`text-xl sm:text-3xl font-black ${color}`}>{count}</p>
    </div>
  );
}

function TabButton({ active, onClick, label, icon }: any) {
  return (
    <button onClick={onClick} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all whitespace-nowrap ${active ? 'bg-blue-800 text-white shadow-xl' : 'text-slate-500 hover:text-blue-700'}`}>
      {icon} {label}
    </button>
  );
}

function TaskCard({ task, type }: { task: any, type: TabType }) {
  const isMissing = type === 'missing';
  const isDone = type === 'completed';
  return (
    <motion.div whileHover={{ scale: 1.01 }} className={`group bg-white p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border-2 transition-all flex items-center gap-3 sm:gap-5 ${isMissing ? 'border-rose-100' : isDone ? 'border-emerald-100' : 'border-white shadow-xl shadow-blue-900/5 hover:border-blue-400'}`}>
      <div className={`h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${isMissing ? 'bg-rose-50 text-rose-600' : isDone ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-700'}`}>
        {isDone ? <Trophy size={20} /> : isMissing ? <AlertOctagon size={20} /> : <Flame size={20} />}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <h3 className="font-black text-slate-800 text-sm sm:text-lg leading-tight truncate pr-2 sm:pr-4">{task.title}</h3>
        <div className="flex items-center gap-2 mt-1 sm:mt-2">
          <span className="text-[8px] sm:text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-widest">
            <Clock size={12} /> {isDone ? 'Finished' : task.deadlineStr}
          </span>
          {task.grade && <span className="text-[8px] sm:text-[10px] font-black text-amber-600 flex items-center gap-1 uppercase tracking-widest">• <Award size={10}/> {task.grade}</span>}
        </div>
      </div>
      <a href={task.link} target="_blank" className="h-9 w-9 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center transition-all bg-blue-50 text-blue-700 border-2 border-blue-100 shrink-0">
        <ArrowUpRight size={18} />
      </a>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-10 sm:p-16 text-center bg-white/40 backdrop-blur-xl rounded-[32px] sm:rounded-[48px] border-2 border-dashed border-white">
      <p className="text-slate-500 text-[10px] sm:text-sm font-black italic tracking-wide">{message}</p>
    </div>
  );
}