"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, Mail, User, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase"; 

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
        queryParams: { access_type: 'offline', prompt: 'consent' },
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) console.error(error.message);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { username, email });
    // Nanti di sini kamu bisa tambah logic login manual ke Supabase
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xl"
          />

          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-md rounded-[40px] border border-white/20 bg-white shadow-2xl pointer-events-auto relative overflow-hidden"
            >
              <div className="h-2 w-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500" />
              
              <button onClick={onClose} className="absolute right-6 top-8 text-slate-300 hover:text-slate-600 transition-colors z-20">
                <X size={24} />
              </button>

              <div className="p-8 md:p-10 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Sparkles size={32} />
                </div>

                <h2 className="text-3xl font-black text-slate-800 tracking-tighter">FI-Mind</h2>
                <p className="mt-2 text-slate-500 font-medium text-sm">Enter your details to access your sanctuary.</p>

                {/* --- MANUAL FORM --- */}
                <form onSubmit={handleManualSubmit} className="mt-8 space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="tesatamba"
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tesa@example.com"
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-300"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-sky-600 py-4 rounded-2xl text-white font-bold text-sm shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all active:scale-[0.98] mt-2"
                  >
                    Enter Sanctuary
                  </button>
                </form>

                {/* --- DIVIDER --- */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]"><span className="bg-white px-4 text-slate-300">or connect with</span></div>
                </div>

                {/* --- SSO BUTTON --- */}
                <button 
                  onClick={handleGoogleLogin}
                  className="group w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white py-4 font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5" alt="Google" />
                  Continue with Google
                </button>

                <div className="mt-8 flex items-center justify-center gap-2 text-slate-300">
                  <ShieldCheck size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encryption</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                <p className="text-[11px] text-slate-400 font-medium">
                  By joining FI-Mind, you agree to our <span className="text-sky-600 cursor-pointer">Privacy Policy</span>.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}