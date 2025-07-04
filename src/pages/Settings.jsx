import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useJournaler } from "../contexts/JournalerContext";
import AccountSettings from "../components/AccountSettings";
import { COLORS, createGradientBackground } from "../constants/colors";

function Settings() {
  const { user, loading } = useAuth();
  const { journaler, updateJournalTitle, refetch } = useJournaler();
  const navigate = useNavigate();
  const [titleInput, setTitleInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    document.body.style.background = createGradientBackground(
      COLORS.PRIMARY_GRADIENT_START,
      COLORS.PRIMARY_GRADIENT_END
    );
    document.documentElement.style.setProperty(
      "--font-color",
      COLORS.PRIMARY_FONT
    );
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (journaler?.journal_title) {
      setTitleInput(journaler.journal_title);
    }
  }, [journaler?.journal_title]);

  const handleUpdateTitle = async () => {
    if (!titleInput.trim() || titleInput === journaler?.journal_title) return;
    
    setIsUpdating(true);
    try {
      const result = await updateJournalTitle(titleInput.trim());
      if (result?.error) {
        console.error("Failed to update title:", result.error);
      }
    } catch (error) {
      console.error("Failed to update title:", error);
    }
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="settings-page">
      <div className="container" style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
        <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>Settings</h1>
        
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
            <button
              onClick={handleUpdateTitle}
              disabled={isUpdating || !titleInput.trim() || titleInput === journaler?.journal_title}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                color: "var(--font-color)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                cursor: isUpdating || !titleInput.trim() || titleInput === journaler?.journal_title ? "not-allowed" : "pointer",
                fontSize: "0.875rem",
                transition: "all 0.2s",
                flexShrink: 0,
                opacity: isUpdating || !titleInput.trim() || titleInput === journaler?.journal_title ? 0.6 : 1
              }}
            >
              {isUpdating ? "Updating..." : "Change name"}
            </button>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="Enter journal title"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "var(--font-color)",
                  fontSize: "0.9rem",
                  outline: "none",
                  lineHeight: "1.5"
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateTitle();
                  }
                }}
              />
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.8rem", opacity: 0.7 }}>
                Current: {journaler?.journal_title || "My Journal"}
              </p>
            </div>
          </div>
        </div>

        <AccountSettings />
      </div>
    </div>
  );
}

export default Settings;