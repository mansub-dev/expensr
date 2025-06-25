import { Button } from "../ui/button";
import type { RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { User, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const expenses = useSelector((state: RootState) => state.expenses.list);

  // Filter to get current user's expense count
  const userExpenseCount = expenses.filter(
    (expense) => expense.userId === user?.id
  ).length;

  const handleLogout = () => {
    dispatch(logout());
    // dispatch(clearUserExpenses());
    localStorage.removeItem("pennywise_user");
    // Clear user-specific expenses
    if (user?.id) {
      localStorage.removeItem(`pennywise_expenses_${user.id}`);
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 hover:bg-slate-50 p-2"
        >
          {/* Mobile: Just show user icon */}
          <div className="p-1 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full">
            <User className="h-4 w-4 text-white" />
          </div>

          {/* Desktop: Show user info */}
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500">
              {userExpenseCount} expenses
            </p>
          </div>

          {/* Desktop: Show dropdown arrow */}
          <ChevronDown className="h-4 w-4 text-slate-500 hidden md:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 bg-white">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-slate-600">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
