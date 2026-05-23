import LoginForm from "../components/LoginForm";
import "../style/Login.css";
import TopBar from "../components/TopBar";
import { Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";

function Login() {
  const { session, loading } = useSession();

  if (loading) {
    return null;
  }

  if (session) {
    return <Navigate to="/campaigns" replace />;
  }

  return (
    <div className="login-page">
      <TopBar />
      <main className="login-main">
        <LoginForm />
      </main>
    </div>
  );
}

export default Login;
