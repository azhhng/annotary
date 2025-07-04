import { useNavigate } from "react-router-dom";

function Navigation({
  activeTab,
  user,
  onLogout,
  journalTitle = "My Journal",
  currentUsername,
}) {
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    if (tab === "feed") {
      navigate("/");
    } else if (tab === "journal") {
      if (user && currentUsername) {
        navigate(`/${currentUsername}`);
      } else {
        navigate("/auth");
      }
    } else if (tab === "settings") {
      if (user) {
        navigate("/settings");
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
        style={{
          margin: 0,
          color: "var(--font-color)",
          fontSize: "1.2rem",
          fontWeight: "normal",
          cursor: "pointer",
          marginRight: "2rem"
        }}
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
            onClick={() => handleTabClick("settings")}
            className={`tab ${activeTab === "settings" ? "active" : ""}`}
          >
            Settings
          </button>
        )}
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
