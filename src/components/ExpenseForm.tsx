import type React from "react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import type { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import type { Expense } from "../features/expenses/types";
import { addExpense } from "../features/expenses/expensesSlice";
import { CalendarDays, DollarSign, Plus, Tag, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const categories = ["Food", "Travel", "Shopping", "Bills", "Other"];

const categoryColors = {
  Food: "from-orange-400 to-red-500",
  Travel: "from-blue-400 to-indigo-500",
  Shopping: "from-purple-400 to-pink-500",
  Bills: "from-red-400 to-rose-500",
  Other: "from-gray-400 to-slate-500",
};

interface ExpenseFormProps {
  userId: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !category || !date || !user?.id) return;

    const newExpense: Expense = {
      id: uuidv4(),
      title,
      amount: Number.parseFloat(amount),
      category,
      date,
      userId: userId,
      createdAt: new Date().toISOString(),
      description: description || undefined,
    };

    dispatch(addExpense({ expense: newExpense, userId: user.id }));

    // Reset form
    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
    setDescription("");

    // Close dialog after successful submission
    setOpen(false);
  };

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <Plus className="h-4 w-4 mr-1" />
          Add <span className="md:flex hidden ">Expense</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-slate-800 text-lg">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
              <Plus className="h-4 w-4 text-white" />
            </div>
            Add Expense
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-sm">
            Quick expense tracking for {user.name}
          </DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Compact Grid Layout */}
              <div className="grid grid-cols-2 gap-3">
                {/* Title Field - Full Width */}
                <div className="col-span-2 space-y-1">
                  <Label
                    htmlFor="title"
                    className="flex items-center gap-1 text-slate-700 font-medium text-xs"
                  >
                    <div className="p-1 bg-gradient-to-br from-blue-400 to-cyan-500 rounded">
                      <Tag className="h-3 w-3 text-white" />
                    </div>
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Expense title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 h-9 text-sm"
                    required
                  />
                </div>

                {/* Amount Field */}
                <div className="space-y-1">
                  <Label
                    htmlFor="amount"
                    className="flex items-center gap-1 text-slate-700 font-medium text-xs"
                  >
                    <div className="p-1 bg-gradient-to-br from-emerald-400 to-teal-500 rounded">
                      <DollarSign className="h-3 w-3 text-white" />
                    </div>
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 h-9 text-sm"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                {/* Category Field */}
                <div className="space-y-1">
                  <Label
                    htmlFor="category"
                    className="flex items-center gap-1 text-slate-700 font-medium text-xs"
                  >
                    <div className="p-1 bg-gradient-to-br from-purple-400 to-pink-500 rounded">
                      <Tag className="h-3 w-3 text-white" />
                    </div>
                    Category
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="border border-slate-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 h-9 text-sm">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat}
                          className="hover:bg-purple-50 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                                categoryColors[
                                  cat as keyof typeof categoryColors
                                ]
                              }`}
                            />
                            {cat}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Field - Full Width */}
                <div className="col-span-2 space-y-1">
                  <Label
                    htmlFor="date"
                    className="flex items-center gap-1 text-slate-700 font-medium text-xs"
                  >
                    <div className="p-1 bg-gradient-to-br from-orange-400 to-red-500 rounded">
                      <CalendarDays className="h-3 w-3 text-white" />
                    </div>
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-slate-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20 h-9 text-sm"
                    required
                  />
                </div>

                {/* Description Field - Full Width (Optional) */}
                <div className="col-span-2 space-y-1">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-1 text-slate-700 font-medium text-xs"
                  >
                    <div className="p-1 bg-gradient-to-br from-indigo-400 to-purple-500 rounded">
                      <Tag className="h-3 w-3 text-white" />
                    </div>
                    Description (Optional)
                  </Label>
                  <Input
                    id="description"
                    placeholder="Additional notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 h-9 text-sm"
                  />
                </div>
              </div>

              {/* Compact Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1 border border-slate-300 text-slate-600 hover:bg-slate-50 h-9 text-sm"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 h-9 text-sm"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseForm;
