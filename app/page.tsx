"use client";
import { useState } from "react";
import { Brain, Briefcase, GraduationCap, Bot } from "lucide-react";
import { motion } from "framer-motion";
import WaterRippleBackground from "@/components/WaterRippleBackground"; 
import LoginModal from "@/components/LoginModal"; 

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden font-sans selection:bg-sky-500/30"
      style={{ background: "#061828" }} 
    >
      <WaterRippleBackground />

      {/* ── BACKGROUND OVERLAYS (Adaptive for all screens) ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 30%, rgba(6,24,40,0.55) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(4,15,28,0.7) 100%)",
        }}
      />

      {/* ── NAVBAR ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-6 md:py-10">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <img 
            src="/icon.png" 
            alt="Fi-Mind Logo" 
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]"
          />
          <span className="text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-sm">Fi-Mind</span>
        </motion.div>
      </nav>

      {/* ── HERO CONTENT (Laptop: Large Text | Mobile: Scaled Text) ── */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 text-center md:py-24">
        
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.2] tracking-tight"
          style={{ color: "#f0f9ff" }}
        >
          Less stress, more focus.{" "}
          <br className="hidden sm:block" />
          <span
            className="inline-block mt-2 sm:mt-4"
            style={{
              background: "linear-gradient(90deg, #38bdf8, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 24px rgba(56,189,248,0.35))",
            }}
          >
            Protect your peace.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-xl text-sm sm:text-lg md:text-xl font-medium leading-relaxed opacity-80"
          style={{ color: "rgba(186,230,253,0.8)" }}
        >
          Fi-Mind helps you manage academic loads, track your emotional wellbeing,
          and plan your career — all in one calming space.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 sm:mt-14"
        >
          <button
            onClick={() => setIsLoginOpen(true)}
            className="rounded-2xl px-10 sm:px-14 py-4 sm:py-5 text-sm sm:text-lg font-bold text-white transition-all active:scale-[0.97] hover:scale-[1.05] hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
              boxShadow: "0 8px 32px rgba(14,165,233,0.4), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            Join with us
          </button>
        </motion.div>

        {/* ── FEATURE CARDS GRID (1 Col Mobile | 2 Col Tablet | 4 Col Laptop) ── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 sm:mt-32 lg:mt-40 grid w-full max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {[
            { icon: <Brain className="h-6 w-6" />, title: "Mood Tracking", desc: "Detect your emotions and get support to prevent academic burnout.", accent: "#38bdf8", bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.2)" },
            { icon: <Briefcase className="h-6 w-6" />, title: "Career Planning", desc: "Personalized job paths and scholarships based on your specific major.", accent: "#818cf8", bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.2)" },
            { icon: <GraduationCap className="h-6 w-6" />, title: "Classroom Sync", desc: "Integrate assignments seamlessly from Google Classroom into one view.", accent: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
            { icon: <Bot className="h-6 w-6" />, title: "AI Study Buddy", desc: "Friendly AI assistant ready to help with questions and interview prep 24/7.", accent: "#f472b6", bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.2)" },
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 + i * 0.08 }}
              className="group flex flex-col items-center rounded-[32px] p-8 text-center transition-all hover:bg-white/5 border border-transparent"
              style={{ background: feat.bg, borderColor: feat.border, backdropFilter: "blur(12px)" }}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110" style={{ background: `${feat.accent}22`, color: feat.accent, boxShadow: `0 0 16px ${feat.accent}33` }}>
                {feat.icon}
              </div>
              <h3 className="font-bold text-white text-base sm:text-lg tracking-tight">{feat.title}</h3>
              <p className="mt-3 text-xs sm:text-sm font-medium leading-relaxed" style={{ color: "rgba(186,230,253,0.6)" }}>{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-12 px-6 text-center text-[9px] sm:text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "rgba(186,230,253,0.2)" }}>
        © 2026 Fi-Mind. Designed for students, by students.
      </footer>

      {/* ── MODALS ── */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </div>
  );
}