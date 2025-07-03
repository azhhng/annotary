import { useState, useEffect } from "react";

export function useTheme() {
  const [bgColors, setBgColors] = useState({
    start: "#667eea",
    end: "#764ba2",
  });
  const [fontColor, setFontColor] = useState("#ffffff");
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
