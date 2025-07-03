import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthForm from "../components/AuthForm";
import { useEffect } from "react";

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "2rem auto",
        padding: "2rem",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
      }}
    >
      <AuthForm />
    </div>
  );
}

export default AuthPage;
