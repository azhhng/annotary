import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import UserJournal from "../pages/UserJournal";
import OtherUserJournal from "../pages/OtherUserJournal";

function JournalRouter() {
  const { username } = useParams();
  const { user } = useAuth();

  // Check if the username matches the current user's username
  const isOwnJournal = user && user.email && user.email.split('@')[0] === username;

  if (isOwnJournal) {
    return <UserJournal />;
  } else {
    return <OtherUserJournal />;
  }
}

export default JournalRouter;