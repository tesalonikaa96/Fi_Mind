"use client";
import { useState } from "react";
import { 
  TrendingUp, GraduationCap, Briefcase, Award, 
  Map, Search, ArrowRight, Star, ChevronDown, 
  Target, MessageSquare, X, Send 
} from "lucide-react"; // Semua ikon sudah ditambahkan di sini
import { motion, AnimatePresence } from "framer-motion";

// ── DATA MOCK UNTUK 6 PILIHAN ──
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const newHistory = [...chatHistory, { role: "user", text: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage("");
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        role: "ai", 
        text: "That's a solid answer! Remember to focus on the impact your work had. Let's try another question..." 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8 font-sans">
      <div className="mx-auto max-w-6xl">
        
        {/* Header */}
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-extrabold text-sky-950"
            >
              Future Path Dashboard
            </motion.h1>
            <motion.p className="text-sky-700/70 font-medium mt-1">
              Personalized career tracking for {selectedMajor} majors.
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
            <select 
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value as MajorType)}
              className="appearance-none bg-white border border-sky-200 text-sky-900 font-semibold py-2.5 pl-4 pr-10 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              {Object.keys(CAREER_DATA).map(major => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-sky-500 pointer-events-none" />
          </motion.div>
        </header>

        <div className="grid gap-6 md:grid-cols-12">
          
          {/* Kolom Kiri */}
          <div className="space-y-6 md:col-span-7">
            <motion.div key={`tracker-${selectedMajor}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="overflow-hidden rounded-3xl bg-white border border-sky-100 shadow-sm">
              <div className="bg-gradient-to-r from-sky-600 to-sky-400 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-sky-100" />
                  <h2 className="text-lg font-semibold">Performance Tracker</h2>
                </div>
                <p className="text-sky-50 text-sm">Top Recommendation:</p>
                <h3 className="mt-2 text-4xl font-bold">{currentData.performance.topMatch}</h3>
              </div>
              <div className="p-6">
                <div className="flex justify-between text-sm font-medium text-sky-900 mb-2">
                  <span>Job Matching Progress</span>
                  <span>{currentData.performance.progress}%</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${currentData.performance.progress}%` }} transition={{ duration: 1 }}
                    className="h-full bg-sky-500 rounded-full shadow-[0_0_12px_rgba(14,165,233,0.5)]"
                  />
                </div>
              </div>
            </motion.div>

            <div className="rounded-3xl bg-white border border-sky-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <Map className="w-5 h-5 text-sky-600" />
                <h2 className="text-xl font-bold text-sky-950">Industry Learning Path</h2>
              </div>
              <div className="relative pl-4 border-l-2 border-sky-100 space-y-6 ml-2">
                {currentData.path.map((step, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-4 border-white ${step.status === 'completed' ? 'bg-emerald-400' : step.status === 'current' ? 'bg-sky-500 ring-4 ring-sky-100' : 'bg-slate-300'}`} />
                    <h4 className="font-bold text-sky-900">{step.title}</h4>
                    <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6 md:col-span-5">
            <div className="rounded-3xl bg-white border border-sky-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-sky-950">Skill Gap Meter</h2>
              </div>
              <div className="space-y-5">
                {currentData.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider text-sky-800">
                      <span>{skill.name}</span>
                      <span>{skill.current}%</span>
                    </div>
                    <div className="relative h-2 w-full bg-slate-100 rounded-full">
                      <div className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10" style={{ left: `${skill.required}%` }} title="Required Level" />
                      <motion.div initial={{ width: 0 }} animate={{ width: `${skill.current}%` }} className={`h-full rounded-full ${skill.current >= skill.required ? 'bg-emerald-400' : 'bg-sky-400'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-sky-200 bg-gradient-to-br from-white to-sky-50 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-sky-600" />
                <h2 className="text-xl font-bold text-sky-950">AI Study Buddy</h2>
              </div>
              <p className="text-sm text-slate-600 mb-4">Ready for a mock interview for <strong>{currentData.performance.topMatch}</strong>?</p>
              <button onClick={handleStartInterview} className="w-full rounded-2xl bg-sky-950 py-4 font-bold text-white shadow-xl hover:bg-sky-800 transition-all active:scale-95">
                Launch Mock Interview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL INTERVIEW ── */}
      <AnimatePresence>
        {isInterviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh]"
            >
              <div className="bg-sky-950 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bot className="w-6 h-6" />
                  <span className="font-bold">Mock Interview: {currentData.performance.topMatch}</span>
                </div>
                <button onClick={() => setIsInterviewOpen(false)} className="hover:bg-white/10 p-1 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-sky-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input 
                  type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your answer..."
                  className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
                <button type="submit" className="bg-sky-600 text-white p-3 rounded-xl hover:bg-sky-700 transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Tambahkan komponen Bot ini jika belum ada (atau impor dari lucide)
function Bot({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
}