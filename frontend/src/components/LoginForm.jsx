import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/LoginForm.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const testEmail = "test@gmail.com";
  const testPassword = "1234";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === testEmail && password === testPassword) {
      setError("");
      navigate("/Home");
    } else {
      setError("Wrong email or password");
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-form-title">Login</h2>

        <label className="login-form-label">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-form-input"
        />

        <label className="login-form-label">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-form-input"
        />

        {error && <p className="login-form-error">{error}</p>}

        <button type="submit" className="login-form-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;