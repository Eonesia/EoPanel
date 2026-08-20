import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { createApp } from "../app";

const app = createApp();

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GET /api/integrations/status", () => {
  it("reports every integration as not configured when no env vars are set", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "");
    const res = await request(app).get("/api/integrations/status");
    expect(res.status).toBe(200);
    expect(res.body.gmail.configured).toBe(false);
    expect(res.body.meta.configured).toBe(false);
    expect(res.body.lxp.configured).toBe(false);
  });

  it("flips gmail.configured to true once both client id and secret are set", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "test-id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "test-secret");
    const res = await request(app).get("/api/integrations/status");
    expect(res.body.gmail.configured).toBe(true);
  });

  it("does not consider an integration configured with only half its credentials set", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "test-id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "");
    const res = await request(app).get("/api/integrations/status");
    expect(res.body.gmail.configured).toBe(false);
  });
});

describe("GET /api/integrations/gmail/oauth/start", () => {
  it("returns 503 with guidance when Google credentials are missing", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "");
    const res = await request(app).get("/api/integrations/gmail/oauth/start");
    expect(res.status).toBe(503);
    expect(res.body.error).toBe("gmail_not_configured");
  });

  it("redirects to Google's real OAuth endpoint with the right params once configured", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "test-client-id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "test-secret");
    const res = await request(app).get("/api/integrations/gmail/oauth/start?account=desarrollo");

    expect(res.status).toBe(302);
    const location = new URL(res.headers.location);
    expect(location.origin + location.pathname).toBe("https://accounts.google.com/o/oauth2/v2/auth");
    expect(location.searchParams.get("client_id")).toBe("test-client-id");
    expect(location.searchParams.get("state")).toBe("desarrollo");
    expect(location.searchParams.get("scope")).toContain("gmail.readonly");
  });

  it("defaults the account/state to 'info' when none is given", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "test-client-id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "test-secret");
    const res = await request(app).get("/api/integrations/gmail/oauth/start");
    const location = new URL(res.headers.location);
    expect(location.searchParams.get("state")).toBe("info");
  });
});

describe("GET /api/integrations/gmail/oauth/callback", () => {
  it("surfaces the provider's error instead of pretending it succeeded", async () => {
    const res = await request(app).get("/api/integrations/gmail/oauth/callback?error=access_denied");
    expect(res.status).toBe(400);
    expect(res.text).toContain("access_denied");
  });

  it("returns 503 when credentials are missing even with a valid code", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "");
    const res = await request(app).get("/api/integrations/gmail/oauth/callback?code=abc123");
    expect(res.status).toBe(503);
  });

  it("escapes an HTML/script payload in `error` instead of reflecting it verbatim (XSS)", async () => {
    const res = await request(app).get(
      "/api/integrations/gmail/oauth/callback?error=" + encodeURIComponent("<script>alert(1)</script>"),
    );
    expect(res.status).toBe(400);
    expect(res.text).not.toContain("<script>alert(1)</script>");
    expect(res.text).toContain("&lt;script&gt;");
  });

  it("escapes an HTML/script payload in `state` instead of reflecting it verbatim (XSS)", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "test-client-id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "test-secret");
    const res = await request(app).get(
      "/api/integrations/gmail/oauth/callback?code=abc123&state=" +
        encodeURIComponent("<img src=x onerror=alert(1)>"),
    );
    expect(res.status).toBe(200);
    expect(res.text).not.toContain("<img src=x onerror=alert(1)>");
    expect(res.text).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });
});
