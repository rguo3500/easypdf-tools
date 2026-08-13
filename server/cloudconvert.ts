import { storageGetSignedUrl } from "./storage";

const API_BASE = "https://api.cloudconvert.com/v2";

export type ConversionTool = "merge" | "split" | "compress" | "pdf-to-image" | "image-to-pdf";

export type ConversionInput = {
  name: string;
  type: string;
  key: string;
};

export type ConversionOptions = {
  range?: string;
  format?: "PNG" | "JPG";
  compression?: "Balanced" | "Maximum compression" | "High quality";
};

function apiKey() {
  const key = process.env.CLOUDCONVERT_API_KEY;
  if (!key) throw new Error("CLOUDCONVERT_API_KEY is not configured");
  return key;
}

async function cloudConvertRequest(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message ?? `CloudConvert request failed (${response.status})`);
  }
  return payload;
}

function compressionProfile(value: ConversionOptions["compression"]) {
  if (value === "Maximum compression") return "web";
  if (value === "High quality") return "prepress";
  return "ebook";
}

async function importInput(input: ConversionInput, index: number) {
  const signedUrl = await storageGetSignedUrl(input.key);
  return {
    [`import-${index}`]: {
      operation: "import/url",
      url: signedUrl,
      filename: input.name,
    },
  };
}

export async function createConversionJob(tool: ConversionTool, inputs: ConversionInput[], options: ConversionOptions = {}) {
  if (!inputs.length) throw new Error("At least one input file is required");
  const importTasks = Object.assign({}, ...(await Promise.all(inputs.map(importInput))));
  const inputNames = inputs.map((_, index) => `import-${index}`);
  const tasks: Record<string, unknown> = { ...importTasks };

  if (tool === "merge" || tool === "image-to-pdf") {
    tasks.transform = {
      operation: "merge",
      input: inputNames,
      output_format: "pdf",
    };
  } else if (tool === "split") {
    tasks.transform = {
      operation: "convert",
      input: inputNames[0],
      input_format: "pdf",
      output_format: "pdf",
      ...(options.range ? { pages: options.range } : {}),
    };
  } else if (tool === "compress") {
    tasks.transform = {
      operation: "optimize",
      input: inputNames[0],
      input_format: "pdf",
      output_format: "pdf",
      profile: compressionProfile(options.compression),
    };
  } else {
    tasks.transform = {
      operation: "convert",
      input: inputNames[0],
      input_format: "pdf",
      output_format: (options.format ?? "PNG").toLowerCase(),
    };
  }

  tasks.export = { operation: "export/url", input: "transform" };
  return cloudConvertRequest("/jobs", {
    method: "POST",
    body: JSON.stringify({ tasks, tag: `easypdf-${tool}-${Date.now()}` }),
  });
}

export async function getConversionJob(jobId: string) {
  return cloudConvertRequest(`/jobs/${encodeURIComponent(jobId)}`);
}
