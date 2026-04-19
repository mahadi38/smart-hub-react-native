import { PDFDocument } from "pdf-lib";
import * as FileSystem from "expo-file-system/legacy";

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
export const MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024;
export const PDF_SIZE_LIMIT_MESSAGE =
  "Selected images are over 50MB. Please choose smaller images.";

const getBase64ByteSize = (base64: string) =>
  Math.floor((base64.length * 3) / 4);

const detectImageType = (base64: string): "jpg" | "png" | null => {
  if (base64.startsWith("/9j/")) {
    return "jpg";
  }

  if (base64.startsWith("iVBORw0KGgo")) {
    return "png";
  }

  return null;
};

const assertInputSizeWithinLimit = async (imageUris: string[]) => {
  let totalBytes = 0;

  for (const uri of imageUris) {
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (!fileInfo.exists) {
      continue;
    }

    totalBytes += fileInfo.size ?? 0;

    if (totalBytes > MAX_PDF_SIZE_BYTES) {
      throw new Error(PDF_SIZE_LIMIT_MESSAGE);
    }
  }
};

const drawImageFitPage = (
  page: any,
  embeddedImage: any,
  pageWidth: number,
  pageHeight: number,
) => {
  const imgWidth = embeddedImage.width;
  const imgHeight = embeddedImage.height;
  const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
  const drawWidth = imgWidth * scale;
  const drawHeight = imgHeight * scale;
  const x = (pageWidth - drawWidth) / 2;
  const y = (pageHeight - drawHeight) / 2;

  page.drawImage(embeddedImage, {
    x,
    y,
    width: drawWidth,
    height: drawHeight,
  });
};

export const createPdfFromImages = async (imageUris: string[]) => {
  if (!imageUris.length) {
    throw new Error("Add at least one image.");
  }

  await assertInputSizeWithinLimit(imageUris);

  const pdfDoc = await PDFDocument.create();

  for (const uri of imageUris) {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const imageType = detectImageType(base64);
    const embeddedImage =
      imageType === "png"
        ? await pdfDoc.embedPng(base64)
        : imageType === "jpg"
          ? await pdfDoc.embedJpg(base64)
          : await pdfDoc.embedJpg(base64).catch(() => pdfDoc.embedPng(base64));

    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    drawImageFitPage(page, embeddedImage, A4_WIDTH, A4_HEIGHT);
  }

  const pdfBase64 = await pdfDoc.saveAsBase64();
  const pdfBytes = getBase64ByteSize(pdfBase64);

  if (pdfBytes > MAX_PDF_SIZE_BYTES) {
    throw new Error(PDF_SIZE_LIMIT_MESSAGE);
  }

  const outputUri = `${FileSystem.cacheDirectory}image-pdf-${Date.now()}.pdf`;

  await FileSystem.writeAsStringAsync(outputUri, pdfBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return outputUri;
};
