import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Task, Note, UserProfile, ChatMessage, NotificationItem, Priority, TaskCategory, NoteCategory } from '../types';
import { INITIAL_TASKS, INITIAL_NOTES, INITIAL_CHAT_MESSAGES, INITIAL_USER_PROFILE, INITIAL_NOTIFICATIONS } from '../constants/sampleData';
import { COLORS } from '../constants/theme';
import { StorageService } from '../utils/storage';
import { AIEngine } from '../utils/aiEngine';

interface AppContextType {
  tasks: Task[];
  notes: Note[];
  userProfile: UserProfile;
  chatMessages: ChatMessage[];
  notifications: NotificationItem[];
  isDarkMode: boolean;
  theme: typeof COLORS.light;
  isAiLoading: boolean;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  
  // Note Actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  toggleFavoriteNote: (id: string) => void;
  createTasksFromNoteAI: (noteId: string) => Promise<number>;
  
  // AI Chat Actions
  sendChatMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  optimizeDailySchedule: () => Promise<{ morning: Task[]; afternoon: Task[]; evening: Task[]; aiInsight: string }>;
  
  // Profile & Theme Actions
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  toggleTheme: () => void;
  completeOnboarding: () => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;
  
  // Reset
  resetToSampleData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from local storage on startup
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedTasks = await StorageService.getItem<Task[]>(StorageService.KEYS.TASKS, INITIAL_TASKS);
        const storedNotes = await StorageService.getItem<Note[]>(StorageService.KEYS.NOTES, INITIAL_NOTES);
        const storedProfile = await StorageService.getItem<UserProfile>(StorageService.KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
        const storedChat = await StorageService.getItem<ChatMessage[]>(StorageService.KEYS.CHAT_MESSAGES, INITIAL_CHAT_MESSAGES);
        const storedNotifs = await StorageService.getItem<NotificationItem[]>(StorageService.KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);

        setTasks(storedTasks);
        setNotes(storedNotes);
        setUserProfile(storedProfile);
        setChatMessages(storedChat);
        setNotifications(storedNotifs);
      } catch (err) {
        console.warn('Failed to load storage state', err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadState();
  }, []);

