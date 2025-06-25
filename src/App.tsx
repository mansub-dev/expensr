import dayjs from "dayjs";
import { useState, useEffect } from "react";
import type { RootState } from "./app/store";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "./components/ui/card";
import { Wallet, Calendar, PieChart } from "lucide-react";
import { UserProfile } from "./components/auth/userProfile";
import { ProtectedRoute } from "./components/auth/protected-route";
import { loadUserExpenses } from "./features/expenses/expensesSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const expenses = useSelector((state: RootState) => state.expenses.list);
  const [currentTime, setCurrentTime] = useState(dayjs());

  // Load user's expenses when they login
  useEffect(() => {
    if (user?.id) {
      dispatch(loadUserExpenses(user.id));
    }
  }, [dispatch, user?.id]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Filter expenses to show only current user's expenses
  const userExpenses = expenses.filter(
    (expense) => expense.userId === user?.id
  );

  // Calculated values based on user's expenses only
  const total = userExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();

  const monthlyTotal = userExpenses
    .filter((exp) => {
      const date = dayjs(exp.date);
      return date.month() === currentMonth && date.year() === currentYear;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  const uniqueCategories = new Set(userExpenses.map((e) => e.category)).size;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Navbar with User Profile */}
        <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left side - Logo and Add Button */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-slate-800">Expensr</h1>
                </div>
                {/* Desktop Add Button */}
              </div>

              {/* Right side - Date/Time and User Profile */}
              <div className="flex items-center gap-4">
                {/* Date and Time (Desktop only) */}
                <div>
                  <div className="">
                    <ExpenseForm userId={user?.id ?? ""} />
                  </div>
                </div>

                {/* User Profile */}
                <UserProfile />

                {/* Mobile Add Button */}
                {/* <div className="sm:hidden">
                  <ExpenseForm userId={user?.id ?? ""} />
                </div> */}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome Message - Mobile Friendly */}

          {/* Summary Cards - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1">
                      Total Expenses
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold">
                      Rs {total.toFixed(2)}
                    </p>
                    <p className="text-emerald-200 text-xs mt-1">
                      {userExpenses.length} transactions
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <Wallet className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs sm:text-sm font-medium mb-1">
                      This Month
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold">
                      Rs {monthlyTotal.toFixed(2)}
                    </p>
                    <p className="text-blue-200 text-xs mt-1">
                      {currentTime.format("MMMM YYYY")}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white overflow-hidden sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs sm:text-sm font-medium mb-1">
                      Categories Used
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold">
                      {uniqueCategories}
                    </p>
                    <p className="text-purple-200 text-xs mt-1">
                      Active categories
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <PieChart className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats for Mobile */}
          <div className="block sm:hidden mb-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">
                      {userExpenses.length > 0
                        ? Math.round(total / userExpenses.length)
                        : 0}
                    </p>
                    <p className="text-xs text-slate-600">Avg per expense</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {
                        userExpenses.filter((exp) =>
                          dayjs(exp.date).isAfter(dayjs().subtract(7, "day"))
                        ).length
                      }
                    </p>
                    <p className="text-xs text-slate-600">This week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expense List */}
          <ExpenseList />
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default App;
