import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useJournaler } from "../hooks/useJournaler";
import UserJournal from "../pages/UserJournal";
import OtherUserJournal from "../pages/OtherUserJournal";

function JournalRouter() {
  const { username } = useParams();
  const { user } = useAuth();
  const { journaler } = useJournaler();

  // Check if the username matches the current user's username
  const isOwnJournal = user && journaler && journaler.username === username;

  if (isOwnJournal) {
    return <UserJournal />;
  } else {
    return <OtherUserJournal />;
  }
}

export default JournalRouter;