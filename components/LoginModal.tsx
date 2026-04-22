"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // --- SETUP CREDENTIALS ---
  const VALID_EMAIL = "tesalonika@jiu.ac.id";
  const VALID_PASSWORD = "password123";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) return;

    setIsLoading(true);

    setTimeout(() => {
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        setIsLoading(false);
        router.push("/dashboard");
      } else {
        setIsLoading(false);
        setError("Email atau password salah. Silakan coba lagi.");
      }
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* Latar Belakang Gelap / Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // Tutup jika area luar diklik
            className="absolute inset-0 bg-[#061828]/60 backdrop-blur-md cursor-pointer"
          />

          {/* Kotak Form Login */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-sm rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-xl"
          >
            {/* Tombol Tutup (X) */}
            <button 
              onClick={onClose}
              className="absolute right-5 top-5 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-8 mt-2 flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 shadow-lg shadow-sky-200">
                <span className="text-xl font-bold text-white">F</span>
              </div>
              <h1 className="text-xl font-semibold text-slate-800">Welcome back to</h1>
              <h2 className="text-2xl font-bold text-sky-500">your Sanctuary</h2>
            </div>

            {error && (
               <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tesalonika@jiu.ac.id"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-200 transition-all hover:bg-sky-600 active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Login to Sanctuary"
                )}
              </button>
            </form>

            <div className="mt-6 rounded-xl bg-slate-50 p-3 text-[10px] text-slate-400">
              <p className="mb-1 font-bold uppercase tracking-wider">Testing Credentials:</p>
              <p>Email: <span className="text-slate-600">{VALID_EMAIL}</span></p>
              <p>Pass: <span className="text-slate-600">{VALID_PASSWORD}</span></p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}