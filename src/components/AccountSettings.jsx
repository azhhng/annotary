import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useJournaler } from "../contexts/JournalerContext";

function AccountSettings() {
  const { deleteAccount } = useAuth();
  const { journaler, updateJournalTitle } = useJournaler();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);

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

  useEffect(() => {
    if (journaler?.journal_title) {
      setTitleInput(journaler.journal_title);
    }
  }, [journaler?.journal_title]);

  const handleUpdateTitle = async () => {
    if (!titleInput.trim() || titleInput === journaler?.journal_title) return;

    setIsUpdatingTitle(true);
    try {
      const result = await updateJournalTitle(titleInput.trim());
      if (result?.error) {
        console.error("Failed to update title:", result.error);
      }
    } catch (error) {
      console.error("Failed to update title:", error);
    }
    setIsUpdatingTitle(false);
  };

  return (
    <div className="account-settings">
      <div className="settings-section">
        <div className="flex gap-lg">
          <button
            onClick={handleUpdateTitle}
            disabled={
              isUpdatingTitle ||
              !titleInput.trim() ||
              titleInput === journaler?.journal_title
            }
            className="btn btn-secondary btn-sm"
          >
            {isUpdatingTitle ? "Updating..." : "Change name"}
          </button>
          <div className="flex-col gap-sm">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Enter journal title"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateTitle();
                }
              }}
            />
            <p style={{ fontSize: 'var(--font-size-xs)', opacity: 0.7, margin: '0.5rem 0 0 0' }}>
              Current: {journaler?.journal_title || "My Journal"}
            </p>
          </div>
        </div>
      </div>

      {!showConfirmation ? (
        <div className="flex gap-lg">
          <button
            className="btn btn-secondary btn-sm btn-danger"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            Delete account
          </button>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: 1.5, flex: 1 }}>
            This will permanently delete your entire account, including all
            books, journal data, and profile. This action cannot be undone.
          </p>
        </div>
      ) : (
        <div className="flex gap-lg">
          <div className="flex gap-sm">
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="btn btn-secondary btn-sm btn-danger"
            >
              {isDeleting ? "Deleting..." : "Yes, delete forever"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isDeleting}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
          </div>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: 1.5, flex: 1 }}>
            Are you absolutely sure? This will permanently delete your account
            and all data.
          </p>
        </div>
      )}
    </div>
  );
}

export default AccountSettings;
