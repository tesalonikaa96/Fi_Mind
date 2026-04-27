"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Play, Pause, RotateCcw, AlertOctagon, Flame, 
  CheckCircle2, Circle, Clock, BookOpen, ListTodo, Plus
} from "lucide-react";

export default function FocusFlowPage() {
  // ── STATE UNTUK TIMER ──
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 menit
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ── STATE UNTUK TUGAS ──
  // Ada 3 tipe: 'missing' (terlewat), 'urgent' (mendesak), 'normal' (to-do biasa)
  const [tasks, setTasks] = useState([
    { id: 1, title: "Phonetics & Phonology Quiz", course: "Linguistics", type: "missing", completed: false, deadline: "Overdue by 2 days" },
    { id: 2, title: "Feature Hypothesis Review", course: "SLA", type: "urgent", completed: false, deadline: "Today, 23:59" },
    { id: 3, title: '"The Story of an Hour" Draft', course: "Literature Analysis", type: "normal", completed: false, deadline: "In 3 Days" },
    { id: 4, title: "Read Chapter 4 for next class", course: "SLA", type: "normal", completed: false, deadline: "Next Week" },
  ]);

  const [newTask, setNewTask] = useState("");

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { 
      id: Date.now(), 
      title: newTask, 
      course: "Personal To-Do", 
      type: "normal", 
      completed: false, 
      deadline: "No deadline" 
    }]);
    setNewTask("");
  };

  const missingTasks = tasks.filter(t => t.type === "missing" && !t.completed);
  const urgentTasks = tasks.filter(t => t.type === "urgent" && !t.completed);
  const normalTasks = tasks.filter(t => t.type === "normal" || t.completed);

  return (
    <div 
      className="min-h-screen p-6 md:p-10 font-sans pb-24 selection:bg-sky-200"
      style={{ background: "linear-gradient(to bottom right, #e0f2fe 0%, #f0f9ff 50%, #f8fafc 100%)" }}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-3">
            Focus Flow 🌊
          </h1>
          <p className="mt-2 text-slate-600 font-medium">
            Clear your mind. Tackle your tasks one step at a time.
          </p>
        </motion.div>

        {/* MISSING TUGAS ALERT (Hanya muncul jika ada tugas yang terlewat) */}
        {missingTasks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3 text-red-600">
              <AlertOctagon className="h-6 w-6" />
              <h2 className="font-bold text-lg">Missing Assignments</h2>
            </div>
            <div className="space-y-3">
              {missingTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-red-100">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleTask(task.id)} className="text-red-300 hover:text-red-500 transition-colors">
                      <Circle className="h-6 w-6" />
                    </button>
                    <div>
                      <h3 className="font-bold text-slate-800">{task.title}</h3>
                      <p className="text-xs font-semibold text-red-500 mt-0.5">{task.course} • {task.deadline}</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors">
                    Do it now
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* BAGIAN KIRI: DAFTAR TUGAS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. URGENT DEADLINES */}
            {urgentTasks.length > 0 && (
              <section className="rounded-3xl border border-orange-200 bg-orange-50/50 p-6 shadow-sm backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2 text-orange-600">
                  <Flame className="h-5 w-5" />
                  <h2 className="font-bold text-lg">Urgent Deadlines</h2>
                </div>
                <div className="space-y-3">
                  {urgentTasks.map(task => (
                    <div key={task.id} className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-orange-100 transition-all hover:border-orange-300">
                      <button onClick={() => toggleTask(task.id)} className="text-orange-300 hover:text-orange-500 transition-colors">
                        <Circle className="h-6 w-6" />
                      </button>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800">{task.title}</h3>
                        <p className="text-xs font-semibold text-orange-500 mt-0.5">{task.course} • {task.deadline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 2. TO-DO LIST & TUGAS LAINNYA */}
            <section className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-md backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-600">
                  <ListTodo className="h-5 w-5" />
                  <h2 className="font-bold text-lg text-slate-800">To-Do List</h2>
                </div>
              </div>

              {/* Form Tambah Tugas */}
              <form onSubmit={addTask} className="mb-5 flex gap-3">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="What else do you need to do?"
                  className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                />
                <button type="submit" className="flex items-center justify-center rounded-xl bg-sky-500 px-4 text-white shadow-sm hover:bg-sky-600 transition-colors">
                  <Plus className="h-5 w-5" />
                </button>
              </form>

              {/* List Tugas Normal */}
              <div className="space-y-3">
                {normalTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-center gap-4 rounded-2xl border p-4 transition-all ${task.completed ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-100 hover:border-sky-200 shadow-sm"}`}
                  >
                    <button onClick={() => toggleTask(task.id)} className={`${task.completed ? "text-emerald-500" : "text-slate-300 hover:text-sky-500"} transition-colors`}>
                      {task.completed ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                    </button>
                    <div className="flex-1">
                      <h3 className={`font-bold ${task.completed ? "text-slate-500 line-through" : "text-slate-800"}`}>
                        {task.title}
                      </h3>
                      {!task.completed && (
                        <p className="text-xs font-medium text-slate-400 mt-0.5">{task.course} • {task.deadline}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* BAGIAN KANAN: TIMER BELAJAR */}
          <div className="lg:col-span-1">
            <section className="sticky top-10 flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-8 text-center shadow-lg backdrop-blur-xl">
              <div className="absolute top-0 right-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-teal-100/60 blur-3xl" />
              
              <div className="flex items-center gap-2 mb-6 text-teal-600">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-bold tracking-widest uppercase">Focus Timer</span>
              </div>

              {/* Angka Timer */}
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-teal-50 bg-white shadow-inner mb-8">
                <h4 className="text-5xl font-black text-teal-700 tracking-tighter">
                  {formatTime(timeLeft)}
                </h4>
                {/* Animasi lingkaran luar saat timer berjalan */}
                {isRunning && (
                  <motion.div 
                    className="absolute inset-0 rounded-full border-4 border-teal-400 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </div>

              {/* Kontrol Timer */}
              <div className="flex items-center gap-4 w-full">
                <button 
                  onClick={toggleTimer} 
                  className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white shadow-lg transition-all active:scale-95 ${isRunning ? "bg-orange-400 shadow-orange-200 hover:bg-orange-500" : "bg-teal-500 shadow-teal-200 hover:bg-teal-600"}`}
                >
                  {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  {isRunning ? "Pause" : "Start Focus"}
                </button>
                <button 
                  onClick={resetTimer}
                  className="flex h-[56px] w-[56px] items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-700 active:scale-95"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-6 text-xs font-medium text-slate-400">
                Tip: Work for 25 mins, then take a 5 min break.
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}