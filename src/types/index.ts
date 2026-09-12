export type Priority = 'high' | 'medium' | 'low';

export type TaskCategory =
  | 'Work'
  | 'Personal'
  | 'Study'
  | 'Ideas'
  | 'Health'
  | 'Finance'
  | 'Important';

export type NoteCategory =
  | 'All'
  | 'Personal'
  | 'Study'
  | 'Work'
  | 'Ideas'
  | 'Important';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  priority: Priority;
  category: TaskCategory;
  completed: boolean;
  reminder?: string;
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  subtasks: SubTask[];
  notes?: string;
  createdAt: string;
  completedAt?: string;
  scheduledTimeBlock?: 'morning' | 'afternoon' | 'evening';
  estimatedMinutes?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  pinned: boolean;
  favorite: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  summary?: string;
}

export type ChatActionType =
  | 'task_created'
  | 'note_created'
  | 'schedule_optimized'
  | 'summary_generated';

export interface ChatActionPayload {
  title?: string;
  dueDate?: string;
  dueTime?: string;
  priority?: Priority;
  category?: TaskCategory;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionType?: ChatActionType;
  actionPayload?: ChatActionPayload;
}

export interface PlannerTimeBlock {
  id: string;
  period: 'morning' | 'afternoon' | 'evening';
  periodLabel: string;
  timeRange: string;
  icon: string;
  tasks: Task[];
  energyLevel: 'High Focus' | 'Medium Focus' | 'Relaxed / Admin';
  aiTip?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  streakDays: number;
  totalCompletedTasks: number;
  aiRequestsUsed: number;
  themeMode: 'light' | 'dark' | 'system';
  hasOnboarded: boolean;
  notificationsEnabled: boolean;
  reminderSound: boolean;
  hapticsEnabled: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'task' | 'ai' | 'reminder' | 'streak';
}
