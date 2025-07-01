import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export const useJournaler = () => {
  const { user } = useAuth();
  const [journaler, setJournaler] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJournaler = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("journalers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setJournaler(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateJournaler = async (updates) => {
    if (!user || !journaler) return;

    try {
      const { data, error } = await supabase
        .from("journalers")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return { error };
      } else {
        setJournaler(data);
        return { data };
      }
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    }
  };

  const updateColors = async (gradientStart, gradientEnd, fontColor) => {
    const isValidHex = (hex) => /^#[0-9A-F]{6}$/i.test(hex);

    return updateJournaler({
      gradient_start_color: isValidHex(gradientStart)
        ? gradientStart
        : "#667eea",
      gradient_end_color: isValidHex(gradientEnd) ? gradientEnd : "#764ba2",
      font_color: isValidHex(fontColor) ? fontColor : "#ffffff",
    });
  };

  const updateJournalTitle = async (title) => {
    return updateJournaler({
      journal_title: title,
    });
  };

  useEffect(() => {
    fetchJournaler();
  }, [user]);

  return {
    journaler,
    loading,
    error,
    updateJournaler,
    updateColors,
    updateJournalTitle,
    refetch: fetchJournaler,
  };
};
