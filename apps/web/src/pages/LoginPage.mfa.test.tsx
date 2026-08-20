import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

const verifyMfaChallenge = vi.fn();
const logout = vi.fn();

vi.mock("../lib/auth", () => ({
  useAuth: () => ({
    status: "mfa_challenge",
    isDemo: false,
    loginDemo: vi.fn(),
    loginWithPassword: vi.fn(),
    resetPassword: vi.fn(),
    verifyMfaChallenge,
    logout,
  }),
}));

vi.mock("../lib/toast", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe("LoginPage — mfa_challenge status", () => {
  it("shows the 6-digit code form instead of the email/password form", () => {
    renderLogin();
    expect(screen.getByText("Verificación en dos pasos")).toBeInTheDocument();
    expect(screen.queryByLabelText("Correo")).not.toBeInTheDocument();
  });

  it("disables submit until exactly 6 digits are entered, then calls verifyMfaChallenge", async () => {
    verifyMfaChallenge.mockResolvedValueOnce({});
    const user = userEvent.setup();
    renderLogin();

    const submit = screen.getByRole("button", { name: "Verificar" });
    expect(submit).toBeDisabled();

    const input = screen.getByLabelText("Código de verificación");
    await user.type(input, "12345");
    expect(submit).toBeDisabled();

    await user.type(input, "6");
    expect(submit).toBeEnabled();

    await user.click(submit);
    expect(verifyMfaChallenge).toHaveBeenCalledWith("123456");
  });

  it("strips non-digit characters as they're typed", async () => {
    const user = userEvent.setup();
    renderLogin();
    const input = screen.getByLabelText("Código de verificación") as HTMLInputElement;
    await user.type(input, "12a3-4b56");
    expect(input.value).toBe("123456");
  });

  it("shows the error and clears the field when the code is wrong", async () => {
    verifyMfaChallenge.mockResolvedValueOnce({ error: "Código incorrecto" });
    const user = userEvent.setup();
    renderLogin();

    const input = screen.getByLabelText("Código de verificación") as HTMLInputElement;
    await user.type(input, "000000");
    await user.click(screen.getByRole("button", { name: "Verificar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Código incorrecto");
    expect(input.value).toBe("");
  });

  it("lets the user cancel and sign out instead of being stuck if they can't complete the code", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: "Cancelar y volver a iniciar sesión" }));

    expect(logout).toHaveBeenCalled();
  });
});
