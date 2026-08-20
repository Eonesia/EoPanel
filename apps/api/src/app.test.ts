import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app";

const app = createApp();

describe("GET /api/health", () => {
  it("returns ok status with the service name", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok", service: "eopanel-api" });
    expect(new Date(res.body.time).toString()).not.toBe("Invalid Date");
  });
});

describe("GET /api/notifications/summary", () => {
  it("returns a counts object and an updatedAt timestamp", async () => {
    const res = await request(app).get("/api/notifications/summary");
    expect(res.status).toBe(200);
    expect(typeof res.body.counts).toBe("object");
    expect(Object.values(res.body.counts).every((v) => typeof v === "number")).toBe(true);
    expect(new Date(res.body.updatedAt).toString()).not.toBe("Invalid Date");
  });
});

describe("unknown routes", () => {
  it("returns a JSON 404, not an HTML error page", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "not_found" });
  });
});

describe("CORS", () => {
  it("reflects the configured origin", async () => {
    const res = await request(app).get("/api/health").set("Origin", "http://localhost:5173");
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  });
});
