import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Homepage from "./pages/Homepage";
import UserJournal from "./pages/UserJournal";
import Navigation from "./components/Navigation";
import { useAuth } from "./hooks/useAuth";
import { useJournaler } from "./hooks/useJournaler";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { journaler } = useJournaler();

  const getActiveTab = () => {
    if (location.pathname === '/') return 'feed';
    return 'journal';
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // handle colors for each page
  useEffect(() => {
    if (location.pathname === '/') {
      document.body.style.background = `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`;
      document.documentElement.style.setProperty("--font-color", "#ffffff");
    }
    document.title = "Annotary";
  }, [location.pathname]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Annotary</h1>
      </header>

      <Navigation
        activeTab={getActiveTab()}
        user={user}
        onLogout={user ? handleLogout : undefined}
        showSearch={getActiveTab() === 'feed'}
        journalTitle={journaler?.journal_title || "My Journal"}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/:username" element={<UserJournal />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
