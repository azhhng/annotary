import { useEffect, useState } from "react";
import { authApi } from "../services/api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const session = await authApi.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = authApi.onAuthStateChange(async (_, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, metadata = {}) => {
    return await authApi.signUp(email, password, metadata);
  };

  const signIn = async (email, password) => {
    return await authApi.signIn(email, password);
  };

  const signOut = async () => {
    try {
      const { error } = await authApi.signOut();
      if (error && error.code !== "session_not_found") {
        return { error };
      }
      return { error: null };
    } catch (error) {
      console.log("SignOut error:", error);
      setUser(null);
      return { error: null };
    }
  };

  const deleteAccount = async () => {
    if (!user) {
      return { error: "No user to delete" };
    }

    try {
      const { error } = await authApi.deleteAccount(user.id);
      if (error) {
        return { error: error.message || "Failed to delete account" };
      }

      setUser(null);
      return { error: null };
    } catch (error) {
      console.error("Delete account error:", error);
      return { error: "Failed to delete account" };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
