"use client";

import { useAuthEventListener } from "@/features/auth/hooks/useAuthEventListener";

const AuthProvider = ({ children }) => {
  useAuthEventListener();
  return children;
};

export default AuthProvider;
