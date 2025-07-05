import { useNavigate } from "react-router-dom";
import { useJournaler } from "../contexts/JournalerContext";

function Navigation({
  activeTab,
  user,
  onLogout,
  currentUsername,
}) {
  const navigate = useNavigate();
  const { journaler } = useJournaler();
  const journalTitle = journaler?.journal_title || "My Journal";

  const handleTabClick = (tab) => {
    if (tab === "feed") {
      navigate("/");
    } else if (tab === "journal") {
      if (user && currentUsername) {
        navigate(`/${currentUsername}`);
      } else {
        navigate("/auth");
      }
    } else if (tab === "more") {
      if (user) {
        navigate("/more");
      } else {
        navigate("/auth");
      }
    }
  };

  return (
    <div className="tab-navigation">
      <h1 
        className="brand-title"
        onClick={() => navigate("/")}
      >
        Annotary
      </h1>

      <div className="tabs">
        <button
          onClick={() => handleTabClick("feed")}
          className={`tab ${activeTab === "feed" ? "active" : ""}`}
        >
          Community Feed
        </button>
        <button
          onClick={() => handleTabClick("journal")}
          className={`tab ${activeTab === "journal" ? "active" : ""}`}
        >
          {journalTitle}
        </button>
        {user && (
          <button
            onClick={() => handleTabClick("more")}
            className={`tab ${activeTab === "more" ? "active" : ""}`}
          >
            More
          </button>
        )}
      </div>

      {user ? (
        <button className="btn btn-secondary btn-sm" onClick={onLogout}>
          Logout
        </button>
      ) : (
        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/auth")}>
          Sign in / Sign up
        </button>
      )}
    </div>
  );
}

export default Navigation;
