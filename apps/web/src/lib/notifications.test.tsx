import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { NotificationsProvider, useNotifications } from "./notifications";
import { TABS } from "../data/tabs";

function setup() {
  return renderHook(() => useNotifications(), { wrapper: NotificationsProvider });
}

beforeEach(() => {
  localStorage.clear();
});

describe("notifications aggregation", () => {
  it("sums tag counts up into their sector, and sector counts up into their tab", () => {
    const { result } = setup();
    for (const tab of TABS) {
      let tabTotal = 0;
      for (const sector of tab.sectors) {
        const sectorTotal = sector.tags.reduce((sum, tag) => sum + result.current.tagCount(tag.id), 0);
        expect(result.current.sectorCount(tab.id, sector.id)).toBe(sectorTotal);
        tabTotal += sectorTotal;
      }
      expect(result.current.tabCount(tab.id)).toBe(tabTotal);
    }
  });

  it("returns 0 for a tag id that doesn't exist", () => {
    const { result } = setup();
    expect(result.current.tagCount("does-not-exist")).toBe(0);
  });

  it("markTagRead zeroes a tag and reduces its sector/tab totals by exactly that amount", () => {
    const { result } = setup();
    const tab = TABS.find((t) => t.sectors.some((s) => s.tags.some((tag) => tag.notifications > 0)))!;
    const sector = tab.sectors.find((s) => s.tags.some((tag) => tag.notifications > 0))!;
    const tag = sector.tags.find((t) => t.notifications > 0)!;

    const before = { sector: result.current.sectorCount(tab.id, sector.id), tab: result.current.tabCount(tab.id) };
    const removed = result.current.tagCount(tag.id);

    act(() => result.current.markTagRead(tag.id));

    expect(result.current.tagCount(tag.id)).toBe(0);
    expect(result.current.sectorCount(tab.id, sector.id)).toBe(before.sector - removed);
    expect(result.current.tabCount(tab.id)).toBe(before.tab - removed);
  });

  it("listUnread only returns tags with a positive count, and their counts sum to the tab total", () => {
    const { result } = setup();
    const unread = result.current.listUnread();
    expect(unread.every((item) => item.count > 0)).toBe(true);

    for (const tab of TABS) {
      const fromList = unread.filter((i) => i.tabId === tab.id).reduce((sum, i) => sum + i.count, 0);
      expect(fromList).toBe(result.current.tabCount(tab.id));
    }
  });

  it("markManyRead zeroes every tag passed in, leaving others untouched", () => {
    const { result } = setup();
    const unreadTags = TABS.flatMap((t) => t.sectors).flatMap((s) => s.tags).filter((t) => t.notifications > 0);
    expect(unreadTags.length).toBeGreaterThan(1); // sanity check on the fixture data

    const [untouched, ...toMark] = unreadTags;

    act(() => result.current.markManyRead(toMark.map((t) => t.id)));

    for (const tag of toMark) expect(result.current.tagCount(tag.id)).toBe(0);
    expect(result.current.tagCount(untouched.id)).toBe(untouched.notifications);
  });

  it("persists read state across a fresh provider mount (localStorage)", () => {
    const first = setup();
    const tag = TABS.flatMap((t) => t.sectors).flatMap((s) => s.tags).find((t) => t.notifications > 0)!;
    act(() => first.result.current.markTagRead(tag.id));
    expect(first.result.current.tagCount(tag.id)).toBe(0);

    const second = setup();
    expect(second.result.current.tagCount(tag.id)).toBe(0);
  });
});
