import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useJournaler } from "../hooks/useJournaler";
import UserJournal from "../pages/UserJournal";
import OtherUserJournal from "../pages/OtherUserJournal";

function JournalRouter() {
  const { username } = useParams();
  const { user } = useAuth();
  const { journaler, loading, updateColors, updateJournalTitle } = useJournaler();

  if (loading || !user || !journaler) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Check if the username matches the current user's username
  const isOwnJournal = user && journaler && journaler.username === username;

  if (isOwnJournal) {
    return <UserJournal journaler={journaler} updateColors={updateColors} updateJournalTitle={updateJournalTitle} />;
  } else {
    return <OtherUserJournal />;
  }
}

export default JournalRouter;
