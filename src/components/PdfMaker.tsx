import React, { forwardRef, useImperativeHandle } from "react";
import { Alert } from "react-native";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system/legacy";

export interface PdfMakerRef {
  createPdf: (inputImages?: string[]) => Promise<string | null>;
}

interface PdfMakerProps {
  images: string[];
  onPdfReady?: (uri: string) => void;
}

const PdfMaker = forwardRef<PdfMakerRef, PdfMakerProps>(
  ({ images, onPdfReady }, ref) => {
    const createPdf = async (
      inputImages?: string[],
    ): Promise<string | null> => {
      const sourceImages =
        inputImages && inputImages.length ? inputImages : images;

      if (!sourceImages.length) {
        Alert.alert("No pages", "Add at least one image.");
        return null;
      }

      const pages = await Promise.all(
        sourceImages.map(async (uri, index) => {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const pageBreakStyle =
            index === sourceImages.length - 1
              ? "page-break-after:auto;"
              : "page-break-after:always;";

          return `
            <div class="pdf-page" style="${pageBreakStyle}">
              <img src="data:image/jpeg;base64,${base64}" alt="page-${index + 1}" />
            </div>
          `;
        }),
      );

      const html = `
        <html>
          <head>
            <style>
              @page {
                size: A4 portrait;
                margin: 0;
              }

              html,
              body {
                margin: 0;
                padding: 0;
                width: 210mm;
                background: #ffffff;
              }

              .pdf-page {
                width: 210mm;
                height: 297mm;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                break-inside: avoid;
                page-break-inside: avoid;
              }

              .pdf-page img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
              }
            </style>
          </head>
          <body>
            ${pages.join("")}
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      onPdfReady?.(uri);
      return uri;
    };

    useImperativeHandle(ref, () => ({
      createPdf,
    }));

    return null;
  },
);

PdfMaker.displayName = "PdfMaker";

export default PdfMaker;