  // Save to storage when state changes (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    StorageService.setItem(StorageService.KEYS.TASKS, tasks);
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    StorageService.setItem(StorageService.KEYS.NOTES, notes);
  }, [notes, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    StorageService.setItem(StorageService.KEYS.USER_PROFILE, userProfile);
  }, [userProfile, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    StorageService.setItem(StorageService.KEYS.CHAT_MESSAGES, chatMessages);
  }, [chatMessages, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    StorageService.setItem(StorageService.KEYS.NOTIFICATIONS, notifications);
  }, [notifications, isLoaded]);

  // Derived Theme
  const isDarkMode =
    userProfile.themeMode === 'dark' ||
    (userProfile.themeMode === 'system' && systemColorScheme === 'dark');

  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  // Task Actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, ...updates };
        }
        return t;
      })
    );
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            setUserProfile((p) => ({ ...p, totalCompletedTasks: p.totalCompletedTasks + 1 }));
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const addSubtask = (taskId: string, title: string) => {
    if (!title.trim()) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newSub: Task['subtasks'][0] = {
            id: `st-${Date.now()}`,
            title: title.trim(),
            completed: false,
          };
          return { ...t, subtasks: [...t.subtasks, newSub] };
        }
        return t;
      })
    );
  };

  // Note Actions
  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
    const newNote: Note = {
      ...noteData,
      id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          return { ...n, ...updates, updatedAt: new Date().toISOString() };
        }
        return n;
      })
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const toggleFavoriteNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, favorite: !n.favorite } : n))
    );
  };

  const createTasksFromNoteAI = async (noteId: string): Promise<number> => {
    const targetNote = notes.find((n) => n.id === noteId);
    if (!targetNote) return 0;

    setIsAiLoading(true);
    try {
      const extracted = await AIEngine.extractTasksFromNote(targetNote.title, targetNote.content);
      const todayStr = new Date().toISOString().split('T')[0];

      extracted.forEach((item) => {
        addTask({
          title: item.title,
          dueDate: todayStr,
          dueTime: '04:00 PM',
          priority: item.priority,
          category: item.category,
          completed: false,
          subtasks: [],
          notes: `Extracted from note: "${targetNote.title}"`,
          estimatedMinutes: item.estimatedMinutes,
        });
      });

      setUserProfile((p) => ({ ...p, aiRequestsUsed: p.aiRequestsUsed + 1 }));
      addNotification(
        '✨ Tasks Extracted from Note',
        `LifeFlow AI extracted ${extracted.length} tasks from "${targetNote.title}".`,
        'ai'
      );
      return extracted.length;
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Chat Actions
  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `c-u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const response = await AIEngine.generateChatResponse(text, {
        tasks,
        notes,
        userName: userProfile.name,
      });

      if (response.actionType === 'task_created' && response.actionPayload) {
        addTask({
          title: response.actionPayload.title,
          dueDate: response.actionPayload.dueDate,
          dueTime: response.actionPayload.dueTime || '04:00 PM',
          priority: response.actionPayload.priority || 'high',
          category: response.actionPayload.category || 'Work',
          completed: false,
          subtasks: [],
        });
      }

      const aiMsg: ChatMessage = {
        id: `c-a-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: response.actionType,
        actionPayload: response.actionPayload,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      setUserProfile((p) => ({ ...p, aiRequestsUsed: p.aiRequestsUsed + 1 }));
    } catch (e) {
      console.warn('AI Chat error', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: `c-init-${Date.now()}`,
        sender: 'ai',
        text: `👋 Chat reset! I'm **LifeFlow AI**. How can I help you organize your tasks or summarize your notes today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const optimizeDailySchedule = async () => {
    setIsAiLoading(true);
    try {
      const result = await AIEngine.optimizeSchedule(tasks);
      
      // Update tasks with their new schedule blocks
      const updatedTasks = tasks.map((t) => {
        const inMorning = result.morning.find((m) => m.id === t.id);
        if (inMorning) return { ...t, scheduledTimeBlock: 'morning' as const };
        const inAfternoon = result.afternoon.find((a) => a.id === t.id);
        if (inAfternoon) return { ...t, scheduledTimeBlock: 'afternoon' as const };
        const inEvening = result.evening.find((e) => e.id === t.id);
        if (inEvening) return { ...t, scheduledTimeBlock: 'evening' as const };
        return t;
      });

      setTasks(updatedTasks);
      setUserProfile((p) => ({ ...p, aiRequestsUsed: p.aiRequestsUsed + 1 }));
      addNotification('✨ Daily Schedule Optimized', 'Tasks arranged by peak focus & energy slots.', 'ai');
      return result;
    } finally {
      setIsAiLoading(false);
    }
  };

  // User & Theme Actions
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const toggleTheme = () => {
    setUserProfile((prev) => ({
      ...prev,
      themeMode: prev.themeMode === 'dark' ? 'light' : 'dark',
    }));
  };

  const completeOnboarding = () => {
    setUserProfile((prev) => ({ ...prev, hasOnboarded: true }));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type'] = 'task') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      read: false,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const resetToSampleData = async () => {
    setTasks(INITIAL_TASKS);
    setNotes(INITIAL_NOTES);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setUserProfile(INITIAL_USER_PROFILE);
    await StorageService.clearAll();
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        notes,
        userProfile,
        chatMessages,
        notifications,
        isDarkMode,
        theme,
        isAiLoading,
        addTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        toggleSubtask,
        addSubtask,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        toggleFavoriteNote,
        createTasksFromNoteAI,
        sendChatMessage,
        clearChat,
        optimizeDailySchedule,
        updateUserProfile,
        toggleTheme,
        completeOnboarding,
        markNotificationRead,
        clearNotifications,
        addNotification,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
