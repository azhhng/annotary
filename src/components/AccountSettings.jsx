import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function AccountSettings() {
  const { deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteAccount = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setIsDeleting(true);

    try {
      const { error } = await deleteAccount();

      if (error) {
        alert(`Failed to delete account: ${error}`);
        setIsDeleting(false);
        setShowConfirmation(false);
        return;
      }

      alert("Account permanently deleted successfully.");
      navigate("/");
    } catch (error) {
      alert("Failed to delete account");
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="account-settings">

      {!showConfirmation ? (
          <div
            style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}
          >
            <button
              className="delete-account-btn"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                color: "var(--font-color)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 100, 100, 0.3)";
                e.target.style.borderColor = "rgba(255, 100, 100, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
              }}
            >
              Delete account
            </button>
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                lineHeight: "1.5",
                flex: 1,
              }}
            >
              This will permanently delete your entire account, including all
              books, journal data, and profile. This action cannot be undone.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                style={{
                  background: "rgba(255, 100, 100, 0.3)",
                  color: "var(--font-color)",
                  border: "1px solid rgba(255, 100, 100, 0.5)",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  fontSize: "0.875rem",
                  transition: "all 0.2s",
                }}
              >
                {isDeleting ? "Deleting..." : "Yes, delete forever"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isDeleting}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "var(--font-color)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  transition: "all 0.2s",
                }}
              >
                Cancel
              </button>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                lineHeight: "1.5",
                flex: 1,
                color: "var(--font-color)",
              }}
            >
              Are you absolutely sure? This will permanently delete your account
              and all data.
            </p>
          </div>
        )}
    </div>
  );
}

export default AccountSettings;
