import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import AntDesign from "@expo/vector-icons/AntDesign";
import PDFDocument from "pdf-lib/cjs/api/PDFDocument";
import TostNotification from "../components/TostNotification";
import { savePdfToMyPdfFolderFromUri } from "../utils/PdfStorage";

const formatKb = (bytes?: number | null) => {
  if (!bytes || bytes <= 0) {
    return "0 KB";
  }

  return `${(bytes / 1024).toFixed(2)} KB`;
};

const CompressPDF = ({ navigation, route }: any) => {
  const [selectedPdfUri, setSelectedPdfUri] = useState<string | null>(null);
  const [selectedPdfName, setSelectedPdfName] = useState<string>("");
  const [resultPdfUri, setResultPdfUri] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const title = route?.params?.toolTitle ?? "Compress PDF";

  const pickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf"],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];
    setSelectedPdfUri(asset?.uri ?? null);
    setSelectedPdfName(asset?.name ?? "Selected PDF");
    setResultPdfUri(null);
    setCompressedSize(null);

    const sourceInfo = await FileSystem.getInfoAsync(asset?.uri ?? "");
    setOriginalSize(sourceInfo.exists ? ((sourceInfo as any).size ?? 0) : 0);
  };

  const compressPdf = async () => {
    if (!selectedPdfUri) {
      Alert.alert("Select a PDF", "Pick a PDF file first.");
      return;
    }

    try {
      setIsProcessing(true);

      const sourceBase64 = await FileSystem.readAsStringAsync(selectedPdfUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const pdfDoc = await PDFDocument.load(sourceBase64);
      pdfDoc.setProducer("Smart Tools Hub");
      pdfDoc.setCreator("Smart Tools Hub");

      const optimizedBase64 = await pdfDoc.saveAsBase64({
        dataUri: false,
        useObjectStreams: true,
        updateFieldAppearances: false,
      });

      const tempPath = `${FileSystem.documentDirectory}compressed-${Date.now()}.pdf`;

      await FileSystem.writeAsStringAsync(tempPath, optimizedBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const tempInfo = await FileSystem.getInfoAsync(tempPath);
      const optimizedSize = tempInfo.exists ? ((tempInfo as any).size ?? 0) : 0;

      const saved = await savePdfToMyPdfFolderFromUri(tempPath, "compressed");
      setResultPdfUri(saved.fileUri);
      setCompressedSize(optimizedSize);
      setShowToast(true);
    } catch (error) {
      Alert.alert("Failed", "Could not compress this PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const viewUpdatedPdf = () => {
    if (!resultPdfUri) {
      Alert.alert("No result yet", "Compress your PDF first.");
      return;
    }

    navigation.navigate("PdfViewer", {
      pdfUri: resultPdfUri,
      title,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-5 mt-5 flex-1">
        <View className="mb-4 h-11 justify-center relative">
          <Pressable
            onPress={() => navigation?.goBack?.()}
            className="h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm z-10"
          >
            <AntDesign name="arrow-left" size={20} color="#0F172A" />
          </Pressable>

          <View className="absolute left-0 right-0 items-center">
            <View className="border bg-white px-5 py-2 rounded-full border-slate-200">
              <Text className="text-xl font-bold text-slate-900">{title}</Text>
            </View>
          </View>
        </View>

        <View className="rounded-[32px] bg-white shadow-lg shadow-blue-500 border border-blue-100 p-6 flex-1">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 mb-4 self-center">
            <AntDesign
              name={route?.params?.toolIcon || "compress"}
              size={28}
              color={route?.params?.toolColor || "#EC4899"}
            />
          </View>

          <Text className="text-sm text-slate-500 text-center mb-4">
            Optimize your PDF and save a lighter file into your MyPdf folder.
          </Text>

          <Pressable
            onPress={pickPdf}
            className="items-center justify-center rounded-full bg-blue-500 py-4 shadow-md shadow-blue-500 active:opacity-90"
          >
            <View className="flex-row items-center">
              <AntDesign name="cloud-upload" size={20} color="#FFFFFF" />
              <Text className="ml-3 text-base font-semibold text-white">
                Select PDF
              </Text>
            </View>
          </Pressable>

          <View className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Selected file
            </Text>
            <Text className="mt-2 text-sm font-medium text-slate-700">
              {selectedPdfName || "No file selected yet"}
            </Text>
          </View>

          <View className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              File size
            </Text>
            <Text className="text-sm font-medium text-slate-700">
              Original: {formatKb(originalSize)}
            </Text>
            <Text className="text-sm font-medium text-slate-700 mt-1">
              Compressed: {formatKb(compressedSize)}
            </Text>
          </View>

          <Pressable
            onPress={compressPdf}
            disabled={isProcessing}
            className={`mt-5 items-center justify-center rounded-full py-4 shadow-md active:opacity-90 ${
              isProcessing
                ? "bg-slate-400 shadow-slate-300"
                : "bg-emerald-600 shadow-emerald-500"
            }`}
          >
            <View className="flex-row items-center">
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <AntDesign name="check-circle" size={20} color="#FFFFFF" />
              )}
              <Text className="ml-3 text-base font-semibold text-white">
                {isProcessing ? "Compressing..." : "Compress PDF"}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={viewUpdatedPdf}
            className={`mt-3 items-center justify-center rounded-full py-4 shadow-md active:opacity-90 ${
              resultPdfUri
                ? "bg-blue-500 shadow-blue-500"
                : "bg-slate-300 shadow-slate-300"
            }`}
          >
            <View className="flex-row items-center">
              <AntDesign name="eye" size={20} color="#FFFFFF" />
              <Text className="ml-3 text-base font-semibold text-white">
                View Compressed PDF
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <TostNotification
        visible={showToast}
        message="Compression done. Tap View Compressed PDF."
        onHide={() => setShowToast(false)}
      />
    </SafeAreaView>
  );
};

export default CompressPDF;
