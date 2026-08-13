import { describe, expect, it } from "vitest";
import { normalizeDownloadFiles } from "../client/src/pages/ToolPage";
import { withRouteSeo } from "./_core/vite";
import { conversionInput, conversionProcedureNames, resolvePersistedJobStatus, uploadInitInput, uploadInitResponse } from "./routers";

const template = "<title>Base</title></head>";

describe("real conversion flow contracts", () => {
  it("keeps direct upload and job procedures explicit", () => {
    expect(conversionProcedureNames).toEqual(["initUpload", "createJob", "getJob"]);
  });

  it("validates direct upload and storage-key job contracts", () => {
    expect(uploadInitInput.parse({ name: "sample.pdf", type: "application/pdf" })).toEqual({ name: "sample.pdf", type: "application/pdf" });
    expect(uploadInitResponse.parse({ key: "easypdf/input/sample_a1b2.pdf", url: "https://storage.example.test/upload" })).toEqual({ key: "easypdf/input/sample_a1b2.pdf", url: "https://storage.example.test/upload" });
    expect(conversionInput.parse({ name: "sample.pdf", type: "application/pdf", key: "easypdf/input/sample_a1b2.pdf" }).key).toContain("easypdf/input/");
    expect(() => conversionInput.parse({ name: "sample.pdf", type: "application/pdf", dataBase64: "not-allowed" })).toThrow();
  });

  it("marks unfinished expired jobs as expired but preserves finished jobs", () => {
    const now = new Date("2026-08-13T10:00:00.000Z");
    expect(resolvePersistedJobStatus("processing", new Date("2026-08-13T09:00:00.000Z"), now)).toBe("expired");
    expect(resolvePersistedJobStatus("finished", new Date("2026-08-13T09:00:00.000Z"), now)).toBe("finished");
  });

  it("renders route-specific crawler-visible metadata", () => {
    const html = withRouteSeo(template, "/split-pdf");
    expect(html).toContain("<title>Split PDF by pages — EasyPDF Tools</title>");
    expect(html).toContain('meta name="description"');
    expect(html).toContain('canonical" href="/split-pdf"');
  });

  it("returns every downloadable output and ignores missing URLs", () => {
    const files = normalizeDownloadFiles({ tasks: [{ operation: "export/url", result: { files: [{ filename: "page-1.png", url: "https://example.test/1" }, { filename: "page-2.png" }, { filename: "page-3.png", url: "https://example.test/3" }] } }] });
    expect(files).toEqual([
      { filename: "page-1.png", url: "https://example.test/1" },
      { filename: "page-3.png", url: "https://example.test/3" },
    ]);
    expect(normalizeDownloadFiles({ tasks: [{ operation: "export/url", result: { files: [] } }] })).toEqual([]);
  });
});
