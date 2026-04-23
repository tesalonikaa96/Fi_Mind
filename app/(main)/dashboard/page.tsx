"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, GraduationCap, Quote, ArrowRight, Bot, Target, 
  Headphones, Coffee, BookOpen, Timer, Lightbulb, Calendar, 
  PenTool, FileText, Moon, Activity, BellOff, Wind, ListTodo,
  Folder, Palette, LayoutDashboard, Mail, CheckSquare, 
  MonitorPlay, Book, Sun, Heart, Power, Users
} from "lucide-react";
import Link from "next/link"; 

// ── EMOJI WAJAH SEMUA ──
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

  useEffect(() => {
    setRandomQuote(dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]);

    const emojiInterval = setInterval(() => {
      setCurrentEmojiIdx((prev) => (prev + 1) % introEmojis.length);
    }, 800);

    const introTimeout = setTimeout(() => {
      setShowIntro(false);
    }, 5000); 

    return () => {
      clearInterval(emojiInterval);
      clearTimeout(introTimeout);
    };
  }, []);

  return (
    <>
      {/* ── 1. INTRO POP-UP ── */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/40 px-6 text-center backdrop-blur-2xl"
          >
            <div className="flex h-72 w-72 items-center justify-center rounded-full bg-white/70 shadow-2xl shadow-sky-200 border border-white/50">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentEmojiIdx}
                  initial={{ opacity: 0, y: 15, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="text-[160px] drop-shadow-xl" 
                >
                  {introEmojis[currentEmojiIdx]}
                </motion.span>
              </AnimatePresence>
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-12 max-w-xl text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl leading-tight drop-shadow-sm"
            >
              I'm here to track your mood, manage your tasks, and <span className="text-sky-500">protect your peace.</span>
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. DASHBOARD UTAMA ── */}
      <div 
        className="min-h-screen p-6 md:p-10 font-sans pb-20"
        style={{ background: "linear-gradient(to bottom right, #7dd3fc 0%, #e0f2fe 50%, #f0f9ff 100%)" }}
      >
        <div className="mx-auto max-w-3xl space-y-8">
          
          {/* HEADER */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              Good evening, Tesalonika. 🌙
            </h1>
            <p className="mt-2 text-slate-700 font-medium">
              Leave the campus chaos at the door. You're in your safe space now.
            </p>
          </motion.div>

          {/* MOOD CHECK-IN */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="rounded-3xl border border-white/80 bg-white/70 p-6 md:p-8 shadow-md backdrop-blur-xl">
            <h2 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 text-lg">
              <Sparkles className="h-5 w-5 text-sky-500" />
              Honestly, how's your energy right now?
            </h2>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {moodOptions.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={`flex flex-col items-center justify-center gap-3 rounded-2xl border p-4 transition-all hover:-translate-y-1 hover:shadow-md ${selectedMood === mood.label ? mood.color + " ring-4 ring-sky-400 ring-offset-2 scale-105" : "border-slate-100 bg-white hover:border-sky-300"}`}
                >
                  <span className="text-4xl drop-shadow-sm">{mood.emoji}</span>
                  <span className="text-xs font-semibold text-slate-700">{mood.label}</span>
                </button>
              ))}
            </div>
            
            {/* ── 4-5 PILIHAN SOLUSI SAAT MOOD DIKLIK ── */}
            {selectedMood && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-inner">
                <div className="p-5 md:p-6">
                  
                  {/* ENERGIZED OPTIONS */}
                  {selectedMood === "Energized" && (
                    <div className="space-y-4">
                      <p className="text-[15px] leading-relaxed text-slate-700 font-medium">You've got that spark today! 🤩 Let's channel this high energy before it fades.</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <button className="flex items-center gap-3 rounded-xl bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-700 transition-all hover:bg-yellow-100 active:scale-95">
                          <Target className="h-5 w-5 text-yellow-500" /> Tackle Priority Tasks
                        </button>
                        <button className="flex items-center gap-3 rounded-xl bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition-all hover:bg-sky-100 active:scale-95">
                          <Timer className="h-5 w-5 text-sky-500" /> Start 25m Deep Work
                        </button>
                        <button className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 active:scale-95">
                          <Folder className="h-5 w-5 text-emerald-500" /> Organize Study Folders
                        </button>
                        <button className="flex items-center gap-3 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition-all hover:bg-rose-100 active:scale-95">
                          <Palette className="h-5 w-5 text-rose-500" /> Work on a Side Project
                        </button>
                        <Link href="/assistant" className="sm:col-span-2">
                          <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition-all hover:bg-indigo-100 active:scale-95">
                            <Lightbulb className="h-5 w-5 text-indigo-500" /> Brainstorm Project Ideas with AI
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* CALM OPTIONS */}
                  {selectedMood === "Calm" && (
                    <div className="space-y-4">
                      <p className="text-[15px] leading-relaxed text-slate-700 font-medium">Nice and steady. 😌 Protect this peace—it's the absolute best state for absorbing information.</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <button className="flex items-center gap-3 rounded-xl bg-sky-50 text-sky-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-sky-100 active:scale-95">
                          <BookOpen className="h-5 w-5 text-sky-500" /> Read Literature Drafts
                        </button>
                        <button className="flex items-center gap-3 rounded-xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-emerald-100 active:scale-95">
                          <Calendar className="h-5 w-5 text-emerald-500" /> Check Upcoming Deadlines
                        </button>
                        <button className="flex items-center gap-3 rounded-xl bg-orange-50 text-orange-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-orange-100 active:scale-95">
                          <LayoutDashboard className="h-5 w-5 text-orange-500" /> Plan Out the Week
                        </button>
                        <button className="flex items-center gap-3 rounded-xl bg-indigo-50 text-indigo-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-indigo-100 active:scale-95">
                          <FileText className="h-5 w-5 text-indigo-500" /> Review Notes for Class
                        </button>
                        <button className="flex items-center justify-center gap-3 rounded-xl bg-purple-50 text-purple-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-purple-100 active:scale-95 sm:col-span-2">
                          <PenTool className="h-5 w-5 text-purple-500" /> Write a Quick Reflection Journal
                        </button>
                      </div>
                    </div>
                  )}

                  {/* OKAY OPTIONS */}
                  {selectedMood === "Okay" && (
                    <div className="space-y-4">
                      <p className="text-[15px] leading-relaxed text-slate-700 font-medium">Not every day has to be a masterpiece. 😐 Just showing up is already a huge win. Keep it light today.</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <button className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 active:scale-95">
                          <Coffee className="h-5 w-5 text-slate-400" /> Do one 10-min task
                        </button>
                        <button className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 active:scale-95">
                          <CheckSquare className="h-5 w-5 text-slate-400" /> Check Off Easy Tasks
                        </button>
                        <button className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 active:scale-95">
                          <Mail className="h-5 w-5 text-slate-400" /> Reply to Emails
                        </button>
                        <button className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 active:scale-95">
                          <GraduationCap className="h-5 w-5 text-slate-400" /> Check Google Classroom
                        </button>
                        <button className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 active:scale-95 sm:col-span-2">
                          <Sparkles className="h-5 w-5 text-slate-400" /> Tidy Up Your Study Desk
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TIRED OPTIONS */}
                  {selectedMood === "Tired" && (
                    <div className="space-y-4">
                      <p className="text-[15px] leading-relaxed text-slate-700 font-medium">Your brain needs a break. 🥱 The assignments can wait until tomorrow. Don't force it.</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <button className="flex items-center gap-3 rounded-xl bg-indigo-50 text-indigo-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-indigo-100 active:scale-95">
                          <Headphones className="h-5 w-5 text-indigo-500" /> Play Relaxing Lo-Fi
                        </button>
                        <button className="flex items-center gap-3 rounded-xl bg-slate-100 text-slate-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-slate-200 active:scale-95">
                          <Moon className="h-5 w-5 text-slate-500" /> Set 20-min Nap Timer
                        </button>
                        <button className="flex items-center gap-3 rounded-xl bg-cyan-50 text-cyan-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-cyan-100 active:scale-95">
                          <Activity className="h-5 w-5 text-cyan-500" /> Drink Water & Stretch
                        </button>
                        <button className="flex items-center gap-3 rounded-xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-emerald-100 active:scale-95">
                          <MonitorPlay className="h-5 w-5 text-emerald-500" /> Watch an Ed-Video Instead
                        </button>
                        <button className="flex items-center justify-center gap-3 rounded-xl bg-rose-50 text-rose-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-rose-100 active:scale-95 sm:col-span-2">
                          <Book className="h-5 w-5 text-rose-500" /> Read a Fun Book (Not for Class)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* BURNOUT OPTIONS */}
                  {selectedMood === "Burnout" && (
                    <div className="space-y-4">
                      <p className="text-[15px] leading-relaxed text-slate-700 font-medium">You're running on empty. 😵‍💫 Step away from the screen. Your mental health is the top priority right now.</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Link href="/assistant">
                          <button className="flex w-full items-center gap-3 rounded-xl bg-orange-100 text-orange-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-orange-200 active:scale-95">
                            <Bot className="h-5 w-5 text-orange-500" /> Vent to Study Buddy
                          </button>
                        </Link>
                        <button className="flex items-center gap-3 rounded-xl bg-rose-50 text-rose-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-rose-100 active:scale-95">
                          <BellOff className="h-5 w-5 text-rose-500" /> Mute Notifications
                        </button>
                        <button className="flex items-center gap-3 rounded-xl bg-yellow-50 text-yellow-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-yellow-100 active:scale-95">
                          <Sun className="h-5 w-5 text-yellow-500" /> Take a Walk Outside
                        </button>
                        <button className="flex items-center gap-3 rounded-xl bg-pink-50 text-pink-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-pink-100 active:scale-95">
                          <Heart className="h-5 w-5 text-pink-500" /> Guided Meditation
                        </button>
                        <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 text-white px-4 py-3 text-sm font-semibold transition-all hover:bg-slate-900 active:scale-95 sm:col-span-2">
                          <Power className="h-5 w-5 text-slate-300" /> Close Laptop & Rest Today
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ANXIOUS OPTIONS */}
                  {selectedMood === "Anxious" && (
                    <div className="space-y-4">
                      <p className="text-[15px] leading-relaxed text-slate-700 font-medium">It feels heavy, but you don't have to figure it all out today. 😰 Breathe. Let's break it down.</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Link href="/assistant">
                          <button className="flex w-full items-center gap-3 rounded-xl bg-teal-50 text-teal-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-teal-100 active:scale-95">
                            <ListTodo className="h-5 w-5 text-teal-500" /> Help me plan my day
                          </button>
                        </Link>
                        <button className="flex items-center gap-3 rounded-xl bg-sky-50 text-sky-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-sky-100 active:scale-95">
                          <Wind className="h-5 w-5 text-sky-500" /> 3-Minute Breathing
                        </button>
                        <button className="flex items-center gap-3 rounded-xl bg-indigo-50 text-indigo-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-indigo-100 active:scale-95">
                          <PenTool className="h-5 w-5 text-indigo-500" /> Brain Dump Worries
                        </button>
                        <button className="flex items-center gap-3 rounded-xl bg-rose-50 text-rose-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-rose-100 active:scale-95">
                          <Users className="h-5 w-5 text-rose-500" /> Text a Study Friend
                        </button>
                        <Link href="/assistant" className="sm:col-span-2">
                          <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-semibold transition-all hover:bg-emerald-100 active:scale-95">
                            <Bot className="h-5 w-5 text-emerald-500" /> Break Down Reading into Tiny Steps
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </motion.div>

          {/* CONNECT GOOGLE CLASSROOM */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <button className="group flex w-full items-center gap-5 rounded-3xl border border-white/80 bg-white/70 p-6 shadow-md backdrop-blur-xl transition-all hover:border-emerald-300 hover:bg-emerald-50 active:scale-[0.99]">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-emerald-800">Connect Google Classroom</h3>
                <p className="text-sm text-slate-600 group-hover:text-emerald-600 mt-1">Sync your assignments automatically and stay ahead of deadlines.</p>
              </div>
              <ArrowRight className="h-6 w-6 text-slate-400 group-hover:text-emerald-500" />
            </button>
          </motion.div>

          {/* RANDOM QUOTES SECTION */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-col justify-center rounded-3xl border border-sky-100 bg-white/60 p-8 shadow-md backdrop-blur-md">
            <Quote className="mb-4 h-8 w-8 text-sky-400" />
            <p className="text-lg italic text-slate-800 leading-relaxed font-serif">
              "{randomQuote.text}"
            </p>
            <p className="mt-4 text-sm font-bold text-sky-600 uppercase tracking-widest">
              — {randomQuote.author}
            </p>
          </motion.div>

        </div>
      </div>
    </>
  );
}