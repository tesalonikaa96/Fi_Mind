"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react"; // Tambahkan AlertCircle

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // State untuk pesan error

  // --- SETUP CREDENTIALS ---
  const VALID_EMAIL = "tesalonika@jiu.ac.id";
  const VALID_PASSWORD = "password123";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error setiap kali mencoba login
    
    if (!email || !password) return;

    setIsLoading(true);

    // Simulasi Delay Proses
    setTimeout(() => {
      // PENGECEKAN USERNAME & PASSWORD
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Logo Section */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 shadow-lg shadow-sky-200">
              <span className="text-xl font-bold text-white">F</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-800">Welcome back to</h1>
            <h2 className="text-2xl font-bold text-sky-500">your Sanctuary</h2>
          </div>

          {/* Alert Error (Hanya muncul jika salah login) */}
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
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 outline-none"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 outline-none"
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

          {/* Hint untuk Testing (Bisa kamu hapus nanti) */}
          <div className="mt-6 rounded-xl bg-slate-50 p-3 text-[10px] text-slate-400">
            <p className="font-bold uppercase tracking-wider mb-1">Testing Credentials:</p>
            <p>Email: <span className="text-slate-600">tesalonika@jiu.ac.id</span></p>
            <p>Pass: <span className="text-slate-600">password123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}