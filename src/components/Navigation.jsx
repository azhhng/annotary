import { useNavigate } from "react-router-dom";

function Navigation({ activeTab, user, onLogout, journalTitle = "My Journal" }) {
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    if (tab === "feed") {
      navigate("/");
    } else if (tab === "journal") {
      navigate(`/${user.email.split('@')[0]}`);
    }
  };

  return (
    <div className="tab-navigation">
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
      </div>
      
      {onLogout && (
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      )}
    </div>
  );
}

export default Navigation;