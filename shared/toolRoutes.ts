export const toolRouteRegistry = [
  { path: "/merge-pdf", tool: "merge" },
  { path: "/split-pdf", tool: "split" },
  { path: "/compress-pdf", tool: "compress" },
  { path: "/pdf-to-image", tool: "pdf-to-image" },
  { path: "/image-to-pdf", tool: "image-to-pdf" },
] as const;

export type ToolRoute = (typeof toolRouteRegistry)[number];
