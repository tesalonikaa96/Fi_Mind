"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-8 shadow-2xl backdrop-blur-2xl pointer-events-auto relative overflow-hidden"
            >
              {/* Decorative Background Element */}
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-sky-200/50 blur-3xl" />

              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-200">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
                  Welcome to Fi-Mind
                </h1>
                <p className="text-slate-500 font-medium mt-1">Please sign in to your sanctuary</p>
              </div>

              {/* Form */}
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-2xl border border-slate-200 bg-white/50 py-3.5 pl-12 pr-4 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-bold text-slate-700">Password</label>
                    <button type="button" className="text-xs font-bold text-sky-600">Forgot?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-white/50 py-3.5 pl-12 pr-4 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    />
                  </div>
                </div>

                <Link href="/dashboard" className="block w-full pt-2">
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-sky-500 py-4 font-bold text-white shadow-lg shadow-sky-200 transition-all hover:bg-sky-600 active:scale-[0.98]"
                  >
                    <LogIn className="h-5 w-5" /> Sign In
                  </button>
                </Link>
              </form>

              {/* Sign Up Section */}
              <div className="mt-8 text-center border-t border-slate-100 pt-6">
                <p className="text-slate-500 text-sm font-medium">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-sky-600 font-bold hover:underline underline-offset-4">
                    Sign Up
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