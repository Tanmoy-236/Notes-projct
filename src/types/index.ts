export type Priority = 'high' | 'medium' | 'low';

export type TaskCategory = 'Work' | 'Personal' | 'Study' | 'Ideas' | 'Health' | 'Finance' | 'Important';

export type NoteCategory = 'All' | 'Personal' | 'Study' | 'Work' | 'Ideas' | 'Important';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm or '10:00 AM'
  priority: Priority;
  category: TaskCategory;
  completed: boolean;
  reminder?: string; // 'At time' | '15m before' | '1 hour before' | '1 day before' | 'none'
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

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionType?: 'task_created' | 'note_created' | 'schedule_optimized' | 'summary_generated';
  actionPayload?: any;
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
