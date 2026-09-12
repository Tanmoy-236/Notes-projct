import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import {
  ChatMessage,
  Note,
  NotificationItem,
  Task,
  UserProfile,
} from '../types';
import {
  INITIAL_CHAT_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_NOTES,
  INITIAL_TASKS,
  INITIAL_USER_PROFILE,
} from '../constants/sampleData';
import { COLORS } from '../constants/theme';
import { AIEngine } from '../utils/aiEngine';
import { StorageService } from '../utils/storage';

interface AppContextType {
  tasks: Task[];
  notes: Note[];
  userProfile: UserProfile;
  chatMessages: ChatMessage[];
  notifications: NotificationItem[];
  isDarkMode: boolean;
  theme: typeof COLORS.light;
  isAiLoading: boolean;

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;

  // Note actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  toggleFavoriteNote: (id: string) => void;
  createTasksFromNoteAI: (noteId: string) => Promise<number>;

  // AI actions
  sendChatMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  optimizeDailySchedule: () => Promise<{
    morning: Task[];
    afternoon: Task[];
    evening: Task[];
    aiInsight: string;
  }>;

  // Profile and theme actions
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  toggleTheme: () => void;
  completeOnboarding: () => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (
    title: string,
    message: string,
    type?: NotificationItem['type']
  ) => void;

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
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const [storedTasks, storedNotes, storedProfile, storedChat, storedNotifications] =
          await Promise.all([
            StorageService.getItem(StorageService.KEYS.TASKS, INITIAL_TASKS),
            StorageService.getItem(StorageService.KEYS.NOTES, INITIAL_NOTES),
            StorageService.getItem(StorageService.KEYS.USER_PROFILE, INITIAL_USER_PROFILE),
            StorageService.getItem(StorageService.KEYS.CHAT_MESSAGES, INITIAL_CHAT_MESSAGES),
            StorageService.getItem(StorageService.KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
          ]);

        setTasks(storedTasks);
        setNotes(storedNotes);
        setUserProfile(storedProfile);
        setChatMessages(storedChat);
        setNotifications(storedNotifications);
      } catch (error) {
        console.warn('Failed to load persisted app state.', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadState();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    void StorageService.setItem(StorageService.KEYS.TASKS, tasks);
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    void StorageService.setItem(StorageService.KEYS.NOTES, notes);
  }, [notes, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    void StorageService.setItem(StorageService.KEYS.USER_PROFILE, userProfile);
  }, [userProfile, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    void StorageService.setItem(StorageService.KEYS.CHAT_MESSAGES, chatMessages);
  }, [chatMessages, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    void StorageService.setItem(StorageService.KEYS.NOTIFICATIONS, notifications);
  }, [notifications, isLoaded]);

  const isDarkMode =
    userProfile.themeMode === 'dark' ||
    (userProfile.themeMode === 'system' && systemColorScheme === 'dark');
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((previous) => [newTask, ...previous]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((previous) =>
      previous.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((previous) =>
      previous.map((task) => {
        if (task.id !== id) return task;

        const completed = !task.completed;
        setUserProfile((profile) => ({
          ...profile,
          totalCompletedTasks: Math.max(
            0,
            profile.totalCompletedTasks + (completed ? 1 : -1)
          ),
        }));

        return {
          ...task,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined,
        };
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((previous) => previous.filter((task) => task.id !== id));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              ),
            }
          : task
      )
    );
  };

