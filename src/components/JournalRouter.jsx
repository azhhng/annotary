import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useJournaler } from "../contexts/JournalerContext";
import UserJournal from "../pages/UserJournal";
import OtherUserJournal from "../pages/OtherUserJournal";

function JournalRouter() {
  const { username } = useParams();
  const { user } = useAuth();
  const { journaler, loading, updateColors, updateJournalTitle } =
    useJournaler();

  if (loading || !user || !journaler) {
    return (
      <div className="loading-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Check if the username matches the current user's username
  const isOwnJournal = user && journaler && journaler.username === username;

  if (isOwnJournal) {
    return (
      <UserJournal
        journaler={journaler}
        updateColors={updateColors}
        updateJournalTitle={updateJournalTitle}
      />
    );
  } else {
    return <OtherUserJournal />;
  }
}

export default JournalRouter;
