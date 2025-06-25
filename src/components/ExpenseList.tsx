import type React from "react";
import { Badge } from "./ui/badge";
import ExpenseItem from "./ExpenseItem";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Receipt, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const ExpenseList: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const expenses = useSelector((state: RootState) => state.expenses.list);

  // Filter expenses to show only current user's expenses
  const userExpenses = expenses.filter(
    (expense) => expense.userId === user?.id
  );

  // Sort expenses by creation date (newest first)
  const sortedExpenses = [...userExpenses].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date).getTime();
    const dateB = new Date(b.createdAt || b.date).getTime();
    return dateB - dateA;
  });

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="p-4 bg-slate-100 rounded-full mb-4">
            <Inbox className="h-12 w-12 text-slate-400" />
          </div>
          <p className="text-center text-slate-500 text-lg font-medium">
            Please log in to view expenses.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (sortedExpenses.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-none">
        <CardContent className="flex flex-col items-center justify-center p-3">
          <div className="p-4 bg-slate-100 rounded-full mb-4">
            <Inbox className="h-12 w-12 text-slate-400" />
          </div>
          <p className="text-center text-slate-500 text-lg font-medium">
            No expenses added yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto broder-none">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
            <Receipt className="h-5 w-5 text-blue-600" />
          </div>
          Your Expenses
          <Badge variant="secondary" className="ml-2">
            {sortedExpenses.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedExpenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))}
      </CardContent>
    </Card>
  );
};

export default ExpenseList;
