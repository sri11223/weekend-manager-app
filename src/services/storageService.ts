import Dexie, { type Table } from 'dexie';
import type { WeekendPlan, Activity, User } from '../types';

export interface StoredPlan extends WeekendPlan {
  id: string;
}

export interface StoredUser extends User {
  id: string;
}

class WeekendPlannerDB extends Dexie {
  plans!: Table<StoredPlan>;
  users!: Table<StoredUser>;
  activities!: Table<Activity>;

  constructor() {
    super('WeekendPlannerDB');
    this.version(1).stores({
      plans: 'id, name, theme, createdAt, updatedAt, isLongWeekend',
      users: 'id, name',
      activities: 'id, name, category, mood, cost, difficulty'
    });
  }
}

export const db = new WeekendPlannerDB();

export class StorageService {
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Plan operations
  async savePlan(plan: WeekendPlan): Promise<void> {
    try {
      await db.plans.put(plan as StoredPlan);
    } catch (error) {
      console.error('Failed to save plan:', error);
      // Fallback to localStorage
      const plans = this.getPlansFromLocalStorage();
      const existingIndex = plans.findIndex(p => p.id === plan.id);
      if (existingIndex >= 0) {
        plans[existingIndex] = plan;
      } else {
        plans.push(plan);
      }
      localStorage.setItem('weekend-plans', JSON.stringify(plans));
    }
  }

  async loadPlan(planId: string): Promise<WeekendPlan | null> {
    try {
      const plan = await db.plans.get(planId);
      return plan || null;
    } catch (error) {
      console.error('Failed to load plan:', error);
      // Fallback to localStorage
      const plans = this.getPlansFromLocalStorage();
      return plans.find(p => p.id === planId) || null;
    }
  }

  async getAllPlans(): Promise<WeekendPlan[]> {
    try {
      return await db.plans.toArray();
    } catch (error) {
      console.error('Failed to load plans:', error);
      // Fallback to localStorage
      return this.getPlansFromLocalStorage();
    }
  }

  async deletePlan(planId: string): Promise<void> {
    try {
      await db.plans.delete(planId);
    } catch (error) {
      console.error('Failed to delete plan:', error);
      // Fallback to localStorage
      const plans = this.getPlansFromLocalStorage();
      const filteredPlans = plans.filter(p => p.id !== planId);
      localStorage.setItem('weekend-plans', JSON.stringify(filteredPlans));
    }
  }

  // User operations
  async saveUser(user: User): Promise<void> {
    try {
      await db.users.put(user as StoredUser);
    } catch (error) {
      console.error('Failed to save user:', error);
      localStorage.setItem('weekend-user', JSON.stringify(user));
    }
  }

  async loadUser(userId: string): Promise<User | null> {
    try {
      const user = await db.users.get(userId);
      return user || null;
    } catch (error) {
      console.error('Failed to load user:', error);
      const userStr = localStorage.getItem('weekend-user');
      return userStr ? JSON.parse(userStr) : null;
    }
  }

  // Activity operations
  async saveCustomActivity(activity: Activity): Promise<void> {
    try {
      await db.activities.put(activity);
    } catch (error) {
      console.error('Failed to save activity:', error);
      const activities = this.getActivitiesFromLocalStorage();
      const existingIndex = activities.findIndex(a => a.id === activity.id);
      if (existingIndex >= 0) {
        activities[existingIndex] = activity;
      } else {
        activities.push(activity);
      }
      localStorage.setItem('custom-activities', JSON.stringify(activities));
    }
  }

  async getCustomActivities(): Promise<Activity[]> {
    try {
      return await db.activities.toArray();
    } catch (error) {
      console.error('Failed to load activities:', error);
      return this.getActivitiesFromLocalStorage();
    }
  }

  // Cache management
  async clearCache(): Promise<void> {
    try {
      await db.delete();
      await db.open();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
    // Also clear localStorage
    localStorage.removeItem('weekend-plans');
    localStorage.removeItem('weekend-user');
    localStorage.removeItem('custom-activities');
  }

  // Offline sync
  async syncWhenOnline(): Promise<void> {
    if (!navigator.onLine) return;

    try {
      // In a real app, you'd sync with your backend here
      console.log('Syncing data with server...');
      
      // For demo purposes, we'll just ensure IndexedDB is working
      const plans = await this.getAllPlans();
      console.log(`Synced ${plans.length} plans`);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  // Fallback methods for localStorage
  private getPlansFromLocalStorage(): WeekendPlan[] {
    try {
      const plansStr = localStorage.getItem('weekend-plans');
      return plansStr ? JSON.parse(plansStr) : [];
    } catch {
      return [];
    }
  }

  private getActivitiesFromLocalStorage(): Activity[] {
    try {
      const activitiesStr = localStorage.getItem('custom-activities');
      return activitiesStr ? JSON.parse(activitiesStr) : [];
    } catch {
      return [];
    }
  }

  // Export/Import functionality
  async exportAllData(): Promise<string> {
    const plans = await this.getAllPlans();
    const activities = await this.getCustomActivities();
    
    const exportData = {
      plans,
      activities,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    return JSON.stringify(exportData, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.plans) {
        for (const plan of data.plans) {
          await this.savePlan(plan);
        }
      }
      
      if (data.activities) {
        for (const activity of data.activities) {
          await this.saveCustomActivity(activity);
        }
      }
    } catch (error) {
      throw new Error('Invalid import data format');
    }
  }
}

export const storageService = StorageService.getInstance();

// Initialize offline sync
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    storageService.syncWhenOnline();
  });
}
