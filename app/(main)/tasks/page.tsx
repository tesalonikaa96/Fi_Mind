"use client";
import { useState } from "react";
// Menggunakan relative path agar lebih aman di Vercel
import { useClassroomSync } from "../../hooks/useClassroomSync";
import { TaskCard } from "../../../components/features/TaskCard";
import { CompletionModal } from "../../../components/features/CompletionModal";
import { RefreshCw } from "lucide-react";

export default function TasksPage() {
  const { tasks, isSyncing, fetchTasks, completeTask } = useClassroomSync();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleCompleteTask = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleMoodSelect = (emoji: string) => {
    if (selectedTaskId) {
      completeTask(selectedTaskId);
      // Di sini nantinya kamu bisa menyimpan emoji ke database/state Mood History
      console.log(`Mood recorded: ${emoji}`);
      setSelectedTaskId(null);
    }
  };

  return (
    <div className="max-w-3xl p-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Focus Flow</h1>
          <p className="text-slate-500">Organize your academic loads peacefully.</p>
        </div>
        <button 
          onClick={fetchTasks}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-sky-500" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync Classroom"}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-wider uppercase text-slate-400">To Do</h2>
          {tasks.filter(t => !t.isCompleted).map(task => (
            <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} />
          ))}
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-wider uppercase text-slate-400">Completed</h2>
          {tasks.filter(t => t.isCompleted).map(task => (
            <TaskCard key={task.id} task={task} onComplete={() => {}} />
          ))}
        </div>
      </div>

      <CompletionModal 
        isOpen={selectedTaskId !== null} 
        onSelectMood={handleMoodSelect} 
      />
    </div>
  );
}