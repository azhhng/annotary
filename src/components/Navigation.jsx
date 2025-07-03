import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navigation({ activeTab, user, onLogout, showSearch = false }) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    if (tab === "feed") {
      navigate("/");
    } else if (tab === "journal") {
      navigate(`/${user.email.split('@')[0]}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      navigate(`/${username.trim()}`);
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
          My Journal
        </button>
      </div>
      
      {showSearch ? (
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Search username..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Go
          </button>
        </form>
      ) : (
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      )}
    </div>
  );
}

export default Navigation;