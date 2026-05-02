"use client";
import { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, Map, Search, ArrowRight, ChevronDown, 
  Target, MessageSquare, X, Send, ShieldCheck, ChevronRight
} from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

// ── COMPONENT: FIMI THE FOX ──
const FimiMascotSVG = ({ isTalking }: { isTalking: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const CAREER_DATA = {
  "Information Technology (IT)": {
    performance: { totalAssignments: 35, avgScore: 90, topMatch: "DevOps Engineer", progress: 82 },
    skills: [
      { name: "Cloud Computing", current: 85, required: 90 },
      { name: "Network Security", current: 60, required: 85 },
      { name: "Scripting (Python/Bash)", current: 40, required: 75 },
    ],
    path: [
      { title: "Core Networking", desc: "Understand TCP/IP and DNS.", status: "completed" },
      { title: "Docker & K8s", desc: "Master containerization basics.", status: "current" },
      { title: "AWS Cert", desc: "Get AWS Solutions Architect Cert.", status: "upcoming" },
    ],
    scholarships: ["Google Tech Scholarship", "NVIDIA AI Graduate Fellowship"]
  },
  "Information Systems (IS)": {
    performance: { totalAssignments: 28, avgScore: 87, topMatch: "Business IT Analyst", progress: 78 },
    skills: [
      { name: "Data Governance", current: 80, required: 90 },
      { name: "ERP Systems (SAP)", current: 55, required: 85 },
      { name: "UI/UX Strategy", current: 35, required: 70 },
    ],
    path: [
      { title: "Business Process", desc: "Mapping business workflows.", status: "completed" },
      { title: "Data Visualization", desc: "Mastering Tableau or PowerBI.", status: "current" },
      { title: "Project Management", desc: "Take Scrum Master Certification.", status: "upcoming" },
    ],
    scholarships: ["Chevening (Data Science)", "Erasmus Mundus (Digital Business)"]
  },
  "English Literature": {
    performance: { totalAssignments: 24, avgScore: 88, topMatch: "Content Strategist", progress: 75 },
    skills: [
      { name: "Copywriting", current: 90, required: 95 },
      { name: "SEO Basics", current: 40, required: 80 },
      { name: "Data Analytics", current: 15, required: 60 },
    ],
    path: [
      { title: "Foundation", desc: "Complete core literature modules.", status: "completed" },
      { title: "Portfolio Building", desc: "Publish 3 articles on Medium.", status: "current" },
      { title: "Certification", desc: "Take Google SEO Fundamentals.", status: "upcoming" },
    ],
    scholarships: ["LPDP Reguler (Humanities)", "Fulbright Master's Program"]
  },
  "Visual Communication Design": {
    performance: { totalAssignments: 18, avgScore: 85, topMatch: "UI/UX Designer", progress: 65 },
    skills: [
      { name: "Graphic Design", current: 88, required: 90 },
      { name: "Figma Prototyping", current: 60, required: 85 },
      { name: "User Research", current: 30, required: 75 },
    ],
    path: [
      { title: "Design Principles", desc: "Master typography & layout.", status: "completed" },
      { title: "Behance Portfolio", desc: "Upload 3 comprehensive case studies.", status: "current" },
      { title: "UX Certification", desc: "Google UX Design Certificate.", status: "upcoming" },
    ],
    scholarships: ["MEXT Scholarship (Arts)", "Adobe Design Grant"]
  },
  "Accounting": {
    performance: { totalAssignments: 40, avgScore: 89, topMatch: "Financial Auditor", progress: 80 },
    skills: [
      { name: "Financial Reporting", current: 90, required: 95 },
      { name: "Tax Law", current: 65, required: 85 },
      { name: "Advanced Excel", current: 45, required: 80 },
    ],
    path: [
      { title: "Basic Accounting", desc: "Master balance sheets.", status: "completed" },
      { title: "CPA Prep", desc: "Study group for CPA preliminary.", status: "current" },
      { title: "Big 4 Internship", desc: "Apply for audit intern roles.", status: "upcoming" },
    ],
    scholarships: ["KPMG Future Leaders", "Chevening (Finance)"]
  },
  "Japanese Literature": {
    performance: { totalAssignments: 22, avgScore: 91, topMatch: "Localization Specialist", progress: 70 },
    skills: [
      { name: "JLPT N2/N1", current: 75, required: 90 },
      { name: "Cultural Etiquette", current: 85, required: 95 },
      { name: "Translation Tech", current: 20, required: 70 },
    ],
    path: [
      { title: "Language Mastery", desc: "Achieve JLPT N3/N2 level.", status: "completed" },
      { title: "Translation Project", desc: "Subtitle a short indie film.", status: "current" },
      { title: "Exchange Program", desc: "Apply for 1-semester in Japan.", status: "upcoming" },
    ],
    scholarships: ["MEXT (Japanese Studies)", "JASSO Scholarship"]
  }
};

type MajorType = keyof typeof CAREER_DATA;

export default function CareerPage() {
  const [selectedMajor, setSelectedMajor] = useState<MajorType>("Information Technology (IT)");
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState("Tesalonika");

  const [showFimi, setShowFimi] = useState(false);
  const [fimiStep, setFimiStep] = useState(0);
  const fimiDialogues = useMemo(() => [
    `Hi ${userName}! 🦊 I'm analyzing your career roadmap.`,
    "Based on your assignments, I've identified your top career match.",
    "Ready to practice? Let's launch a mock interview whenever you're ready! ✨"
  ], [userName]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.full_name) {
        setUserName(session.user.user_metadata.full_name.split(' ')[0]);
      }
    });

    const sessionFimiShown = sessionStorage.getItem("careerFimiShown");
    if (!sessionFimiShown) {
      setTimeout(() => setShowFimi(true), 1500);
      sessionStorage.setItem("careerFimiShown", "true");
    }
  }, []);

  const currentData = CAREER_DATA[selectedMajor];

  const handleStartInterview = () => {
    setIsInterviewOpen(true);
    setChatHistory([
      { 
        role: "ai", 
        text: `Hi! I'm your AI Study Buddy. Let's practice for the ${currentData.performance.topMatch} role. How would you explain your experience in ${selectedMajor} to a recruiter?` 
      }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
  
    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: "user", text: userMsg }]);
    setChatMessage("");
    setIsTyping(true);
  
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          major: selectedMajor,
          role: currentData.performance.topMatch
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setChatHistory(prev => [...prev, { role: "ai", text: data.reply }]);
      } else {
        throw new Error("No reply");
      }
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        role: "ai", 
        text: "Sorry, my connection is a bit unstable. Could you repeat that?" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-10 pb-24 relative overflow-hidden bg-[#F0F7FF] dark:bg-slate-950 transition-colors duration-500">
      
      {/* ── BACKGROUND MESH ── */}
      <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-20">
         <div className="absolute -top-48 -right-48 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-300 rounded-full blur-[100px] sm:blur-[120px]" />
         <div className="absolute top-1/2 -left-48 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-300 rounded-full blur-[100px] sm:blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl relative z-10">
        
        {/* HEADER - Responsive Layout */}
        <header className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left">
            <motion.h1 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic"
            >
              Future Path Dashboard
            </motion.h1>
            <p className="text-blue-700 font-black uppercase tracking-[0.2em] text-[8px] mt-1 flex items-center gap-2">
              <ShieldCheck size={12} /> Career Tracking: Synced
            </p>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative w-full md:w-auto">
            <select 
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value as MajorType)}
              className="appearance-none w-full bg-white/80 backdrop-blur-md border-2 border-white text-slate-900 font-black text-[10px] sm:text-xs py-3.5 sm:py-4 pl-5 pr-12 rounded-[20px] shadow-xl focus:outline-none cursor-pointer uppercase tracking-widest"
            >
              {Object.keys(CAREER_DATA).map(major => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 pointer-events-none" />
          </motion.div>
        </header>

        {/* MAIN GRID - Responsive Columns */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          
          {/* KOLOM KIRI (7 Col on Desktop) */}
          <div className="space-y-6 lg:col-span-7">
            <motion.div key={`tracker-${selectedMajor}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="overflow-hidden rounded-[32px] sm:rounded-[40px] bg-white/90 backdrop-blur-xl border-2 border-white shadow-2xl">
              <div className="bg-blue-800 p-6 sm:p-10 text-white relative overflow-hidden text-left">
                <div className="relative z-10 flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-200" />
                  <h2 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">Performance Tracker</h2>
                </div>
                <div className="relative z-10">
                   <p className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Top Recommendation:</p>
                   <h3 className="mt-2 text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter italic">{currentData.performance.topMatch}</h3>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              </div>
              <div className="p-6 sm:p-10 text-left">
                <div className="flex justify-between text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  <span>Job Matching Progress</span>
                  <span className="text-blue-700">{currentData.performance.progress}%</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${currentData.performance.progress}%` }} transition={{ duration: 1 }}
                    className="h-full bg-blue-700 rounded-full shadow-lg"
                  />
                </div>
              </div>
            </motion.div>

            <div className="rounded-[32px] sm:rounded-[40px] bg-white/90 backdrop-blur-xl border-2 border-white shadow-2xl p-6 sm:p-10 text-left">
              <div className="flex items-center gap-3 mb-8 sm:mb-10">
                <div className="h-9 w-9 sm:h-11 sm:w-11 bg-blue-50 text-blue-800 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Map className="w-5 h-5" />
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tighter">Industry Learning Path</h2>
              </div>
              <div className="relative pl-4 border-l-2 border-blue-100 space-y-8 sm:space-y-10 ml-2">
                {currentData.path.map((step, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className={`absolute -left-[33px] sm:-left-[34px] top-1 h-5 w-5 rounded-full border-4 border-white shadow-md ${step.status === 'completed' ? 'bg-emerald-500' : step.status === 'current' ? 'bg-blue-700 ring-4 ring-blue-100' : 'bg-slate-200'}`} />
                    <h4 className="font-black text-slate-900 text-sm sm:text-base">{step.title}</h4>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-400 mt-1">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (5 Col on Desktop) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-[32px] sm:rounded-[40px] bg-white/90 backdrop-blur-xl border-2 border-white shadow-2xl p-6 sm:p-10 text-left">
              <div className="flex items-center gap-3 mb-8">
                 <div className="h-9 w-9 sm:h-11 sm:w-11 bg-blue-50 text-blue-800 rounded-xl sm:rounded-2xl flex items-center justify-center">
                   <Target className="w-5 h-5" />
                 </div>
                <h2 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tighter">Skill Gap Meter</h2>
              </div>
              <div className="space-y-6 sm:space-y-8">
                {currentData.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-[8px] sm:text-[9px] font-black mb-2 uppercase tracking-widest text-slate-400">
                      <span>{skill.name}</span>
                      <span className="text-blue-700">{skill.current}%</span>
                    </div>
                    <div className="relative h-2.5 w-full bg-slate-100 rounded-full">
                      <div className="absolute top-0 bottom-0 w-1 bg-rose-500 z-10 rounded-full" style={{ left: `${skill.required}%` }} title="Required Level" />
                      <motion.div initial={{ width: 0 }} animate={{ width: `${skill.current}%` }} className={`h-full rounded-full ${skill.current >= skill.required ? 'bg-emerald-500' : 'bg-blue-700'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] sm:rounded-[40px] border-2 border-white bg-slate-900 p-6 sm:p-10 shadow-2xl relative overflow-hidden text-left group">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-10 w-10 sm:h-14 sm:w-14 bg-blue-800 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tighter uppercase italic">AI Interview Buddy</h2>
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-slate-400 mb-8 leading-relaxed">Ready for a professional mock interview for <strong className="text-blue-400">{currentData.performance.topMatch}</strong>?</p>
                <button onClick={handleStartInterview} className="w-full rounded-xl sm:rounded-2xl bg-blue-700 py-4 sm:py-5 font-black text-[10px] sm:text-xs uppercase tracking-widest text-white shadow-xl hover:bg-blue-600 transition-all active:scale-95">
                  Launch Mock Interview
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            </div>
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
              className="relative z-[260] flex items-end gap-3 sm:gap-5 max-w-[calc(100%-2rem)] sm:max-w-sm w-full pointer-events-auto text-left"
            >
              <div className="bg-white p-5 sm:p-7 rounded-[28px] sm:rounded-[32px] rounded-br-sm shadow-2xl border-2 border-blue-200 relative flex-1 mb-6 sm:mb-10">
                <p className="text-slate-800 text-xs sm:text-sm font-bold leading-relaxed">{fimiDialogues[fimiStep]}</p>
                <button onClick={() => fimiStep < fimiDialogues.length - 1 ? setFimiStep(s => s + 1) : setShowFimi(false)} className="mt-5 w-full bg-blue-800 text-white font-black text-[10px] py-4 rounded-xl uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95">
                  {fimiStep < fimiDialogues.length - 1 ? "Next" : "Got it!"} <ChevronRight size={14} />
                </button>
                <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white border-b-2 border-r-2 border-blue-200 transform rotate-45" />
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 mb-6 sm:mb-10"><FimiMascotSVG isTalking={true} /></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MOCK INTERVIEW MODAL (Full Responsive) ── */}
      <AnimatePresence>
        {isInterviewOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="w-full max-w-2xl bg-white rounded-[32px] sm:rounded-[48px] shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-[80vh] border-2 border-white"
            >
              <div className="bg-slate-900 p-5 sm:p-6 text-white flex justify-between items-center text-left">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-800 rounded-xl flex items-center justify-center shadow-lg"><MessageSquare className="w-6 h-6" /></div>
                  <div className="min-w-0">
                     <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Mock Interview</span>
                     <h4 className="font-black text-xs sm:text-sm tracking-tighter truncate">{currentData.performance.topMatch}</h4>
                  </div>
                </div>
                <button onClick={() => setIsInterviewOpen(false)} className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all shrink-0">
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-slate-50 text-left scrollbar-hide">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] sm:max-w-[85%] p-4 sm:p-5 rounded-[22px] sm:rounded-[28px] text-[13px] sm:text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'bg-blue-800 text-white rounded-tr-none' : 'bg-white border-2 border-slate-100 text-slate-800 rounded-tl-none shadow-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border-2 border-slate-100 p-4 rounded-[22px] rounded-tl-none shadow-sm flex gap-1.5 items-center h-10 sm:h-12">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 sm:p-6 bg-white border-t-2 border-slate-50 flex gap-2 sm:gap-3">
                <input 
                  type="text" 
                  value={chatMessage} 
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your response..."
                  disabled={isTyping}
                  className="flex-1 bg-slate-100 border-2 border-transparent rounded-[18px] sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 focus:ring-2 focus:ring-blue-500 text-slate-800 font-bold text-sm outline-none transition-all"
                />
                <button 
                  type="submit" 
                  disabled={isTyping}
                  className="bg-blue-800 text-white p-3.5 sm:p-4 rounded-[18px] sm:rounded-2xl hover:bg-blue-700 transition-all shadow-xl active:scale-95 disabled:opacity-50 shrink-0"
                >
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}