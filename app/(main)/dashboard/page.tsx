"use client";
import { Smile } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Hi, Tesalonika!</h1>
        <p className="text-slate-500">Welcome back to your Sanctuary.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mood Widget */}
        <div className="p-6 bg-white border border-slate-100 shadow-sm rounded-2xl md:col-span-2">
          <h2 className="mb-4 text-lg font-semibold flex items-center gap-2 text-slate-800">
            <Smile className="w-5 h-5 text-sky-500" />
            Current Mood
          </h2>
          <div className="p-4 bg-sky-50 rounded-xl text-sky-800">
            You felt 😌 Relieved after your last Linguistics task. Keep it up!
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6 bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-sm rounded-2xl flex flex-col justify-between">
          <h2 className="text-lg font-medium opacity-90">Pending Tasks</h2>
          <p className="text-5xl font-bold">3</p>
          <p className="text-sm opacity-80 mt-2">Due this week</p>
        </div>
      </div>
    </div>
  );
}