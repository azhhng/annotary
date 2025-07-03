import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Homepage from "./pages/Homepage";
import AuthPage from "./pages/AuthPage";
import Settings from "./pages/Settings";
import JournalRouter from "./components/JournalRouter";
import Navigation from "./components/Navigation";
import { useAuth } from "./hooks/useAuth";
import { useJournaler } from "./hooks/useJournaler";
import { COLORS, createGradientBackground } from "./constants/colors";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { journaler } = useJournaler();

  const getActiveTab = () => {
    if (location.pathname === "/") return "feed";
    if (location.pathname === "/auth") return null;
    if (location.pathname === "/settings") return "settings";

    const username = location.pathname.slice(1);

    if (user && journaler) {
      const currentUsername = journaler.username;
      const isOwnJournal = currentUsername === username;
      return isOwnJournal ? "journal" : null;
    }

    return null;
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log("Logout error (likely expired session):", error);
    }
    navigate("/");
  };

  // handle colors for each page
  useEffect(() => {
    if (location.pathname === "/") {
      document.body.style.background = createGradientBackground(
        COLORS.PRIMARY_GRADIENT_START,
        COLORS.PRIMARY_GRADIENT_END
      );
      document.documentElement.style.setProperty(
        "--font-color",
        COLORS.PRIMARY_FONT
      );
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
        journalTitle={
          user && journaler?.journal_title
            ? journaler.journal_title
            : "My Journal"
        }
        currentUsername={journaler?.username}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/settings" element={<Settings />} />
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
