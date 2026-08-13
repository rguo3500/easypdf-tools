import { describe, expect, it } from "vitest";

describe("CloudConvert credentials", () => {
  it("authenticates against the lightweight jobs endpoint", async () => {
    const apiKey = process.env.CLOUDCONVERT_API_KEY;
    expect(apiKey, "CLOUDCONVERT_API_KEY must be configured").toBeTruthy();

    const response = await fetch("https://api.cloudconvert.com/v2/jobs?per_page=1", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    expect(response.status, await response.text()).toBe(200);
  }, 15000);
});
