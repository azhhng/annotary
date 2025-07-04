import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useJournaler } from "../contexts/JournalerContext";
import GoodreadsImport from "./GoodreadsImport";

function AccountSettings() {
  const { deleteAccount } = useAuth();
  const { journaler, updateJournalTitle } = useJournaler();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [showImport, setShowImport] = useState(false);

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
    <>
      <div className="account-settings">
        <div className="settings-row">
          <div className="settings-action">
            <button
              onClick={handleUpdateTitle}
              disabled={
                isUpdatingTitle ||
                !titleInput.trim() ||
                titleInput === journaler?.journal_title
              }
              className="btn btn-secondary"
            >
              {isUpdatingTitle ? "Updating..." : "Change name"}
            </button>
          </div>
          <div className="settings-content">
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
              style={{ marginBottom: "0.5rem" }}
            />
            <p className="settings-description">
              Current: {journaler?.journal_title || "My Journal"}
            </p>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-action">
            <button
              onClick={() => setShowImport(true)}
              className="btn btn-secondary"
            >
              Import
            </button>
          </div>
          <div className="settings-content">
            <p className="settings-description">
              Import your books from a Goodreads CSV export. Only books that
              were read will be imported.
            </p>
          </div>
        </div>

        {!showConfirmation ? (
          <div className="settings-row">
            <div className="settings-action">
              <button
                className="btn btn-secondary btn-danger"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                Delete account
              </button>
            </div>
            <div className="settings-content">
              <p className="settings-description">
                This will permanently delete your entire account, including all
                books, journal data, and profile. This action cannot be undone.
              </p>
            </div>
          </div>
        ) : (
          <div className="settings-row">
            <div className="settings-action">
              <div className="flex gap-sm">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="btn btn-secondary btn-danger"
                >
                  {isDeleting ? "Deleting..." : "Yes, delete forever"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isDeleting}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="settings-content">
              <p className="settings-description">
                Are you absolutely sure? This will permanently delete your
                account and all data.
              </p>
            </div>
          </div>
        )}
      </div>

      {showImport && (
        <div className="modal-overlay">
          <GoodreadsImport onClose={() => setShowImport(false)} />
        </div>
      )}
    </>
  );
}

export default AccountSettings;
