import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

const loginWithPassword = vi.fn().mockResolvedValue({});
const resetPassword = vi.fn().mockResolvedValue({});
const showToast = vi.fn();

vi.mock("../lib/auth", () => ({
  useAuth: () => ({
    status: "anon",
    isDemo: false,
    loginDemo: vi.fn(),
    loginWithPassword,
    resetPassword,
  }),
}));

vi.mock("../lib/toast", () => ({
  useToast: () => ({ showToast }),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe("LoginPage — real auth mode (isDemo: false)", () => {
  it("shows the email/password form by default, not the demo picker", () => {
    renderLogin();
    expect(screen.getByLabelText("Correo")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(screen.queryByText("Modo demo — sin Supabase conectado. Elige tu perfil para entrar.")).not.toBeInTheDocument();
  });

  it("switches to the password-reset view and back", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByText("¿Olvidaste tu contraseña?"));
    expect(screen.getByText("Recuperar contraseña")).toBeInTheDocument();
    expect(screen.queryByLabelText("Contraseña")).not.toBeInTheDocument();

    await user.click(screen.getByText("Volver a iniciar sesión"));
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
  });

  it("submits the reset form with the typed email and shows a confirmation toast", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByText("¿Olvidaste tu contraseña?"));
    await user.type(screen.getByLabelText("Correo"), "socio@eonesia.com");
    await user.click(screen.getByRole("button", { name: "Enviar enlace" }));

    await waitFor(() => expect(resetPassword).toHaveBeenCalledWith("socio@eonesia.com"));
    await waitFor(() => expect(showToast).toHaveBeenCalledWith(expect.stringContaining("socio@eonesia.com")));
    // returns to the login view after a successful send
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
  });

  it("shows an error and stays on the reset view when resetPassword fails", async () => {
    resetPassword.mockResolvedValueOnce({ error: "Correo no encontrado" });
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByText("¿Olvidaste tu contraseña?"));
    await user.type(screen.getByLabelText("Correo"), "nadie@eonesia.com");
    await user.click(screen.getByRole("button", { name: "Enviar enlace" }));

    expect(await screen.findByText("Correo no encontrado")).toBeInTheDocument();
    expect(screen.getByText("Recuperar contraseña")).toBeInTheDocument();
  });

  it("announces the auth error to screen readers via role=alert", async () => {
    loginWithPassword.mockResolvedValueOnce({ error: "Credenciales incorrectas" });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Correo"), "socio@eonesia.com");
    await user.type(screen.getByLabelText("Contraseña"), "wrong");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Credenciales incorrectas");
  });
});
