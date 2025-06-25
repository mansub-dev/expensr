import type { Expense } from "./types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ExpensesState {
  list: Expense[];
  loading: boolean;
}

const initialState: ExpensesState = {
  list: [],
  loading: false,
};

// Helper function to get user-specific storage key
const getUserStorageKey = (userId: string) => `pennywise_expenses_${userId}`;

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    loadUserExpenses: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const savedExpenses = localStorage.getItem(getUserStorageKey(userId));
      if (savedExpenses) {
        state.list = JSON.parse(savedExpenses);
      } else {
        state.list = [];
      }
    },
    addExpense: (
      state,
      action: PayloadAction<{ expense: Expense; userId: string }>
    ) => {
      const { expense, userId } = action.payload;
      state.list.push(expense);
      // Save to user-specific storage
      localStorage.setItem(
        getUserStorageKey(userId),
        JSON.stringify(state.list)
      );
    },
    deleteExpense: (
      state,
      action: PayloadAction<{ id: string; userId: string }>
    ) => {
      const { id, userId } = action.payload;
      state.list = state.list.filter((expense) => expense.id !== id);
      // Save to user-specific storage
      localStorage.setItem(
        getUserStorageKey(userId),
        JSON.stringify(state.list)
      );
    },
    clearUserExpenses: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.list = [];
      localStorage.removeItem(getUserStorageKey(userId));
    },
  },
});

export const {
  loadUserExpenses,
  addExpense,
  deleteExpense,
  clearUserExpenses,
} = expensesSlice.actions;
export default expensesSlice.reducer;
