import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/LoginForm.css";
import { supabase } from "../services/supabaseClient";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      setError("");
      void navigate("/");
    }
  };

  return (
    <div className="login-form-container">
      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        className="login-form"
      >
        <h2 className="login-form-title">Login</h2>

        <label htmlFor="login-email" className="login-form-label">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-form-input"
        />

        <label htmlFor="login-password" className="login-form-label">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-form-input"
        />

        <Link to="/signup" className="login-form-label">
          Create account
        </Link>

        {error && <p className="login-form-error">{error}</p>}

        <button type="submit" className="login-form-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
