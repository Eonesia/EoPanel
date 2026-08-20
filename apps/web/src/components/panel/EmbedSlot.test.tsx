import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EmbedSlot, isEmbeddableUrl } from "./EmbedSlot";
import { ToastProvider } from "../../lib/toast";

const showToast = vi.fn();
vi.mock("../../lib/toast", async () => {
  const actual = await vi.importActual<typeof import("../../lib/toast")>("../../lib/toast");
  return { ...actual, useToast: () => ({ showToast }) };
});

function renderSlot() {
  return render(
    <ToastProvider>
      <EmbedSlot tagId="drive" label="Google Drive" description="Comparte la carpeta como enlace público." />
    </ToastProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  showToast.mockClear();
});

afterEach(cleanup);

describe("isEmbeddableUrl", () => {
  it("accepts http and https URLs", () => {
    expect(isEmbeddableUrl("https://drive.google.com/embeddedfolderview?id=abc")).toBe(true);
    expect(isEmbeddableUrl("http://example.com")).toBe(true);
  });

  it("rejects javascript:, data: and other dangerous schemes", () => {
    expect(isEmbeddableUrl("javascript:alert(document.cookie)")).toBe(false);
    expect(isEmbeddableUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(isEmbeddableUrl("vbscript:msgbox(1)")).toBe(false);
  });

  it("rejects plain text that isn't a URL at all", () => {
    expect(isEmbeddableUrl("not a url")).toBe(false);
    expect(isEmbeddableUrl("")).toBe(false);
  });
});

describe("EmbedSlot", () => {
  it("refuses to connect a javascript: URL and shows an error toast instead of rendering an iframe", async () => {
    const user = userEvent.setup();
    renderSlot();

    await user.type(screen.getByPlaceholderText(/pega el enlace embebible/i), "javascript:alert(1)");
    await user.click(screen.getByRole("button", { name: "Conectar" }));

    expect(screen.queryByTitle("Google Drive")).not.toBeInTheDocument();
    expect(showToast).toHaveBeenCalledWith(expect.stringMatching(/url http\(s\) válida/i), "error");
  });

  it("connects a valid https URL and renders a sandboxed iframe", async () => {
    const user = userEvent.setup();
    renderSlot();

    await user.type(screen.getByPlaceholderText(/pega el enlace embebible/i), "https://drive.google.com/folder/1");
    await user.click(screen.getByRole("button", { name: "Conectar" }));

    const iframe = screen.getByTitle("Google Drive");
    expect(iframe).toHaveAttribute("src", "https://drive.google.com/folder/1");
    expect(iframe).toHaveAttribute("sandbox");
    expect(iframe.getAttribute("sandbox")).not.toMatch(/allow-top-navigation/);
  });
});
