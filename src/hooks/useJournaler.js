import { useState, useEffect, useCallback } from "react";
import { journalersApi } from "../services/api";
import { useAuth } from "./useAuth";

export const useJournaler = () => {
  const { user } = useAuth();
  const [journaler, setJournaler] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJournaler = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const data = await journalersApi.getJournaler(user.id);
      setJournaler(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateJournaler = async (updates) => {
    if (!user || !journaler) return;

    try {
      const data = await journalersApi.updateJournaler(user.id, updates);
      setJournaler(data);
      return { data };
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
  }, [fetchJournaler]);

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
