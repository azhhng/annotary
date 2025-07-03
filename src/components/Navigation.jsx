import { useNavigate } from "react-router-dom";

function Navigation({ activeTab, user, onLogout, journalTitle = "My Journal" }) {
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    if (tab === "feed") {
      navigate("/");
    } else if (tab === "journal") {
      if (user && user.email) {
        navigate(`/${user.email.split('@')[0]}`);
      } else {
        navigate("/auth");
      }
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

      <div className="nav-actions">
        {user ? (
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <button className="signin-btn" onClick={() => navigate("/auth")}>
            Sign in / Sign up
          </button>
        )}
      </div>
    </div>
  );
}

export default Navigation;
