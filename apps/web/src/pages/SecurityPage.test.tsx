import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SecurityPage } from "./SecurityPage";
import { NotificationsProvider } from "../lib/notifications";
import { PermissionsProvider } from "../lib/permissions";
import { FavoritesProvider } from "../lib/favorites";

const listMfaFactors = vi.fn();
const enrollMfa = vi.fn();
const confirmMfaEnrollment = vi.fn();
const unenrollMfa = vi.fn();
let isDemo = false;

vi.mock("../lib/auth", () => ({
  useAuth: () => ({
    isDemo,
    profile: { id: "s1", name: "Socio Test", initials: "ST", email: "s@eonesia.com", role: "socio" },
    listMfaFactors,
    enrollMfa,
    confirmMfaEnrollment,
    unenrollMfa,
  }),
}));

vi.mock("../lib/toast", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <NotificationsProvider>
        <PermissionsProvider>
          <FavoritesProvider>
            <SecurityPage />
          </FavoritesProvider>
        </PermissionsProvider>
      </NotificationsProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  isDemo = false;
  listMfaFactors.mockResolvedValue({ factors: [] });
  localStorage.clear();
});

describe("SecurityPage — demo mode", () => {
  it("shows a message explaining 2FA needs a real Supabase project, without calling listMfaFactors", () => {
    isDemo = true;
    renderPage();
    expect(screen.getByText("No disponible en modo demo")).toBeInTheDocument();
    expect(listMfaFactors).not.toHaveBeenCalled();
  });
});

describe("SecurityPage — not enrolled", () => {
  it("shows the activation prompt once factors have loaded", async () => {
    renderPage();
    expect(await screen.findByText("Verificación en dos pasos desactivada")).toBeInTheDocument();
  });

  it("walks the full enroll flow: start -> QR shown -> confirm with code -> enrolled", async () => {
    enrollMfa.mockResolvedValue({ factorId: "factor-1", qrCode: "data:image/svg+xml;base64,AAA", secret: "SECRET123" });
    confirmMfaEnrollment.mockResolvedValue({});
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole("button", { name: "Activar verificación en dos pasos" }));

    expect(await screen.findByText("Escanea el código QR")).toBeInTheDocument();
    expect(screen.getByText("SECRET123")).toBeInTheDocument();
    expect(screen.getByAltText(/código qr/i)).toHaveAttribute("src", "data:image/svg+xml;base64,AAA");

    const confirmButton = screen.getByRole("button", { name: "Confirmar" });
    expect(confirmButton).toBeDisabled();

    await user.type(screen.getByLabelText("Código de 6 dígitos"), "123456");
    expect(confirmButton).toBeEnabled();
    await user.click(confirmButton);

    expect(confirmMfaEnrollment).toHaveBeenCalledWith("factor-1", "123456");
    await waitFor(() => expect(screen.getByText("Verificación en dos pasos activada")).toBeInTheDocument());
  });

  it("shows the error and lets the user retry when the confirm code is wrong", async () => {
    enrollMfa.mockResolvedValue({ factorId: "factor-1", qrCode: "data:image/svg+xml;base64,AAA", secret: "SECRET123" });
    confirmMfaEnrollment.mockResolvedValue({ error: "Código incorrecto" });
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole("button", { name: "Activar verificación en dos pasos" }));
    await user.type(screen.getByLabelText("Código de 6 dígitos"), "000000");
    await user.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Código incorrecto");
    expect(screen.getByText("Escanea el código QR")).toBeInTheDocument(); // stayed on the QR step
  });

  it("cancel returns to the not-enrolled state without calling confirmMfaEnrollment", async () => {
    enrollMfa.mockResolvedValue({ factorId: "factor-1", qrCode: "data:image/svg+xml;base64,AAA", secret: "SECRET123" });
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole("button", { name: "Activar verificación en dos pasos" }));
    await user.click(await screen.findByRole("button", { name: "Cancelar" }));

    expect(screen.getByText("Verificación en dos pasos desactivada")).toBeInTheDocument();
    expect(confirmMfaEnrollment).not.toHaveBeenCalled();
  });
});

describe("SecurityPage — already enrolled", () => {
  it("shows the active factor and can deactivate it", async () => {
    listMfaFactors.mockResolvedValue({ factors: [{ id: "factor-1", friendlyName: "Autenticador principal" }] });
    unenrollMfa.mockResolvedValue({});
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByText("Autenticador principal")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Desactivar" }));

    expect(unenrollMfa).toHaveBeenCalledWith("factor-1");
    await waitFor(() => expect(screen.getByText("Verificación en dos pasos desactivada")).toBeInTheDocument());
  });
});
