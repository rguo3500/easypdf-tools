
- [x] Rework the public site into a cinematic deep-teal and burnt-orange PDF tools experience
- [x] Add responsive top navigation with tool categories and mobile hamburger menu
- [x] Build homepage tool-category and tool-card grid with clear CTAs
- [x] Add independent routes and SEO metadata/content for merge, split, compress, PDF-to-image, and image-to-PDF tools
- [x] Implement shared drag-and-drop upload interaction with validation, progress, processing, and completion feedback
- [x] Add merge PDF multi-file configuration flow
- [x] Add split PDF page-range configuration flow
- [x] Add compress PDF configuration flow
- [x] Add PDF-to-image PNG/JPG configuration flow
- [x] Add image-to-PDF multi-image configuration flow
- [x] Add responsive footer with tool links, about content, and copyright
- [x] Add/update Vitest coverage for tool configuration and routing behavior
- [x] Verify desktop and mobile layouts visually before delivery
- [x] Mark all completed items before creating the delivery checkpoint

## User-requested change history
- [x] 2026-08-13: Replace initial broad EasyPDF implementation brief with the latest cinematic visual direction and five required tool workflows
- [x] 2026-08-13: Preserve independent SEO-friendly routes and semantic content per tool; do not use duplicated generic SEO copy

## Previously completed
- [x] Project scaffold initialized with React, TypeScript, Tailwind, server, database, and auth foundation
- [x] Initial auth logout test scaffold present
- [x] Initial website checkpoint created by project initialization

## Validation follow-ups
- [x] Add explicit tool-category navigation items to the desktop and mobile menus
- [x] Add a visible grouped category strip to the homepage
- [x] Add per-route meta description, canonical, Open Graph, Twitter, and JSON-LD metadata
- [x] Add visible file rejection errors and split-range validation
- [x] Make route/config tests import actual shared route definitions
- [x] Document that conversion output is currently a product-flow prototype pending a Cloudflare conversion provider connection

## Final QA corrections
- [x] Extract one shared responsive header with mobile toggle for home and tool pages
- [x] Fix explicit meta element attribute creation for description, OG, Twitter, canonical, and JSON-LD
- [x] Preserve rejected uploads in visible error state and correct numeric split-range validation
- [x] Create one shared route/config registry used by App.tsx and tests

- [x] Track rejected uploads separately so all-invalid drops show a visible error
- [x] Add a test covering rejected upload detection

## Final delivery audit
- [x] Verify all user-requested tool capabilities and clearly distinguish implemented flow from missing binary conversion backends
- [x] Verify every independent route, navigation path, responsive layout, and footer link
- [x] Verify per-route SEO metadata and structured content behavior
- [x] Verify upload validation, progress states, error states, and download-state behavior
- [x] Run final type-checks, tests, and visual screenshots
- [x] Record the final audit conclusion and any remaining delivery blockers

## Audit corrections after verification
- [x] Re-run mobile verification after the shared SiteHeader refactor and exercise key footer/navigation links (homepage → Merge, tool-page footer inspected)
- [x] Add an explicit audit note stating that real PDF conversion backend and generated downloads are not yet implemented
- [x] Add robots.txt and sitemap.xml production SEO assets, and document the current client-side metadata limitation (explicitly noted in README)
- [x] Exercise upload, validation error, progress, and completion states through browser workspace verification plus executable upload/download state contract tests

## Real conversion rollout
- [x] Read the external API and automation integration guidance before selecting a conversion provider
- [x] Choose and configure a production conversion provider or document the required provider secret
- [x] Add server-side upload URL and conversion-job procedures with validated inputs
- [x] Add job metadata schema and persistence for pending, processing, completed, failed, and expired states
- [x] Replace simulated browser progress with real job-status polling
- [x] Add real result download URL handling and failure states
- [x] Implement server-injected crawler-visible SEO metadata for public tool routes (SSR/prerender remains a future enhancement)
- [x] Add integration tests for upload, job creation, status transitions, and download behavior
- [x] Re-run build, tests, browser verification, and save a new checkpoint

- [x] Add a dedicated upload-init/presigned-URL procedure and replace base64-over-tRPC uploads with direct object-storage upload
- [x] Add tests for the upload-init contract and direct-upload job input flow

## Real-flow verification corrections
- [x] Handle multiple output files and missing export URLs with explicit UI states
- [x] Add executable client tests for upload-init, job creation, polling transitions, success download, and failure states
- [x] Add executable server contract tests for upload-init response shape and storage-key job inputs

## Final integration corrections
- [x] Add explicit expired-state detection and persistence for conversion jobs
- [x] Clarify the SEO delivery item as server-injected crawler-visible metadata, or implement true SSR/prerendered route HTML
- [x] Add helper-level tests for upload-init, job creation contract, multi-file download normalization, and failure-state normalization
- [x] Add server contract tests for upload-init response fields and storage-key-only job inputs

## Post-checkpoint verification corrections
- [x] Add a rendered ToolPage component test with mocked upload-init, job creation, polling, validation error, and failure states, with download rendering covered by state normalization tests
- [x] Save a fresh checkpoint after all post-checkpoint code, schema, SEO, test, and verification changes
