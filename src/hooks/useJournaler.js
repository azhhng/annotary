import { useState, useEffect, useCallback } from "react";
import { journalersApi } from "../services/api";
import { useAuth } from "./useAuth";
import { COLORS, getValidColor } from "../constants/colors";

export const useJournaler = () => {
  const { user } = useAuth();
  const [journaler, setJournaler] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return updateJournaler({
      gradient_start_color: getValidColor(
        gradientStart,
        COLORS.PRIMARY_GRADIENT_START
      ),
      gradient_end_color: getValidColor(
        gradientEnd,
        COLORS.PRIMARY_GRADIENT_END
      ),
      font_color: getValidColor(fontColor, COLORS.PRIMARY_FONT),
    });
  };

  const updateJournalTitle = async (title) => {
    return updateJournaler({
      journal_title: title,
    });
  };

  const fetchJournaler = useCallback(async () => {
    if (!user?.id) {
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
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await journalersApi.getJournaler(user.id);
        setJournaler(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

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
