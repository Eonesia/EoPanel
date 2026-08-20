import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useSpring } from "./useSpring";

const CONFIG = { stiffness: 210, damping: 24 };

describe("useSpring", () => {
  afterEach(() => {
    // @ts-expect-error test-only cleanup of a property we may have added
    delete window.matchMedia;
  });

  it("does not crash when window.matchMedia is unavailable (jsdom doesn't implement it by default)", () => {
    // Regression: an earlier version called window.matchMedia(...) unconditionally,
    // which throws "window.matchMedia is not a function" in exactly this environment —
    // discovered because a real test (AppShell.test.tsx) rendering the Sidebar failed with it.
    expect(window.matchMedia).toBeUndefined();
    expect(() => renderHook(() => useSpring(100, CONFIG))).not.toThrow();
  });

  it("returns the target value immediately (no animation) when the caller starts at that value", () => {
    const { result } = renderHook(() => useSpring(50, CONFIG));
    expect(result.current).toBe(50);
  });

  it("snaps instantly to the new target when prefers-reduced-motion is set", async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
    const { result, rerender } = renderHook(({ target }) => useSpring(target, CONFIG), {
      initialProps: { target: 0 },
    });
    expect(result.current).toBe(0);

    rerender({ target: 200 });
    expect(result.current).toBe(200); // no intermediate/animated value
  });

  it("animates toward a new target over multiple frames when motion isn't reduced", async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
    const { result, rerender } = renderHook(({ target }) => useSpring(target, CONFIG), {
      initialProps: { target: 0 },
    });

    rerender({ target: 100 });
    // Give a few animation frames a chance to run.
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(result.current).toBeGreaterThan(0);
  });
});
