import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

beforeEach(() => localStorage.clear());

describe("useLocalStorage", () => {
  it("reads the initial value from localStorage if present, otherwise falls back to the default", () => {
    localStorage.setItem("k1", JSON.stringify({ a: 1 }));
    const { result } = renderHook(() => useLocalStorage("k1", { a: 0 }));
    expect(result.current[0]).toEqual({ a: 1 });

    const fresh = renderHook(() => useLocalStorage("k2", { a: 0 }));
    expect(fresh.result.current[0]).toEqual({ a: 0 });
  });

  it("persists updates to localStorage and supports the functional updater form", () => {
    const { result } = renderHook(() => useLocalStorage("k3", 1));
    act(() => result.current[1]((prev) => prev + 1));
    expect(result.current[0]).toBe(2);
    expect(JSON.parse(localStorage.getItem("k3")!)).toBe(2);
  });

  it("keeps the setter referentially stable across re-renders — safe to use in a useCallback([]) dependency", () => {
    // Regression test: the setter used to be a plain function recreated every
    // render. A consumer memoizing with useCallback(fn, []) (the natural
    // assumption for something shaped like React's own setState) would then
    // silently close over a version of the setter tied to a specific render —
    // harmless today only because the setter's body happens not to depend on
    // anything reactive, but that's an accident of implementation, not a
    // guarantee. Making it stable removes the trap entirely.
    const { result, rerender } = renderHook(() => useLocalStorage("k4", 0));
    const firstSetter = result.current[1];
    rerender();
    const secondSetter = result.current[1];
    expect(secondSetter).toBe(firstSetter);
  });
});
