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
      if (error && error.code !== 'session_not_found') {
        return { error };
      }
      return { error: null };
    } catch (error) {
      console.log('SignOut error:', error);
      setUser(null);
      return { error: null };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};