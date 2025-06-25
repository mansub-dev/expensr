import type React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import type { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import type { Expense } from "../features/expenses/types";
import { deleteExpense } from "../features/expenses/expensesSlice";
import { Trash2, Calendar, Tag, FileText, Clock } from "lucide-react";

interface Props {
  expense: Expense;
}

const categoryColors = {
  Food: "bg-orange-100 text-orange-800 border-orange-200",
  Travel: "bg-blue-100 text-blue-800 border-blue-200",
  Shopping: "bg-purple-100 text-purple-800 border-purple-200",
  Bills: "bg-red-100 text-red-800 border-red-200",
  Other: "bg-gray-100 text-gray-800 border-gray-200",
};

const ExpenseItem: React.FC<Props> = ({ expense }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // Security check: Only show expense if it belongs to current user
  if (!user || expense.userId !== user.id) {
    return null;
  }

  const handleDelete = () => {
    dispatch(deleteExpense({ id: expense.id, userId: expense.userId }));
  };

  // Format the created date for display
  const formatCreatedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <Card className="border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-md">
      <CardContent className="p-3 sm:p-4">
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 text-sm truncate">
                {expense.title}
              </h3>
              <p className="text-lg font-bold text-emerald-600 mt-1">
                Rs {expense.amount.toFixed(2)}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
            </Button>
          </div>

          {/* Description for mobile */}
          {expense.description && (
            <p className="text-xs text-slate-600 mb-2 line-clamp-2">
              {expense.description}
            </p>
          )}

          {/* Mobile badges and info */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className={`${
                categoryColors[
                  expense.category as keyof typeof categoryColors
                ] || categoryColors.Other
              } text-xs`}
            >
              {expense.category}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="h-3 w-3" />
              {new Date(expense.date).toLocaleDateString()}
            </div>
          </div>

          {/* Created time for mobile */}
          {expense.createdAt && (
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
              <Clock className="h-3 w-3" />
              {formatCreatedDate(expense.createdAt)}
            </div>
          )}

          {/* Payment method for mobile */}
          {expense.paymentMethod && (
            <Badge variant="outline" className="text-xs mt-2">
              {expense.paymentMethod.toUpperCase()}
            </Badge>
          )}

          {/* Tags for mobile */}
          {expense.tags && expense.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <FileText className="h-3 w-3 text-slate-400" />
              <div className="flex gap-1 flex-wrap">
                {expense.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs px-1 py-0"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:block">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex-shrink-0">
                  <Tag className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">
                    {expense.title}
                  </h3>

                  {/* Description if available */}
                  {expense.description && (
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {expense.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className={`${
                        categoryColors[
                          expense.category as keyof typeof categoryColors
                        ] || categoryColors.Other
                      } text-xs font-medium`}
                    >
                      {expense.category}
                    </Badge>

                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(expense.date).toLocaleDateString()}
                    </div>

                    {/* Show when expense was added */}
                    {expense.createdAt && (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="h-3 w-3" />
                        {formatCreatedDate(expense.createdAt)}
                      </div>
                    )}

                    {/* Payment method if available */}
                    {expense.paymentMethod && (
                      <Badge variant="outline" className="text-xs">
                        {expense.paymentMethod.toUpperCase()}
                      </Badge>
                    )}
                  </div>

                  {/* Tags if available */}
                  {expense.tags && expense.tags.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <FileText className="h-3 w-3 text-slate-400" />
                      <div className="flex gap-1 flex-wrap">
                        {expense.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs px-1 py-0"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-lg font-bold text-emerald-600">
                Rs {expense.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-3 ml-4 ">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseItem;
