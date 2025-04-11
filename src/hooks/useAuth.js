// src/hooks/useAuth.js

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Make sure the component using this hook is within an AuthProvider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

export default useAuth;