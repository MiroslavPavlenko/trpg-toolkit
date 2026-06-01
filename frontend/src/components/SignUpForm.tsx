import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/SignUpForm.css";
import { getEmailRedirectUrl } from "../services/authRedirect";
import { supabase } from "../services/supabaseClient";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getEmailRedirectUrl(),
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.user?.identities?.length === 0) {
      // Supabase silently no-ops on duplicate emails when confirmation is on;
      // an empty identities array is the only client-side signal.
      setError("An account with this email already exists.");
    } else {
      setError("");
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="signup-form-container">
        <div className="signup-form">
          <h2 className="signup-form-title">Check your email</h2>
          <p className="signup-form-success">
            A verification link has been sent to <strong>{email}</strong>. Please check your inbox
            to confirm your account.
          </p>
          <Link to="/login" className="signup-form-login-link">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-form-container">
      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        className="signup-form"
      >
        <h2 className="signup-form-title">Sign Up</h2>

        <label htmlFor="signup-email" className="signup-form-label">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-form-input"
          required
        />

        <label htmlFor="signup-password" className="signup-form-label">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-form-input"
          required
        />

        <label htmlFor="signup-confirm-password" className="signup-form-label">
          Confirm Password
        </label>
        <input
          id="signup-confirm-password"
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="signup-form-input"
          required
        />

        {error && <p className="signup-form-error">{error}</p>}

        <button type="submit" className="signup-form-button">
          Create Account
        </button>

        <Link to="/login" className="signup-form-login-link">
          Already have an account? Log in
        </Link>
      </form>
    </div>
  );
}

export default SignUpForm;
