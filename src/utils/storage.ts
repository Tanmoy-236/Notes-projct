import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TASKS: '@lifeflow_tasks',
  NOTES: '@lifeflow_notes',
  USER_PROFILE: '@lifeflow_profile',
  CHAT_MESSAGES: '@lifeflow_chat',
  NOTIFICATIONS: '@lifeflow_notifications',
  SEARCH_HISTORY: '@lifeflow_search_history',
};

export const StorageService = {
  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value) as T;
      }
      return defaultValue;
    } catch (e) {
      console.warn(`Error reading AsyncStorage key: ${key}`, e);
      return defaultValue;
    }
  },

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`Error writing AsyncStorage key: ${key}`, e);
      return false;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`Error removing AsyncStorage key: ${key}`, e);
      return false;
    }
  },

  async clearAll(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (e) {
      console.warn('Error clearing AsyncStorage', e);
      return false;
    }
  },

  KEYS: STORAGE_KEYS,
};
