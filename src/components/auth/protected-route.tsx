import type React from "react";
import { useEffect } from "react";
import { LoginForm } from "./login";
import type { RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("pennywise_user");
    if (savedUser && !user) {
      dispatch(loginSuccess(JSON.parse(savedUser)));
    }
  }, [dispatch, user]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <>{children}</>;
};
