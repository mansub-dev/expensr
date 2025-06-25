import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import type { Expense } from "../features/expenses/types";
import expensesReducer from "../features/expenses/expensesSlice";

// User-specific localStorage functions
const getUserStorageKey = (userId: string) => `pennywise_expenses_${userId}`;

const loadUserExpenses = (userId: string): Expense[] => {
  try {
    const data = localStorage.getItem(getUserStorageKey(userId));
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveUserExpenses = (userId: string, expenses: Expense[]) => {
  try {
    localStorage.setItem(getUserStorageKey(userId), JSON.stringify(expenses));
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
};

// Load auth state from localStorage
const loadAuthState = () => {
  try {
    const userData = localStorage.getItem("pennywise_user");
    if (userData) {
      const user = JSON.parse(userData);
      return {
        user,
        isAuthenticated: true,
        loading: false,
      };
    }
  } catch {
    // If error, return default state
  }
  return {
    user: null,
    isAuthenticated: false,
    loading: false,
  };
};

const preloadedState = {
  auth: loadAuthState(),
  expenses: {
    list: [], // Will be loaded after user authentication
    loading: false,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
  },
  preloadedState,
});

// Subscribe to store changes for user-specific data saving
let currentUserId: string | null = null;

store.subscribe(() => {
  const state = store.getState();
  const userId = state.auth.user?.id;

  // Save user data when authenticated
  if (userId) {
    // Save auth state
    localStorage.setItem("pennywise_user", JSON.stringify(state.auth.user));

    // Save user's expenses
    saveUserExpenses(userId, state.expenses.list);

    // Load user expenses if user changed
    if (currentUserId !== userId) {
      currentUserId = userId;
      // This will be handled by the component using useEffect
    }
  } else {
    // Clear data when logged out
    localStorage.removeItem("pennywise_user");
    currentUserId = null;
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// Helper functions for components
export { loadUserExpenses, saveUserExpenses, getUserStorageKey };
