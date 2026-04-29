"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, User, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleRegister = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/classroom.courses.readonly',
        queryParams: { access_type: 'offline', prompt: 'consent' },
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) console.error(error.message);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering with:", { username, email, password });
    // Tambahkan logic Supabase signUp di sini nanti
  };

  return (
    <div className="min-h-screen bg-[#061828] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl relative z-10 overflow-hidden border border-white/10">
        <div className="h-2 w-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500" />
        
        <div className="p-8 md:p-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-500 transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Back
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <img src="/icon.png" alt="Fi-Mind Logo" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Join Fi-Mind</h1>
              <p className="text-slate-500 text-sm font-medium">Start your academic journey today.</p>
            </div>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="tesatamba"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-300 transition-all"
                  required
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
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-300 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-300 transition-all"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 py-4 rounded-2xl text-white font-bold text-sm shadow-lg shadow-slate-200 hover:bg-sky-600 transition-all active:scale-[0.98] mt-4"
            >
              Create Account
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]"><span className="bg-white px-4 text-slate-300">or sign up with</span></div>
          </div>

          <button 
            onClick={handleGoogleRegister}
            className="group w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white py-4 font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5" alt="Google" />
            Google
          </button>

          <div className="mt-8 flex flex-col items-center justify-center gap-2 text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Secured Connection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}