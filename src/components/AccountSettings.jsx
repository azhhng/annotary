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
      <h3>Account Settings</h3>
      
      <div className="danger-zone">
        <h4 style={{ color: "#ff4444", marginBottom: "1rem" }}>Danger Zone</h4>
        <p style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
          This will permanently delete your entire account, including all books, journal data, and profile. This action cannot be undone.
        </p>
        
        {!showConfirmation ? (
          <button
            className="delete-account-btn"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            style={{
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem"
            }}
          >
            Delete Account
          </button>
        ) : (
          <div className="confirmation-dialog">
            <p style={{ marginBottom: "1rem", fontWeight: "bold", color: "#ff4444" }}>
              Are you absolutely sure? This will permanently delete your account and all data.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                style={{
                  backgroundColor: "#ff4444",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  fontSize: "0.9rem"
                }}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Forever"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isDeleting}
                style={{
                  backgroundColor: "#666",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountSettings;