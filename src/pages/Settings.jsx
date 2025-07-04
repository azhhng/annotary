import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AccountSettings from "../components/AccountSettings";
import { COLORS, createGradientBackground } from "../constants/colors";

function Settings() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = createGradientBackground(
      COLORS.PRIMARY_GRADIENT_START,
      COLORS.PRIMARY_GRADIENT_END
    );
    document.documentElement.style.setProperty(
      "--font-color",
      COLORS.PRIMARY_FONT
    );
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="loading-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <AccountSettings />
      </div>
    </div>
  );
}

export default Settings;
