import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { savePdfToMyPdfFolderFromUri } from "../utils/PdfStorage";
import { createPdfFromImages, PDF_SIZE_LIMIT_MESSAGE } from "../utils/ImagePdf";
import TostNotification from "../components/shared/TostNotification";
import DocumentScanner from "react-native-document-scanner-plugin";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useFocusEffect } from "@react-navigation/native";

const AUTO_DETECT_SCAN_OPTIONS = {
  maxNumDocuments: 20,
  letUserAdjustCrop: true,
  responseType: "imageFilePath",
  croppedImageQuality: 100,
} as const;

type ScannedPage = {
  id: string;
  uri: string;
};

const PdfScanner = ({ navigation }: any) => {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [isCreatingPdf, setIsCreatingPdf] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showBottomToast, setShowBottomToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const hasAutoOpenedOnFocus = useRef(false);

  const toPageItems = (uris: string[]): ScannedPage[] =>
    uris.map((uri, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
      uri,
    }));

  const scanDocuments = async (replaceExisting = false) => {
    if (isScanning) {
      return;
    }

    setIsScanning(true);

    try {
      const result = await DocumentScanner.scanDocument(
        AUTO_DETECT_SCAN_OPTIONS as any,
      );

      const scannedImages = result?.scannedImages ?? [];

      if (!scannedImages.length) {
        setToastMessage("No document detected. Try better lighting.");
        setShowBottomToast(true);
        return;
      }

      const scannedPages = toPageItems(scannedImages);
      setPages((prev) =>
        replaceExisting ? scannedPages : [...prev, ...scannedPages],
      );
      setToastMessage(`${scannedImages.length} document(s) scanned.`);
      setShowBottomToast(true);
    } catch {
      setToastMessage("Could not scan documents.");
      setShowBottomToast(true);
    } finally {
      setIsScanning(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!hasAutoOpenedOnFocus.current) {
        hasAutoOpenedOnFocus.current = true;
        scanDocuments(true);
      }

      return () => {
        hasAutoOpenedOnFocus.current = false;
      };
    }, []),
  );

  const createPdf = async () => {
    if (!pages.length || isCreatingPdf) {
      return;
    }

    setIsCreatingPdf(true);

    try {
      const orderedImageUris = pages.map((page) => page.uri);
      const uri = await createPdfFromImages(orderedImageUris);
      const saved = await savePdfToMyPdfFolderFromUri(uri, "scanner");

      setPdfUri(saved.fileUri);
      navigation.navigate("PdfViewer", {
        pdfUri: saved.fileUri,
        title: "Scanned PDF",
      });
    } catch (error: any) {
      if (error?.message === PDF_SIZE_LIMIT_MESSAGE) {
        setToastMessage(PDF_SIZE_LIMIT_MESSAGE);
      } else {
        setToastMessage("Could not create PDF. Try fewer images.");
      }

      setShowBottomToast(true);
    } finally {
      setIsCreatingPdf(false);
    }
  };

  const openPdf = async () => {
    if (!pdfUri) return;

    navigation.navigate("PdfViewer", {
      pdfUri,
      title: "Scanned PDF",
    });
  };

  return (
    <View className="flex-1 bg-slate-50 mt-12">
      <View className="p-3 bg-white flex-1">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => scanDocuments(false)}
            disabled={isScanning}
            className={`px-4 py-2 rounded-lg ${isScanning ? "bg-slate-300" : "bg-gray-200"}`}
          >
            <MaterialIcons name="document-scanner" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={createPdf}
            disabled={!pages.length || isCreatingPdf}
            className={`px-4 rounded-lg ${!pages.length || isCreatingPdf ? "bg-blue-300" : "bg-blue-500"}`}
          >
            <Text className="text-white py-2 font-bold">
              {isCreatingPdf ? "Creating..." : "Make PDF"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setPages([])}
          disabled={!pages.length}
          className={`mt-3 items-center rounded-lg py-2 ${pages.length ? "bg-rose-500" : "bg-slate-200"}`}
        >
          <Text className="text-white font-semibold">Clear Pages</Text>
        </TouchableOpacity>

        <View className="mt-3 flex-1">
          <DraggableFlatList
            data={pages}
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => setPages(data)}
            contentContainerStyle={{ paddingBottom: 12 }}
            
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-10">
                <Text className="text-slate-500 text-sm text-center">
                  Camera opens automatically on tab.\nScan documents and
                  long-press to reorder pages.
                </Text>
              </View>
            }
            renderItem={({ item, drag, isActive, getIndex }) => (
              <TouchableOpacity
                onLongPress={drag}
                disabled={isActive}
                className={`mb-3 flex-row items-center rounded-xl border p-2 ${isActive ? "bg-blue-50 border-blue-300" : "bg-white border-slate-200"}`}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: 72, height: 96, borderRadius: 8 }}
                />
                <View className="ml-3 flex-1">
                  <Text className="text-slate-900 font-semibold">
                    Page {(getIndex?.() ?? 0) + 1}
                  </Text>
                  <Text className="text-slate-500 text-xs mt-1">
                    Tap and hold to drag and reorder
                  </Text>
                </View>
                <MaterialIcons
                  name="drag-indicator"
                  size={24}
                  color="#64748B"
                />
              </TouchableOpacity>
            )}
          />
        </View>

        {pdfUri ? (
          <TouchableOpacity
            onPress={openPdf}
            className="bg-green-600 mt-3 px-4 py-2 rounded-lg items-center"
          >
            <Text className="text-white font-bold">View PDF</Text>
          </TouchableOpacity>
        ) : null}

        <Text className="text-xs text-slate-500 mt-3">
          Exit camera to review pages, then long-press and drag to reorder PDF
          pages.
        </Text>
      </View>

      <TostNotification
        visible={showBottomToast}
        message={toastMessage}
        onHide={() => setShowBottomToast(false)}
      />
    </View>
  );
};

export default PdfScanner;
