"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, GraduationCap, Quote, ArrowRight, Bot, Target, 
  Headphones, Coffee, BookOpen, Timer, Lightbulb, Calendar, 
  PenTool, FileText, Moon, Activity, BellOff, Wind, ListTodo,
  Folder, Palette, LayoutDashboard, Mail, CheckSquare, 
  MonitorPlay, Book, Sun, Heart, Power, Users, CheckCircle, Loader2
} from "lucide-react";
import Link from "next/link"; 
import { supabase } from "@/lib/supabase"; 

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
  { text: "Fairy tales are more than true: not because they tell us that dragons exist, but because they tell us that dragons can be beaten.", author: "Neil Gaiman" },
  { text: "I can shake off everything as I write; my sorrows disappear, my courage is reborn.", author: "Anne Frank" },
  { text: "And by the way, everything in life is writable about if you have the outgoing guts to do it.", author: "Sylvia Plath" }
];

export default function DashboardPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [currentEmojiIdx, setCurrentEmojiIdx] = useState(0);
  const [randomQuote, setRandomQuote] = useState(dailyQuotes[0]);
  
  // ── STATE UNTUK CLASSROOM ──
  const [isConnected, setIsConnected] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // ── 1. FUNGSI CEK SESI LOGIN ──
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.provider_token) {
        setIsConnected(true);
        fetchClassroomTasks(session.provider_token);
      }
    };
    checkSession();
  }, []);

  // ── 2. FUNGSI AMBIL TUGAS DARI GOOGLE ──
  const fetchClassroomTasks = async (token: string) => {
    setIsLoadingTasks(true);
    try {
      // Ambil daftar kelas dulu
      const courseRes = await fetch("https://classroom.googleapis.com/v1/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const courseData = await courseRes.json();

      if (courseData.courses) {
        // Ambil tugas dari setiap kelas (hanya 3 kelas pertama untuk contoh)
        const allTasks: any[] = [];
        for (const course of courseData.courses.slice(0, 3)) {
          const taskRes = await fetch(`https://classroom.googleapis.com/v1/courses/${course.id}/courseWork`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const taskData = await taskRes.json();
          if (taskData.courseWork) {
            taskData.courseWork.forEach((t: any) => allTasks.push({ ...t, courseName: course.name }));
          }
        }
        // Urutkan berdasarkan deadline (jika ada)
        setTasks(allTasks.slice(0, 5)); 
      }
    } catch (err) {
      console.error("Gagal ambil tugas:", err);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // ── 3. FUNGSI TOMBOL CONNECT ──
  const handleConnectClassroom = async () => {
    if (isConnected) return; // Jangan konek lagi kalau sudah

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly',
        queryParams: { access_type: 'offline', prompt: 'consent' },
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) alert(error.message);
  };

  useEffect(() => {
    setRandomQuote(dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]);
    const emojiInterval = setInterval(() => setCurrentEmojiIdx((prev) => (prev + 1) % introEmojis.length), 800);
    const introTimeout = setTimeout(() => setShowIntro(false), 5000); 
    return () => { clearInterval(emojiInterval); clearTimeout(introTimeout); };
  }, []);

  return (
    <>
      {/* ── INTRO POP-UP (Tetap Sama) ── */}
      <AnimatePresence>
        {showIntro && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/40 backdrop-blur-2xl">
            <div className="flex h-72 w-72 items-center justify-center rounded-full bg-white/70 shadow-2xl border border-white/50">
              <motion.span key={currentEmojiIdx} className="text-[160px]">{introEmojis[currentEmojiIdx]}</motion.span>
            </div>
            <h2 className="mt-12 text-4xl font-extrabold text-slate-800">Protect your <span className="text-sky-500">peace.</span></h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen p-6 md:p-10 pb-20" style={{ background: "linear-gradient(to bottom right, #7dd3fc 0%, #e0f2fe 50%, #f0f9ff 100%)" }}>
        <div className="mx-auto max-w-3xl space-y-8">
          
          {/* HEADER */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-extrabold text-slate-800">Good evening, Tesalonika. 🌙</h1>
            <p className="mt-2 text-slate-700 font-medium">Your academic sanctuary is ready.</p>
          </motion.div>

          {/* MOOD CHECK-IN (Sama) */}
          <motion.div className="rounded-3xl border border-white/80 bg-white/70 p-6 md:p-8 shadow-md backdrop-blur-xl">
             {/* ... (Konten Mood Check-in kamu di sini) ... */}
             <h2 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 text-lg">
              <Sparkles className="h-5 w-5 text-sky-500" />
              Honestly, how&apos;s your energy right now?
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {moodOptions.map((mood) => (
                <button key={mood.label} onClick={() => setSelectedMood(mood.label)} className={`flex flex-col items-center justify-center gap-3 rounded-2xl border p-4 transition-all ${selectedMood === mood.label ? mood.color + " ring-4 ring-sky-400" : "bg-white"}`}>
                  <span className="text-4xl">{mood.emoji}</span>
                  <span className="text-xs font-semibold">{mood.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── GOOGLE CLASSROOM STATUS & TASKS ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <button 
              onClick={handleConnectClassroom}
              disabled={isConnected}
              className={`group flex w-full items-center gap-5 rounded-3xl border p-6 shadow-md backdrop-blur-xl transition-all ${isConnected ? 'bg-emerald-50 border-emerald-200 cursor-default' : 'bg-white/70 border-white/80 hover:border-emerald-300 active:scale-[0.99]'}`}
            >
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors ${isConnected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'}`}>
                {isConnected ? <CheckCircle className="h-7 w-7" /> : <GraduationCap className="h-7 w-7" />}
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-slate-800 text-lg">{isConnected ? "Classroom Synced" : "Connect Google Classroom"}</h3>
                <p className="text-sm text-slate-600">{isConnected ? "Your assignments are up to date." : "Sync your assignments automatically."}</p>
              </div>
              {!isConnected && <ArrowRight className="h-6 w-6 text-slate-400 group-hover:text-emerald-500" />}
            </button>

            {/* ── DAFTAR TUGAS (UP-TO-DATE) ── */}
            {isConnected && (
              <div className="mt-6 space-y-4">
                <h4 className="flex items-center gap-2 font-bold text-slate-700 ml-2">
                  <ListTodo className="h-5 w-5 text-sky-500" /> Upcoming Assignments
                </h4>
                {isLoadingTasks ? (
                  <div className="flex items-center justify-center p-10 bg-white/40 rounded-3xl border border-white/50">
                    <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
                  </div>
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <motion.div key={task.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between p-5 bg-white/80 border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">{task.courseName}</p>
                        <h5 className="font-bold text-slate-800 text-sm mt-0.5">{task.title}</h5>
                      </div>
                      <a href={task.alternateLink} target="_blank" className="bg-sky-100 text-sky-700 p-2 rounded-xl hover:bg-sky-500 hover:text-white transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-10 text-center bg-white/40 rounded-3xl border border-white/50 text-slate-500 text-sm">
                    No assignments found. You're all caught up! 🎉
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* QUOTES (Sama) */}
          <motion.div className="rounded-3xl border border-sky-100 bg-white/60 p-8 shadow-md backdrop-blur-md">
            <Quote className="mb-4 h-8 w-8 text-sky-400" />
            <p className="text-lg italic text-slate-800 font-serif">"{randomQuote.text}"</p>
            <p className="mt-4 text-sm font-bold text-sky-600 uppercase tracking-widest">— {randomQuote.author}</p>
          </motion.div>

        </div>
      </div>
    </>
  );
}