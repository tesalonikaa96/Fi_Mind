"use client";
import { Briefcase, BookOpen, GraduationCap } from "lucide-react";

export default function CareerPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Your Future Path</h1>
        <p className="text-slate-500">Tailored recommendations for English Literature</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white border border-slate-100 shadow-sm rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Career Matches</h2>
          </div>
          <ul className="space-y-3">
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-100">Content Strategist / Copywriter</li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-100">Technical Writer</li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-100">Public Relations Specialist</li>
          </ul>
        </div>

        <div className="p-6 bg-white border border-slate-100 shadow-sm rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Scholarships</h2>
          </div>
          <ul className="space-y-3">
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block font-medium">LPDP Reguler (Humanities)</span>
              <span className="text-sm text-slate-500">Deadline: Sept 2026</span>
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block font-medium">Fulbright Master's Program</span>
              <span className="text-sm text-slate-500">Deadline: Feb 2027</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}