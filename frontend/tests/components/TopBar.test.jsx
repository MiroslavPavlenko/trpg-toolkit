import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TopBar from "@/components/TopBar";

vi.mock("@/hooks/useSession", () => ({
  useSession: () => ({
    session: {
      user: {
        email: "player@example.com",
        user_metadata: {},
      },
    },
    loading: false,
  }),
}));

vi.mock("@/services/supabaseClient", () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({}),
    },
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: { ok: true }, error: null }),
    },
  },
}));

import { supabase } from "@/services/supabaseClient";

const setup = () => {
  const utils = render(
    <MemoryRouter initialEntries={["/campaigns"]}>
      <Routes>
        <Route path="/campaigns" element={<TopBar />} />
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>,
  );

  return { ...utils, user: userEvent.setup() };
};

describe("<TopBar />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("asks for confirmation before deleting an account", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /manage account/i }));
    await user.click(screen.getByRole("button", { name: /delete account/i }));

    expect(screen.getByText(/are you sure you want to delete your account/i)).toBeInTheDocument();
    expect(screen.getByText(/all user data will be deleted/i)).toBeInTheDocument();
    expect(supabase.functions.invoke).not.toHaveBeenCalled();
  });

  it("invokes the delete-account function and signs out after confirmation", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /manage account/i }));
    await user.click(screen.getByRole("button", { name: /delete account/i }));
    await user.click(screen.getByRole("button", { name: /^delete account$/i }));

    expect(supabase.functions.invoke).toHaveBeenCalledWith("delete-account", {
      method: "POST",
    });
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(await screen.findByText(/login page/i)).toBeInTheDocument();
  });
});
