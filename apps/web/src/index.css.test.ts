/// <reference types="node" />
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Regression guard: Vite doesn't fail the build if a public/ asset referenced
// only via a CSS url() (not an import) goes missing — it just silently 404s at
// runtime, which is exactly how the app ended up depending on a third-party
// font CDN in the first place (nothing caught the drift). This asserts the
// self-hosted font files index.css points at actually exist on disk.

const here = dirname(fileURLToPath(import.meta.url));
const cssPath = resolve(here, "index.css");
const css = readFileSync(cssPath, "utf-8");

describe("self-hosted fonts referenced in index.css", () => {
  it("does not load fonts from a third-party CDN", () => {
    // Matches an actual @import/url() reference, not the explanatory comment
    // above that mentions fonts.googleapis.com by name as prose.
    expect(css).not.toMatch(/(@import|url\()\s*["(]?https?:\/\/fonts\.(googleapis|gstatic)\.com/);
  });

  it("every /fonts/*.woff2 url() referenced actually exists in public/fonts", () => {
    const referenced = [...css.matchAll(/url\("(\/fonts\/[^"]+\.woff2)"\)/g)].map((m) => m[1]);
    expect(referenced.length).toBeGreaterThan(0); // sanity check the regex itself still matches something

    for (const ref of referenced) {
      const onDisk = resolve(here, "..", "public", ref.replace(/^\//, ""));
      expect(existsSync(onDisk), `${ref} is referenced in index.css but missing from public/fonts`).toBe(true);
    }
  });
});
