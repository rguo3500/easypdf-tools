// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ jobData: undefined as any, initUpload: vi.fn(), createJob: vi.fn(), getJob: vi.fn(() => ({ data: mocks.jobData })) }));

vi.mock("../client/src/lib/trpc", () => ({
  trpc: {
    conversion: {
      initUpload: { useMutation: () => ({ mutateAsync: mocks.initUpload, isPending: false }) },
      createJob: { useMutation: () => ({ mutateAsync: mocks.createJob, isPending: false }) },
      getJob: { useQuery: mocks.getJob },
    },
  },
}));

import ToolPage from "../client/src/pages/ToolPage";

function fileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement;
}

describe("ToolPage rendered conversion states", () => {
  beforeEach(() => {
    mocks.jobData = undefined;
    mocks.initUpload.mockReset();
    mocks.createJob.mockReset();
    globalThis.fetch = vi.fn(async () => new Response(null, { status: 200 })) as typeof fetch;
  });

  it("renders validation feedback for an unsupported upload", () => {
    render(<ToolPage tool="merge" />);
    const invalid = new File(["notes"], "notes.txt", { type: "text/plain" });
    fireEvent.change(fileInput(), { target: { files: [invalid] } });
    expect(screen.getByRole("alert")).toHaveTextContent("rejected");
  });

  it("starts a direct upload and shows the processing state", async () => {
    mocks.initUpload.mockResolvedValue({ key: "easypdf/input/sample.pdf_hash", url: "https://storage.test/put" });
    mocks.createJob.mockResolvedValue({ data: { id: "job-123" } });
    const rendered = render(<ToolPage tool="merge" />);
    const valid = new File(["%PDF-1.4"], "sample.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput(), { target: { files: [valid] } });
    fireEvent.click(document.querySelector(".process-button")!);
    await waitFor(() => expect(mocks.initUpload).toHaveBeenCalledWith({ name: "sample.pdf", type: "application/pdf" }));
    await waitFor(() => expect(mocks.createJob).toHaveBeenCalledWith(expect.objectContaining({ inputs: [{ name: "sample.pdf", type: "application/pdf", key: "easypdf/input/sample.pdf_hash" }] })));

    mocks.jobData = { status: "processing", tasks: [] };
    rendered.rerender(<ToolPage tool="merge" />);
    await waitFor(() => expect(screen.getByText(/processing your file/i)).toBeInTheDocument());
    expect(mocks.createJob).toHaveBeenCalled();
  });

  it("renders a provider failure state", async () => {
    mocks.initUpload.mockRejectedValue(new Error("Upload failed"));
    render(<ToolPage tool="merge" />);
    const valid = new File(["%PDF-1.4"], "sample.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput(), { target: { files: [valid] } });
    fireEvent.click(document.querySelector(".process-button")!);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Upload failed"));
  });
});
