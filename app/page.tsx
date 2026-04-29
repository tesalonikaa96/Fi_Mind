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
      className="relative flex min-h-screen flex-col overflow-hidden font-sans"
      style={{ background: "#061828" }} 
    >
      <WaterRippleBackground />

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

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          {/* Logo Menggunakan Gambar icon.png */}
          <img 
            src="/icon.png" 
            alt="Fi-Mind Logo" 
            className="h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]"
          />
          <span className="drop-shadow text-xl font-bold tracking-tight text-white">Fi-Mind</span>
        </motion.div>

        {/* Tombol Sign In di kanan atas telah dihapus agar tampilan lebih bersih */}
      </nav>

      {/* ── Hero ── */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Badge "Touch or move your cursor" telah dihapus */}

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl text-5xl font-extrabold leading-[1.15] sm:text-6xl md:text-7xl"
          style={{ color: "#f0f9ff" }}
        >
          Less stress, more focus.{" "}
          <br />
          <span
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
          className="mt-6 max-w-xl text-lg font-medium"
          style={{ color: "rgba(186,230,253,0.8)" }}
        >
          Fi-Mind helps you manage academic loads, track your emotional wellbeing,
          and plan your career — all in one calming space.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10"
        >
          <button
            onClick={() => setIsLoginOpen(true)}
            className="rounded-2xl px-10 py-4 text-lg font-semibold text-white transition-all active:scale-[0.97] hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
              boxShadow: "0 8px 32px rgba(14,165,233,0.45), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            Join with us
          </button>
        </motion.div>

        {/* ── Feature Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 pointer-events-none"
        >
          {[
            { icon: <Brain className="h-6 w-6" />, title: "Mood Tracking", desc: "Detect your emotions and get timely support to prevent academic burnout.", accent: "#38bdf8", bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.2)" },
            { icon: <Briefcase className="h-6 w-6" />, title: "Career Planning", desc: "Personalized job paths and scholarships based on your specific major.", accent: "#818cf8", bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.2)" },
            { icon: <GraduationCap className="h-6 w-6" />, title: "Classroom Sync", desc: "Integrate assignments seamlessly from Google Classroom into one view.", accent: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
            { icon: <Bot className="h-6 w-6" />, title: "AI Study Buddy", desc: "Friendly AI chatbot ready to assist you 24/7 with questions and interview prep.", accent: "#f472b6", bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.2)" },
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 + i * 0.08 }}
              className="flex flex-col items-center rounded-3xl p-6 text-center transition-all hover:-translate-y-1"
              style={{ background: feat.bg, border: `1px solid ${feat.border}`, backdropFilter: "blur(16px)" }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${feat.accent}22`, color: feat.accent, boxShadow: `0 0 16px ${feat.accent}33` }}>
                {feat.icon}
              </div>
              <h3 className="font-semibold text-white">{feat.title}</h3>
              <p className="mt-2 text-sm" style={{ color: "rgba(186,230,253,0.65)" }}>{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="relative z-10 py-8 text-center text-sm font-medium" style={{ color: "rgba(186,230,253,0.4)" }}>
        © 2026 Fi-Mind. Designed for students, by students.
      </footer>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </div>
  );
}