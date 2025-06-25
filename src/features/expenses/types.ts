import { v4 as uuidv4 } from "uuid";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;

  userId: string;
  description?: string;
  paymentMethod?: "cash" | "card" | "upi" | "bank_transfer" | "other";
  tags?: string[];
  receipt?: string;
  location?: string;
  isRecurring?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ExpenseMinimal {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  userId: string; // Essential for multi-user support
  createdAt: string; // Good for sorting/tracking
}

// Category type for better type safety
export type ExpenseCategory =
  | "Food"
  | "Travel"
  | "Shopping"
  | "Bills"
  | "Other";

// Payment method type
export type PaymentMethod = "cash" | "card" | "upi" | "bank_transfer" | "other";

// Enhanced interface with types
export interface ExpenseEnhanced {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  userId: string;
  description?: string;
  paymentMethod?: PaymentMethod;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export const migrateExpense = (oldExpense: any, userId: string): Expense => {
  return {
    ...oldExpense,
    userId: oldExpense.userId || userId,
    createdAt: oldExpense.createdAt || new Date().toISOString(),
    description: oldExpense.description || undefined,
    paymentMethod: oldExpense.paymentMethod || undefined,
  };
};

export const createExpense = (
  expenseData: Omit<Expense, "id" | "createdAt">
) => {
  return {
    ...expenseData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
};
