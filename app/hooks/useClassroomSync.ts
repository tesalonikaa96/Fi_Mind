"use client";
import { useState, useEffect } from "react";
import { Task } from "@/types";

export function useClassroomSync() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchTasks = async () => {
    setIsSyncing(true);
    // Simulasi memanggil API Google Classroom
    setTimeout(() => {
      setTasks([
        { id: "1", title: "Second Language Acquisition Essay", course: "Linguistics", dueDate: "2026-04-25", isCompleted: false, source: "classroom" },
        { id: "2", title: "Phonetics Transcription", course: "Linguistics", dueDate: "2026-04-26", isCompleted: false, source: "classroom" },
        { id: "3", title: "Review 'The Story of an Hour'", course: "Literature", dueDate: "2026-04-28", isCompleted: false, source: "classroom" }
      ]);
      setIsSyncing(false);
    }, 1500);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completeTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, isCompleted: true } : t));
  };

  return { tasks, isSyncing, fetchTasks, completeTask };
}