import { useState, useEffect } from "react";

export function useTheme() {
  const [bgColors, setBgColors] = useState({
    start: "#ffffff",
    end: "#ffffff",
  });
  const [fontColor, setFontColor] = useState("#ffffff");
  const [journalTitle, setJournalTitle] = useState("loading");

  useEffect(() => {
    document.body.style.background = `linear-gradient(135deg, ${bgColors.start} 0%, ${bgColors.end} 100%)`;
  }, [bgColors]);

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
