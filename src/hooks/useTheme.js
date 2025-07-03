import { useState, useEffect } from "react";
import { COLORS } from "../constants/colors";

export function useTheme() {
  const [bgColors, setBgColors] = useState({
    start: COLORS.PRIMARY_GRADIENT_START,
    end: COLORS.PRIMARY_GRADIENT_END,
  });
  const [fontColor, setFontColor] = useState(COLORS.PRIMARY_FONT);
  const [journalTitle, setJournalTitle] = useState("loading");

  useEffect(() => {
    document.documentElement.style.setProperty("--font-color", fontColor);
  }, [fontColor]);

  useEffect(() => {
    document.title = journalTitle;
  }, [journalTitle]);

  return {
    bgColors,
    setBgColors,
    fontColor,
    setFontColor,
    journalTitle,
    setJournalTitle,
  };
}
