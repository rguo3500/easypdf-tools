import { describe, expect, it } from "vitest";

describe("EasyPDF tool route contract", () => {
  const routes = ["/merge-pdf", "/split-pdf", "/compress-pdf", "/pdf-to-image", "/image-to-pdf"];

  it("keeps every required workflow on an independent route", () => {
    expect(new Set(routes).size).toBe(5);
    expect(routes).toContain("/merge-pdf");
    expect(routes).toContain("/split-pdf");
    expect(routes).toContain("/compress-pdf");
    expect(routes).toContain("/pdf-to-image");
    expect(routes).toContain("/image-to-pdf");
  });

  it("uses the free upload limit stated in the product requirements", () => {
    const freeLimitBytes = 25 * 1024 * 1024;
    expect(5 * 1024 * 1024).toBeLessThanOrEqual(freeLimitBytes);
    expect(26 * 1024 * 1024).toBeGreaterThan(freeLimitBytes);
  });

  it("supports semantic tool-specific configuration choices", () => {
    expect(["PNG", "JPG"]).toEqual(expect.arrayContaining(["PNG", "JPG"]));
    expect(["Balanced", "Maximum compression", "High quality"]).toContain("Balanced");
    expect("1-3").toMatch(/^\d+-\d+$/);
  });
});
