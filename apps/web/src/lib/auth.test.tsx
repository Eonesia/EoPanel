import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mfa = {
  getAuthenticatorAssuranceLevel: vi.fn(),
  listFactors: vi.fn(),
  challenge: vi.fn(),
  verify: vi.fn(),
  enroll: vi.fn(),
  unenroll: vi.fn(),
};

const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    mfa,
  },
};

vi.mock("./supabaseClient", () => ({
  get supabase() {
    return mockSupabase;
  },
  isSupabaseConfigured: true,
}));

// Imported after the mock so the module picks up the mocked client.
const { AuthProvider, useAuth } = await import("./auth");

function setup() {
  return renderHook(() => useAuth(), { wrapper: AuthProvider });
}

const SESSION = { user: { email: "rafa@eonesia.com" } };

beforeEach(() => {
  vi.clearAllMocks();
  mockSupabase.auth.getSession.mockResolvedValue({ data: { session: SESSION } });
});

afterEach(() => {
  localStorage.clear();
});

describe("2FA — resolving session status by assurance level", () => {
  it("stays at mfa_challenge (not authed) when the account needs a TOTP step", async () => {
    mfa.getAuthenticatorAssuranceLevel.mockResolvedValue({ data: { currentLevel: "aal1", nextLevel: "aal2" } });
    const { result } = setup();

    await waitFor(() => expect(result.current.status).toBe("mfa_challenge"));
    expect(result.current.profile?.name).toBe("Rafa Dorado");
  });

  it("goes straight to authed when the account has no 2FA enrolled", async () => {
    mfa.getAuthenticatorAssuranceLevel.mockResolvedValue({ data: { currentLevel: "aal1", nextLevel: "aal1" } });
    const { result } = setup();

    await waitFor(() => expect(result.current.status).toBe("authed"));
  });

  it("is authed once already at aal2 (2FA already completed this session)", async () => {
    mfa.getAuthenticatorAssuranceLevel.mockResolvedValue({ data: { currentLevel: "aal2", nextLevel: "aal2" } });
    const { result } = setup();

    await waitFor(() => expect(result.current.status).toBe("authed"));
  });
});

describe("2FA — completing the login challenge", () => {
  it("verifyMfaChallenge walks listFactors -> challenge -> verify and flips status to authed", async () => {
    mfa.getAuthenticatorAssuranceLevel.mockResolvedValue({ data: { currentLevel: "aal1", nextLevel: "aal2" } });
    mfa.listFactors.mockResolvedValue({ data: { totp: [{ id: "factor-1" }] } });
    mfa.challenge.mockResolvedValue({ data: { id: "challenge-1" } });
    mfa.verify.mockResolvedValue({ data: {}, error: null });

    const { result } = setup();
    await waitFor(() => expect(result.current.status).toBe("mfa_challenge"));

    let outcome: { error?: string } = {};
    await act(async () => {
      outcome = await result.current.verifyMfaChallenge("123456");
    });

    expect(mfa.challenge).toHaveBeenCalledWith({ factorId: "factor-1" });
    expect(mfa.verify).toHaveBeenCalledWith({ factorId: "factor-1", challengeId: "challenge-1", code: "123456" });
    expect(outcome.error).toBeUndefined();
    expect(result.current.status).toBe("authed");
  });

  it("surfaces a wrong-code error instead of silently granting access", async () => {
    mfa.getAuthenticatorAssuranceLevel.mockResolvedValue({ data: { currentLevel: "aal1", nextLevel: "aal2" } });
    mfa.listFactors.mockResolvedValue({ data: { totp: [{ id: "factor-1" }] } });
    mfa.challenge.mockResolvedValue({ data: { id: "challenge-1" } });
    mfa.verify.mockResolvedValue({ data: null, error: { message: "Invalid TOTP code entered" } });

    const { result } = setup();
    await waitFor(() => expect(result.current.status).toBe("mfa_challenge"));

    let outcome: { error?: string } = {};
    await act(async () => {
      outcome = await result.current.verifyMfaChallenge("000000");
    });

    expect(outcome.error).toBe("Invalid TOTP code entered");
    expect(result.current.status).toBe("mfa_challenge"); // still blocked
  });
});

describe("2FA — enrollment", () => {
  beforeEach(() => {
    mfa.getAuthenticatorAssuranceLevel.mockResolvedValue({ data: { currentLevel: "aal1", nextLevel: "aal1" } });
  });

  it("enrollMfa returns the factorId, QR code and secret from Supabase", async () => {
    mfa.enroll.mockResolvedValue({
      data: { id: "factor-2", totp: { qr_code: "<svg>...</svg>", secret: "ABCD1234", uri: "otpauth://..." } },
      error: null,
    });
    const { result } = setup();
    await waitFor(() => expect(result.current.status).toBe("authed"));

    let outcome: Awaited<ReturnType<typeof result.current.enrollMfa>> = {};
    await act(async () => {
      outcome = await result.current.enrollMfa();
    });

    expect(outcome).toEqual({ factorId: "factor-2", qrCode: "<svg>...</svg>", secret: "ABCD1234" });
  });

  it("confirmMfaEnrollment challenges and verifies the given factor", async () => {
    mfa.challenge.mockResolvedValue({ data: { id: "challenge-9" } });
    mfa.verify.mockResolvedValue({ data: {}, error: null });
    const { result } = setup();
    await waitFor(() => expect(result.current.status).toBe("authed"));

    let outcome: { error?: string } = {};
    await act(async () => {
      outcome = await result.current.confirmMfaEnrollment("factor-2", "654321");
    });

    expect(mfa.verify).toHaveBeenCalledWith({ factorId: "factor-2", challengeId: "challenge-9", code: "654321" });
    expect(outcome.error).toBeUndefined();
  });

  it("unenrollMfa calls supabase.auth.mfa.unenroll with the factor id", async () => {
    mfa.unenroll.mockResolvedValue({ data: {}, error: null });
    const { result } = setup();
    await waitFor(() => expect(result.current.status).toBe("authed"));

    await act(async () => {
      await result.current.unenrollMfa("factor-2");
    });

    expect(mfa.unenroll).toHaveBeenCalledWith({ factorId: "factor-2" });
  });

  it("listMfaFactors maps Supabase's totp factors to {id, friendlyName}", async () => {
    mfa.listFactors.mockResolvedValue({
      data: { totp: [{ id: "factor-2", friendly_name: "Autenticador principal" }] },
    });
    const { result } = setup();
    await waitFor(() => expect(result.current.status).toBe("authed"));

    let outcome: Awaited<ReturnType<typeof result.current.listMfaFactors>> = { factors: [] };
    await act(async () => {
      outcome = await result.current.listMfaFactors();
    });

    expect(outcome.factors).toEqual([{ id: "factor-2", friendlyName: "Autenticador principal" }]);
  });
});
