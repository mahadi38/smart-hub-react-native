import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import TostNotification from "../components/shared/TostNotification";
import { savePdfToMyPdfFolderFromUri } from "../utils/PdfStorage";
import { createPdfFromImages, PDF_SIZE_LIMIT_MESSAGE } from "../utils/ImagePdf";
import DocumentScanner from "react-native-document-scanner-plugin";
import DraggableFlatList from "react-native-draggable-flatlist";

const AUTO_DETECT_SCAN_OPTIONS = {
  maxNumDocuments: 20,
  letUserAdjustCrop: false,
  responseType: "imageFilePath",
  croppedImageQuality: 100,
} as const;

const UploadPDF = ({ navigation, route }: any) => {
  const [pickedFileName, setPickedFileName] = useState<string | null>(null);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [generatedPdfUri, setGeneratedPdfUri] = useState<string | null>(null);
  const [showBottomToast, setShowBottomToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(
    "PDF created. Tap View PDF.",
  );
  const [isCreatingPdf, setIsCreatingPdf] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const toolTitle = route?.params?.toolTitle ?? "Upload PDF";
  const isImageToPdf = toolTitle.toLowerCase() === "image to pdf";

  const getFileNameFromUri = (uri: string) => {
    const cleanUri = uri.split("?")[0];
    const parts = cleanUri.split("/");

    return parts[parts.length - 1] || "image";
  };

  const createPdfFromDocumentImages = async (selectedImages: string[]) => {
    setImageUris(selectedImages);

    try {
      setIsCreatingPdf(true);
      const pdfUri = await createPdfFromImages(selectedImages);
      const saved = await savePdfToMyPdfFolderFromUri(pdfUri, "image-to-pdf");
      setGeneratedPdfUri(saved.fileUri);
      setToastMessage("PDF created. Tap View PDF.");
      setShowBottomToast(true);
    } catch (error: any) {
      if (error?.message === PDF_SIZE_LIMIT_MESSAGE) {
        setToastMessage(PDF_SIZE_LIMIT_MESSAGE);
        setShowBottomToast(true);
        return;
      }

      Alert.alert(
        "Could not create PDF",
        error?.message || "Please try with fewer images or smaller files.",
      );
    } finally {
      setIsCreatingPdf(false);
    }
  };

  const handlePickPdf = async () => {
    // File picker configuration to allow only PDF and document files, and to copy the selected file to cache Directory.

    const result = await DocumentPicker.getDocumentAsync({
      type: isImageToPdf
        ? ["image/*"]
        : [
            "image/*",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ],
      copyToCacheDirectory: true,
      multiple: isImageToPdf,
    });

    // If the user picked a file, store its name; if no name exists, show default text

    if (!result.canceled) {
      setPickedFileName(result.assets[0]?.name ?? "Selected file");

      if (isImageToPdf) {
        const selectedImages = result.assets
          .map((asset) => asset.uri)
          .filter(Boolean);
        await createPdfFromDocumentImages(selectedImages);
      }
    }
  };

  const handleScanDocuments = async () => {
    if (!isImageToPdf || isScanning) {
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

      setPickedFileName(`${scannedImages.length} scanned document(s)`);
      await createPdfFromDocumentImages(scannedImages);
    } catch {
      setToastMessage("Could not scan documents.");
      setShowBottomToast(true);
    } finally {
      setIsScanning(false);
    }
  };

  const handleViewPdf = async () => {
    if (!generatedPdfUri) {
      Alert.alert("No PDF yet", "Create a PDF first from an image.");
      return;
    }

    navigation.navigate("PdfViewer", {
      pdfUri: generatedPdfUri,
      title: toolTitle,
    });
  };

  return (
   
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="px-5 mt-5 flex-1">
          <View className="mb-4 h-11 justify-center relative">
            {/* Go Back Arrow Button */}

            <Pressable
              onPress={() => navigation?.goBack?.()}
              className="h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm z-10"
            >
              <AntDesign name="arrow-left" size={20} color="#0F172A" />
            </Pressable>
            <View className="absolute left-0 right-0 items-center">
              {/* uplode pdf Title */}

              <View className="border bg-white px-5 py-2 rounded-full border-slate-200">
                <Text className="text-2xl font-bold text-slate-900">
                  Choose a File
                </Text>
              </View>
            </View>
          </View>

          {/* Uploade download body */}

          <View className="rounded-[32px] bg-white shadow-lg shadow-blue-500 border border-blue-100 p-6 ">
            <View className="flex justify-center items-center">
              {/* Dynamic icon and it's color passed from home or AllTools or nevigation drawer */}

              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 mb-4">
                <AntDesign
                  name={route?.params?.toolIcon || "file-pdf"}
                  size={28}
                  color={route?.params?.toolColor || "#2563EB"}
                />
              </View>

              {/* Dynamic Title passed from home or AllTools or nevigation drawer  */}

              <Text className="text-3xl font-bold text-slate-900">
                {toolTitle}
              </Text>
              <Text className="mt-2 text-sm leading-6 text-slate-500">
                {isImageToPdf
                  ? "Choose image files and convert them to PDF instantly."
                  : "Choose a PDF file from your phone and continue with a clean, beautiful flow."}
              </Text>
            </View>

            {/* File upload button */}

            <Pressable
              onPress={handlePickPdf}
              disabled={isCreatingPdf}
              className="mt-6 items-center justify-center rounded-full bg-blue-500 py-4 shadow-md shadow-blue-500 active:opacity-90"
            >
              <View className="flex-row items-center">
                <AntDesign name="cloud-upload" size={20} color="#FFFFFF" />
                <Text className="ml-3 text-base font-semibold text-white">
                  {isCreatingPdf ? "Creating PDF..." : "Upload"}
                </Text>
              </View>
            </Pressable>

            {isImageToPdf ? (
              <Pressable
                onPress={handleScanDocuments}
                disabled={isScanning || isCreatingPdf}
                className={`mt-3 items-center justify-center rounded-full py-4 shadow-md active:opacity-90 ${isScanning || isCreatingPdf ? "bg-slate-300 shadow-slate-300" : "bg-slate-700 shadow-slate-500"}`}
              >
                <View className="flex-row items-center">
                  <AntDesign name="scan" size={20} color="#FFFFFF" />
                  <Text className="ml-3 text-base font-semibold text-white">
                    {isScanning ? "Scanning..." : "Scan Document"}
                  </Text>
                </View>
              </Pressable>
            ) : null}

            {/* Selected files display section */}

            {isImageToPdf ? (
              <View className="mt-5 h-96 rounded-2xl shadow-md shadow-blue-500 bg-slate-50 border border-slate-200 p-4">
                <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                  Selected files ({imageUris.length})
                </Text>

                <DraggableFlatList
                activationDistance={5}
                  data={imageUris}
                  className="mb-3"
                  keyExtractor={(uri, index) => `${uri}-${index}`}
                  onDragEnd={({ data }) => setImageUris(data)}
                  renderItem={({ item, drag, isActive,getIndex }) => (
                    <View
                      key={`${item}-${getIndex()}`}
                      className=" rounded-xl border border-slate-200 bg-white px-3 py-6"
                      style={{ opacity: isActive ? 0.5 : 1 }}
                    >
                      <Text
                        className="text-sm font-medium text-slate-700"
                        numberOfLines={1}
                        onLongPress={drag}
                      >
                        {`${getIndex() as number + 1}. ${getFileNameFromUri(item)}`}
                      </Text>
                    </View>
                  )}
                  contentContainerStyle={{ paddingBottom: 10 }}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            ) : (
              <View className="mt-5 shadow-lg shadow-blue-500 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Selected file
                </Text>
                <Text className="mt-2 text-sm font-medium text-slate-700">
                  {pickedFileName ?? "No file selected yet"}
                </Text>
              </View>
            )}

            {/* Download File button */}

            <Pressable
              onPress={handleViewPdf}
              className={`mt-6 items-center justify-center rounded-full py-4 shadow-md active:opacity-90 ${generatedPdfUri ? "bg-blue-500 shadow-blue-500" : "bg-slate-300 shadow-slate-300"}`}
            >
              <View className="flex-row items-center">
                <AntDesign name="eye" size={20} color="#FFFFFF" />
                <Text className="ml-3 text-base font-semibold text-white">
                  View PDF
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Bottom section with two info cards */}
        </View>

        <TostNotification
          visible={showBottomToast}
          message={toastMessage}
          onHide={() => setShowBottomToast(false)}
        />
      </SafeAreaView>
   
  );
};

export default UploadPDF;
