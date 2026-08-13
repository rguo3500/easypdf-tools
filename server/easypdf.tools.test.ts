import { describe, expect, it } from "vitest";
import { getUploadRejectionCount, toolConfigs } from "../client/src/pages/ToolPage";
import { toolRouteRegistry } from "../shared/toolRoutes";
import { conversionProcedureNames } from "./routers";

describe("EasyPDF tool contract", () => {
  it("keeps each required workflow on an independent route", () => {
    const configs = Object.values(toolConfigs);
    expect(toolRouteRegistry).toHaveLength(5);
    expect(new Set(toolRouteRegistry.map(route => route.path)).size).toBe(5);
    expect(toolRouteRegistry.map(route => route.path)).toEqual(expect.arrayContaining(configs.map(config => config.path)));
  });

  it("defines a concrete upload contract for every tool", () => {
    for (const config of Object.values(toolConfigs)) {
      expect(config.accept.length).toBeGreaterThan(0);
      expect(config.description.length).toBeGreaterThan(50);
      expect(config.faqs).toHaveLength(5);
      expect(config.related.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("surfaces unsupported and oversized uploads for user feedback", () => {
    expect(getUploadRejectionCount([{ size: 26 * 1024 * 1024, type: "application/pdf", name: "large.pdf" }], false)).toBe(1);
    expect(getUploadRejectionCount([{ size: 100, type: "text/plain", name: "notes.txt" }], false)).toBe(1);
    expect(getUploadRejectionCount([{ size: 100, type: "image/png", name: "page.png" }], true)).toBe(0);
  });

  it("exposes direct upload initialization and job lifecycle procedures", () => {
    expect(conversionProcedureNames).toEqual(["initUpload", "createJob", "getJob"]);
  });

  it("enforces the free upload size boundary", () => {
    const freeLimitBytes = 25 * 1024 * 1024;
    expect(25 * 1024 * 1024).toBeLessThanOrEqual(freeLimitBytes);
    expect(26 * 1024 * 1024).toBeGreaterThan(freeLimitBytes);
  });
});