  const addSubtask = (taskId: string, title: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                {
                  id: `st-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  title: trimmedTitle,
                  completed: false,
                },
              ],
            }
          : task
      )
    );
  };

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
    const timestamp = new Date().toISOString();
    const newNote: Note = {
      ...noteData,
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    setNotes((previous) => [newNote, ...previous]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((previous) =>
      previous.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((previous) => previous.filter((note) => note.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes((previous) =>
      previous.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note))
    );
  };

  const toggleFavoriteNote = (id: string) => {
    setNotes((previous) =>
      previous.map((note) =>
        note.id === id ? { ...note, favorite: !note.favorite } : note
      )
    );
  };

  const createTasksFromNoteAI = async (noteId: string): Promise<number> => {
    const targetNote = notes.find((note) => note.id === noteId);
    if (!targetNote) return 0;

    setIsAiLoading(true);
    try {
      const extracted = await AIEngine.extractTasksFromNote(targetNote.title, targetNote.content);
      const today = new Date().toISOString().split('T')[0];

      extracted.forEach((item) => {
        addTask({
          title: item.title,
          dueDate: today,
          dueTime: '04:00 PM',
          priority: item.priority,
          category: item.category,
          completed: false,
          subtasks: [],
          notes: `Extracted from note: "${targetNote.title}"`,
          estimatedMinutes: item.estimatedMinutes,
        });
      });

      setUserProfile((profile) => ({
        ...profile,
        aiRequestsUsed: profile.aiRequestsUsed + 1,
      }));
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

  const sendChatMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const timestamp = () =>
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((previous) => [
      ...previous,
      {
        id: `c-u-${Date.now()}`,
        sender: 'user',
        text: trimmedText,
        timestamp: timestamp(),
      },
    ]);
    setIsAiLoading(true);

    try {
      const response = await AIEngine.generateChatResponse(trimmedText, {
        tasks,
        notes,
        userName: userProfile.name,
      });

      const payload = response.actionPayload;
      if (
        response.actionType === 'task_created' &&
        payload?.title &&
        payload.dueDate
      ) {
        addTask({
          title: payload.title,
          dueDate: payload.dueDate,
          dueTime: payload.dueTime || '04:00 PM',
          priority: payload.priority || 'high',
          category: payload.category || 'Work',
          completed: false,
          subtasks: [],
        });
      }

      setChatMessages((previous) => [
        ...previous,
        {
          id: `c-a-${Date.now()}`,
          sender: 'ai',
          text: response.text,
          timestamp: timestamp(),
          actionType: response.actionType,
          actionPayload: response.actionPayload,
        },
      ]);
      setUserProfile((profile) => ({
        ...profile,
        aiRequestsUsed: profile.aiRequestsUsed + 1,
      }));
    } catch (error) {
      console.warn('AI chat request failed.', error);
      setChatMessages((previous) => [
        ...previous,
        {
          id: `c-error-${Date.now()}`,
          sender: 'ai',
          text: 'Sorry, I could not process that request. Please try again.',
          timestamp: timestamp(),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: `c-init-${Date.now()}`,
        sender: 'ai',
        text: "👋 Chat reset! I'm **LifeFlow AI**. How can I help you organize your tasks or summarize your notes today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const optimizeDailySchedule = async () => {
    setIsAiLoading(true);
    try {
      const result = await AIEngine.optimizeSchedule(tasks);
      const scheduleById = new Map<string, Task['scheduledTimeBlock']>();

      result.morning.forEach((task) => scheduleById.set(task.id, 'morning'));
      result.afternoon.forEach((task) => scheduleById.set(task.id, 'afternoon'));
      result.evening.forEach((task) => scheduleById.set(task.id, 'evening'));

      setTasks((previous) =>
        previous.map((task) => ({
          ...task,
          scheduledTimeBlock: scheduleById.get(task.id),
        }))
      );
      setUserProfile((profile) => ({
        ...profile,
        aiRequestsUsed: profile.aiRequestsUsed + 1,
      }));
      addNotification(
        '✨ Daily Schedule Optimized',
        'Tasks arranged by peak focus and energy slots.',
        'ai'
      );

      return result;
    } finally {
      setIsAiLoading(false);
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((previous) => ({ ...previous, ...updates }));
  };

  const toggleTheme = () => {
    setUserProfile((previous) => ({
      ...previous,
      themeMode: previous.themeMode === 'dark' ? 'light' : 'dark',
    }));
  };

  const completeOnboarding = () => {
    setUserProfile((previous) => ({ ...previous, hasOnboarded: true }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearNotifications = () => setNotifications([]);

  const addNotification = (
    title: string,
    message: string,
    type: NotificationItem['type'] = 'task'
  ) => {
    setNotifications((previous) => [
      {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        message,
        time: 'Just now',
        read: false,
        type,
      },
      ...previous,
    ]);
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

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider.');
  }
  return context;
};
