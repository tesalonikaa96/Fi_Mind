"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, User, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { full_name: username } }
      });

      if (error) throw error;

      if (data.user) {
        setSuccessMsg("Account created! Opening login sanctuary...");
        
        // Sign out dulu agar tidak auto-login
        await supabase.auth.signOut();
        
        // Redirect ke Home sambil membawa perintah "?login=true"
        setTimeout(() => {
          router.push("/?login=true");
        }, 2000);
      }

      setEmail("");
      setUsername("");
      setPassword("");

    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#061828] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl relative z-10 overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500" />
        
        <div className="p-8 md:p-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-500 transition-colors mb-8 text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft size={16} /> Cancel
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center border border-sky-100 shadow-inner">
              <img src="/icon.png" alt="Logo" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Create Account</h1>
              <p className="text-slate-500 text-sm font-medium">Join Fi-Mind sanctuary.</p>
            </div>
          </div>

          {errorMsg && <div className="mb-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-xs font-bold">{errorMsg}</div>}
          {successMsg && <div className="mb-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-xs font-bold">{successMsg}</div>}

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Tesalonika Tamba" className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-sky-100 transition-all" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@jiu.ac" className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-sky-100 transition-all" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-sky-100 transition-all" required minLength={6} />
              </div>
            </div>

            <button disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 rounded-2xl text-white font-bold text-sm shadow-xl hover:bg-sky-600 transition-all mt-4 disabled:bg-slate-400">
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Confirm & Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}