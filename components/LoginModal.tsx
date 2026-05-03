"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase"; 
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); 

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly',
        queryParams: { 
          access_type: 'offline', 
          prompt: 'consent' 
        },
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) console.error(error.message);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      if (data.session) {
        onClose();
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login Error:", err.message);

      // Logika pesan error yang lebih cerdas
      if (err.message.includes("Invalid login credentials")) {
        setErrorMsg("Email atau password salah. Jika kamu sebelumnya daftar pakai Google, silakan buat password dulu melalui halaman Register.");
      } else if (err.message.includes("Email not confirmed")) {
        setErrorMsg("Email kamu belum dikonfirmasi. Silakan cek inbox/spam email kamu.");
      } else {
        setErrorMsg(err.message || "Gagal masuk. Coba lagi nanti.");
      }
    } finally {
      setIsLoading(false);
    }
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
              className="w-full max-w-md rounded-[40px] border border-white/20 bg-white shadow-2xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh]"
            >
              <div className="h-2 w-full shrink-0 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500" />
              
              <button onClick={onClose} className="absolute right-6 top-8 text-slate-300 hover:text-slate-600 transition-colors z-20">
                <X size={24} />
              </button>

              <div className="p-8 md:p-10 text-center overflow-y-auto custom-scrollbar">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50/50 shadow-inner">
                  <img src="/icon.png" alt="Fi-Mind Logo" className="h-10 w-10 object-contain drop-shadow-sm" />
                </div>

                <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Fi-Mind</h2>
                <p className="mt-2 text-slate-500 font-medium text-sm">Welcome back to your academic sanctuary.</p>

                {errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-500 text-[11px] font-bold">
                    {errorMsg}
                  </motion.div>
                )}

                <form onSubmit={handleManualSubmit} className="mt-6 space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity (Email)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@jiu.ac"
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sanctuary Key (Password)</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-300"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-sky-600 py-4 rounded-2xl text-white font-bold text-sm shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all active:scale-[0.98] mt-2 disabled:bg-sky-400"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                    {isLoading ? "Synchronizing..." : "Enter Sanctuary"}
                  </button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]"><span className="bg-white px-4 text-slate-300">Fast Access</span></div>
                </div>

                <button 
                  onClick={handleGoogleLogin}
                  type="button"
                  className="group w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white py-4 font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5" alt="Google" />
                  Continue with Google
                </button>
              </div>

              <div className="bg-slate-50 p-6 text-center border-t border-slate-100 shrink-0">
                <p className="text-sm text-slate-500 font-medium">
                  New student?{" "}
                  <Link href="/register" onClick={onClose} className="text-sky-600 font-bold hover:underline">
                    Register here
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}