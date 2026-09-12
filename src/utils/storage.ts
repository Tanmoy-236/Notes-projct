import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TASKS: '@lifeflow_tasks',
  NOTES: '@lifeflow_notes',
  USER_PROFILE: '@lifeflow_profile',
  CHAT_MESSAGES: '@lifeflow_chat',
  NOTIFICATIONS: '@lifeflow_notifications',
  SEARCH_HISTORY: '@lifeflow_search_history',
} as const;

export const StorageService = {
  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value === null ? defaultValue : (JSON.parse(value) as T);
    } catch (error) {
      console.warn(`Error reading AsyncStorage key: ${key}`, error);
      return defaultValue;
    }
  },

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing AsyncStorage key: ${key}`, error);
      return false;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing AsyncStorage key: ${key}`, error);
      return false;
    }
  },

  async clearAll(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      return true;
    } catch (error) {
      console.warn('Error clearing LifeFlow storage.', error);
      return false;
    }
  },

  KEYS: STORAGE_KEYS,
};
