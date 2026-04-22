"use client";
import { Task } from "@/types";
import { CheckCircle2, Circle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 mb-3 bg-white border rounded-2xl shadow-sm transition-all duration-300",
      task.isCompleted ? "opacity-50 border-sky-200" : "border-slate-100 hover:border-sky-300 hover:shadow-md"
    )}>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => !task.isCompleted && onComplete(task.id)}
          className="text-sky-500 hover:text-sky-600 transition-colors"
        >
          {task.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>
        <div>
          <h3 className={cn("font-medium text-slate-800", task.isCompleted && "line-through text-slate-500")}>
            {task.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <BookOpen className="w-3 h-3" />
            <span>{task.course}</span>
            <span>•</span>
            <span>Due: {task.dueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}