import { useState } from "react";
import { FaExclamationTriangle, FaGithub, FaTrashAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import { supabase } from "../services/supabaseClient";
import Modal from "./Modal";
import { useRuleSet } from "../context/RuleSetContext";

function TopBar() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { ruleSet, setRuleSet } = useRuleSet();

  const getDeleteAccountError = (error) => {
    const message = error?.message || "";
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("failed to send a request")) {
      return "The delete-account function could not be reached. Confirm it is deployed to this Supabase project and that supabase/config.toml was included in the deploy.";
    }

    if (lowerMessage.includes("non-2xx")) {
      return "The delete-account function responded with an error. Check the function logs in Supabase for the exact server error.";
    }

    if (lowerMessage.includes("edge function")) {
      return "Delete account is not available yet. Please deploy the delete-account Supabase function to this Supabase project and try again.";
    }

    return message || "Unable to delete account. Please try again.";
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    if (isDeleting) return;
    setMenuOpen(false);
    setConfirmDelete(false);
    setDeleteError("");
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError("");

    const { error } = await supabase.functions.invoke("delete-account", {
      method: "POST",
    });

    if (error) {
      console.error("Delete account failed", error);
      setDeleteError(getDeleteAccountError(error));
      setIsDeleting(false);
      return;
    }

    await supabase.auth.signOut();
    setIsDeleting(false);
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid #222",
        background: "#222",
        color: "white",
      }}
    >
      <h2 style={{ margin: 0 }}>
        {session
          ? `Welcome, ${session.user.user_metadata?.full_name ?? session.user.email}`
          : "TRPG ToolKit"}
      </h2>

      {session ? (
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#2a3439",
            border: "1px solid #4b5563",
            borderRadius: "6px",
            color: "white",
            fontSize: "1rem",
            cursor: "pointer",
            padding: "8px 12px",
          }}
          aria-label="manage account"
        >
          <FaUserCircle />
          Manage Account
        </button>
      ) : (
        <a
          href="https://github.com/eblaug-uw/trpg-toolkit"
          target="_blank"
          rel="noreferrer"
          style={{ color: "white", fontSize: "1.5rem" }}
        >
          <FaGithub />
        </a>
      )}
      <Modal
        isOpen={menuOpen}
        onClose={closeMenu}
        title={confirmDelete ? "Delete account" : "Manage account"}
      >
        {confirmDelete ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <FaExclamationTriangle
                style={{ color: "#f87171", fontSize: "1.5rem", flexShrink: 0 }}
              />
              <p style={{ margin: 0, lineHeight: 1.5 }}>
                Are you sure you want to delete your account? This is permanent. Your account and
                all user data will be deleted and cannot be recovered.
              </p>
            </div>

            {deleteError ? (
              <p role="alert" style={{ color: "#fca5a5", margin: 0 }}>
                {deleteError}
              </p>
            ) : null}

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  setDeleteError("");
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#dc2626",
                  border: "1px solid #ef4444",
                  color: "white",
                }}
              >
                <FaTrashAlt />
                {isDeleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label htmlFor="ruleset">Choose Rule Set</label>
              <select id="ruleset" value={ruleSet} onChange={(e) => setRuleSet(e.target.value)}>
                <option value="5.0">5.0</option>
                <option value="5.5">5.5</option>
              </select>
            </div>

            <button onClick={handleSignOut}>Sign Out</button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                color: "#fca5a5",
              }}
            >
              <FaTrashAlt />
              Delete Account
            </button>
          </div>
        )}
      </Modal>
    </nav>
  );
}

export default TopBar;
