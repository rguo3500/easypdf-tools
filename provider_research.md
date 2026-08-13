# PDF Conversion Provider Research

## CloudConvert
Official page: https://cloudconvert.com/apis/file-conversion

CloudConvert states that its API supports more than 200 formats, asynchronous conversions with webhook notifications, synchronous conversion when needed, object-storage integration including S3, and job workflows that chain operations. The public page shows a REST job example using import, convert, and export tasks. It advertises starting pricing at $0.008 per file for conversion. This fits the EasyPDF provider abstraction and R2-oriented architecture, but PDF-specific merge/split/compress behavior still needs endpoint-level validation.

## ConvertAPI
Official page: https://www.convertapi.com/

ConvertAPI’s official product pages list PDF compression, split and merge, extraction of PDF images into PNG/JPG/TIFF, and multiple SDKs including Node.js, Python, cURL, and others. The product appears more PDF-specific for several requested operations. Before implementation, its exact asynchronous job/status/download contract and input/output URL handling should be verified from its API documentation.

## Recommendation
Use CloudConvert first if the primary priority is a clear asynchronous job model and direct object-storage integration. Use ConvertAPI if the primary priority is PDF-specific operation coverage with a simpler endpoint-oriented integration. No provider API key has been configured yet, so implementation should pause before secret injection until the user provides or connects credentials for the chosen provider.

## Job API details
Official page: https://cloudconvert.com/docs/api-reference/jobs

The documented async job endpoint is `POST https://api.cloudconvert.com/v2/jobs` with the `task.write` scope. Job status is retrieved from `GET https://api.cloudconvert.com/v2/jobs/{ID}` with the `task.read` scope. Jobs report `waiting`, `processing`, `finished`, or `error`; tasks include operation, status, message/code, and export task result files with temporary URLs. The API supports a `redirect=true` status query when an export/url task exists.

The initially guessed import/upload documentation URL returned a 404, so direct browser upload task details still need to be verified from the current documentation navigation or by using a simpler server-side import URL flow. Do not assume the old path is valid.

## Import contract
Official page: https://cloudconvert.com/docs/import-export/import-files

The current docs identify the valid path as `/docs/import-export/import-files`. They document `import/url` with a required URL and filename, plus `import/base64` and an `import/upload` flow. The page includes an Upload section with HTML Form examples and an Uploading subsection. For the first implementation, the provider adapter can safely use `import/url` if the app can produce a temporary, fetchable object URL; otherwise it should implement the documented `import/upload` form flow rather than guessing an undocumented endpoint.
