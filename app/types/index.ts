export interface User {
  id: string;
  name: string;
  major: string;
}

export interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  isCompleted: boolean;
  source: 'classroom' | 'manual';
}

export interface MoodEntry {
  id: string;
  emoji: string;
  label: string;
  timestamp: string;
  taskId?: string;
}