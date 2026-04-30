"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, RotateCcw, AlertOctagon, Flame, 
  Clock, Trophy, CalendarDays, CheckCircle, 
  ArrowUpRight, Award, BookOpen, Folder, Loader2 
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type TabType = 'active' | 'missing' | 'completed';

const groupTasksByCourse = (tasks: any[]) => {
  return tasks.reduce((groups, task) => {
    const courseName = task.course;
    if (!groups[courseName]) {
      groups[courseName] = [];
    }
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
              id: t.id,
              title: t.title,
              course: course.name,
              link: t.alternateLink,
              completed: isTurnedIn,
              grade: grade,
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
    if (isRunning && timeLeft > 0) interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    else if (timeLeft === 0) setIsRunning(false);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const missingTasks = tasks.filter(t => t.status === "missing");
  const activeTasks = tasks.filter(t => t.status === "active");
  const completedTasks = tasks.filter(t => t.status === "completed");

  const currentTasks = activeTab === 'active' ? activeTasks : activeTab === 'missing' ? missingTasks : completedTasks;
  const groupedTasks = groupTasksByCourse(currentTasks);

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans pb-24 bg-[#F0F9FF]">
      <div className="mx-auto max-w-7xl">
        
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Focus Flow 🌊</h1>
            <p className="text-slate-500 font-medium">Protect your peace, one task at a time.</p>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
            <StatCard label="Missing" count={missingTasks.length} color="text-rose-500" bg="bg-rose-50" />
            <StatCard label="Active" count={activeTasks.length} color="text-sky-500" bg="bg-sky-50" />
            <StatCard label="Done" count={completedTasks.length} color="text-emerald-500" bg="bg-emerald-50" />
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          <div className="lg:col-span-8">
            <div className="mb-6 flex gap-2 p-1.5 bg-white/50 backdrop-blur-md rounded-2xl border border-white/80 w-fit shadow-sm">
              <TabButton active={activeTab === 'active'} onClick={() => setActiveTab('active')} label="Active" icon={<Flame size={16} />} />
              <TabButton active={activeTab === 'missing'} onClick={() => setActiveTab('missing')} label="Missing" icon={<AlertOctagon size={16} />} />
              <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} label="Completed" icon={<CheckCircle size={16} />} />
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-20 bg-white/40 rounded-[32px] border-2 border-dashed border-sky-200">
                <Loader2 className="h-10 w-10 animate-spin text-sky-500 mb-4" />
                <p className="text-sky-700 font-bold">Updating Classroom...</p>
              </div>
            ) : (
              <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-3 space-y-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-sky-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="space-y-8 pb-10"
                  >
                    {Object.keys(groupedTasks).length > 0 ? (
                      Object.entries(groupedTasks).map(([courseName, courseTasks]) => (
                        <div key={courseName} className="space-y-3">
                          <div className="flex items-center gap-2 ml-2 mb-4">
                            <div className="bg-sky-100 p-1.5 rounded-lg text-sky-600">
                              <Folder size={16} />
                            </div>
                            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">{courseName}</h2>
                          </div>
                          
                          <div className="space-y-3">
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

          <div className="lg:col-span-4 self-start sticky top-10">
            <div className="space-y-6">
              <section className="bg-white rounded-[40px] p-8 shadow-xl shadow-sky-100 border border-white flex flex-col items-center">
                <div className="flex items-center gap-2 mb-8 text-sky-400 font-bold text-[10px] uppercase tracking-widest">
                  <Clock size={14} /> Focus Session
                </div>
                <div className="relative flex items-center justify-center w-52 h-52 mb-10">
                  <svg className="absolute w-full h-full -rotate-90">
                    <circle cx="104" cy="104" r="96" stroke="#F1F5F9" strokeWidth="8" fill="transparent" />
                    <motion.circle 
                      cx="104" cy="104" r="96" stroke="#0EA5E9" strokeWidth="8" fill="transparent" 
                      strokeDasharray="603"
                      animate={{ strokeDashoffset: isNaN(timeLeft) ? 603 : 603 - (603 * (timeLeft / (25 * 60))) }}
                      transition={{ duration: 1 }}
                    />
                  </svg>
                  <div className="text-5xl font-black text-slate-800 tabular-nums">{formatTime(timeLeft)}</div>
                </div>
                <div className="flex gap-3 w-full">
                  <button onClick={() => setIsRunning(!isRunning)} className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 ${isRunning ? 'bg-orange-400 shadow-orange-100' : 'bg-sky-600 shadow-sky-100'}`}>
                    {isRunning ? <Pause size={20} /> : <Play size={20} />} {isRunning ? "Pause" : "Start"}
                  </button>
                  <button onClick={() => {setTimeLeft(25*60); setIsRunning(false)}} className="p-4 bg-slate-100 rounded-2xl text-slate-500 hover:bg-slate-200 transition-colors">
                    <RotateCcw size={20} />
                  </button>
                </div>
              </section>

              <div className="bg-[#0C4A6E] rounded-[32px] p-6 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-sky-300 text-[10px] font-bold uppercase tracking-widest mb-2">Study Tip</p>
                  <p className="text-sm font-medium leading-relaxed italic">"Tidying your room for 5 minutes can clear your mental space for 2 hours."</p>
                </div>
                <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform">
                  <BookOpen size={120} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, count, color, bg }: any) {
  return (
    <div className={`${bg} border border-white px-5 py-2.5 rounded-2xl shadow-sm min-w-[100px]`}>
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{label}</p>
      <p className={`text-xl font-black ${color}`}>{count}</p>
    </div>
  );
}

function TabButton({ active, onClick, label, icon }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${active ? 'bg-sky-600 text-white shadow-md' : 'text-slate-500 hover:bg-white'}`}>
      {icon} {label}
    </button>
  );
}

function TaskCard({ task, type }: { task: any, type: TabType }) {
  const isMissing = type === 'missing';
  const isDone = type === 'completed';
  return (
    <motion.div whileHover={{ scale: 1.01 }} className={`group bg-white p-5 rounded-[28px] border-2 transition-all flex items-center gap-5 ${isMissing ? 'border-rose-100 hover:border-rose-300' : isDone ? 'border-emerald-100 hover:border-emerald-200' : 'border-white hover:border-sky-200 shadow-sm'}`}>
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${isMissing ? 'bg-rose-50 text-rose-500' : isDone ? 'bg-emerald-50 text-emerald-500' : 'bg-sky-50 text-sky-500'}`}>
        {isDone ? <Trophy size={24} /> : isMissing ? <AlertOctagon size={24} /> : <CalendarDays size={24} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {task.grade && <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Award size={12} className="text-yellow-500"/> {task.grade}</span>}
        </div>
        <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{task.title}</h3>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <Clock size={13} /> {isDone ? 'Finished' : task.deadlineStr}
          </span>
        </div>
      </div>
      <a href={task.link} target="_blank" className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${isMissing ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' : 'bg-slate-50 text-slate-400 hover:bg-sky-600 hover:text-white'}`}>
        <ArrowUpRight size={20} />
      </a>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-12 text-center bg-white/30 rounded-[32px] border-2 border-dashed border-white/80">
      <p className="text-slate-400 text-sm font-bold italic">{message}</p>
    </div>
  );
}