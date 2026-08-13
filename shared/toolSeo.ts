export const toolSeo = {
  "/": { title: "EasyPDF Tools — Free Online PDF Tools", description: "Convert, compress, merge and manage PDF files online with focused tools for everyday document work." },
  "/merge-pdf": { title: "Merge PDF files — EasyPDF Tools", description: "Bring multiple PDF documents together into one clean, ordered PDF in seconds." },
  "/split-pdf": { title: "Split PDF by pages — EasyPDF Tools", description: "Extract the exact pages you need from a PDF with a simple page-range workflow." },
  "/compress-pdf": { title: "Compress PDF — EasyPDF Tools", description: "Make large PDF files lighter for email, upload forms, and everyday sharing." },
  "/pdf-to-image": { title: "PDF to image — EasyPDF Tools", description: "Turn PDF pages into sharp PNG or JPG images for presentations, posts, and previews." },
  "/image-to-pdf": { title: "Images to PDF — EasyPDF Tools", description: "Combine JPG and PNG images into one presentation-ready PDF with a clean flow." },
} as const;

export type SeoPath = keyof typeof toolSeo;
