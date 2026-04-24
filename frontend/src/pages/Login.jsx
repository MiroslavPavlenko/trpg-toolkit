import LoginForm from "../components/LoginForm";
import { FaGithub } from "react-icons/fa";
import "../style/Login.css";

function Login() {
  return (
    <div className="login-page">
      <nav className="login-navbar">
        <h2 className="login-logo">TRPG ToolKit</h2>

        <a
          href="https://github.com/eblaug-uw/trpg-toolkit"
          target="_blank"
          rel="noreferrer"
          className="login-github-link"
        >
          <FaGithub />
        </a>
      </nav>

      <main className="login-main">
        <LoginForm />
      </main>
    </div>
  );
}

export default Login;