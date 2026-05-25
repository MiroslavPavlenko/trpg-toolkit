import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SignUpForm from "@/components/SignUpForm";

vi.mock("@/services/supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
  },
}));

import { supabase } from "@/services/supabaseClient";

const setup = () => {
  const utils = render(
    <MemoryRouter>
      <SignUpForm />
    </MemoryRouter>,
  );
  return { ...utils, user: userEvent.setup() };
};

describe("<SignUpForm />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all fields and the submit button", () => {
    setup();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("renders a link back to login", () => {
    setup();
    expect(screen.getByRole("link", { name: /already have an account/i })).toBeInTheDocument();
  });

  it("shows an error when password is shorter than 8 characters", async () => {
    const { user } = setup();
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "short");
    await user.type(screen.getByLabelText(/confirm password/i), "short");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it("shows an error when passwords do not match", async () => {
    const { user } = setup();
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "different123");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("shows an error when the email is already registered", async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { identities: [] } },
      error: null,
    });
    const { user } = setup();
    await user.type(screen.getByLabelText(/email/i), "existing@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    expect(screen.getByText(/already exists/i)).toBeInTheDocument();
  });

  it("shows an error returned by supabase", async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: { message: "Signup is disabled" },
    });
    const { user } = setup();
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    expect(screen.getByText(/signup is disabled/i)).toBeInTheDocument();
  });

  it("shows a success screen with the email after a valid signup", async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { identities: [{ id: "abc" }] } },
      error: null,
    });
    const { user } = setup();
    await user.type(screen.getByLabelText(/email/i), "new@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    expect(screen.getByText(/check your email/i)).toBeInTheDocument();
    expect(screen.getByText(/new@example.com/i)).toBeInTheDocument();
  });

  it("uses the current localhost origin for email confirmation redirects", async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { identities: [{ id: "abc" }] } },
      error: null,
    });
    const { user } = setup();
    await user.type(screen.getByLabelText(/email/i), "local@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: "local@example.com",
      password: "password123",
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
  });
});
