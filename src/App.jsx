import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Homepage from "./pages/Homepage";
import AuthPage from "./pages/AuthPage";
import JournalRouter from "./components/JournalRouter";
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
    try {
      await signOut();
    } catch (error) {
      console.log('Logout error (likely expired session):', error);
      // Even if signOut fails, we should still clear the local state and redirect
    }
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
        onLogout={handleLogout}
        journalTitle={user && journaler?.journal_title ? journaler.journal_title : "My Journal"}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/:username" element={<JournalRouter />} />
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
