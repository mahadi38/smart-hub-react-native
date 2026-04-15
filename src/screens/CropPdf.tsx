import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import AntDesign from "@expo/vector-icons/AntDesign";
import PDFDocument from "pdf-lib/cjs/api/PDFDocument";
import TostNotification from "../components/TostNotification";
import { savePdfToMyPdfFolderFromUri } from "../utils/PdfStorage";

const CropPdf = ({ navigation, route }: any) => {
  const [selectedPdfUri, setSelectedPdfUri] = useState<string | null>(null);
  const [selectedPdfName, setSelectedPdfName] = useState<string>("");
  const [leftText, setLeftText] = useState("20");
  const [rightText, setRightText] = useState("20");
  const [topText, setTopText] = useState("20");
  const [bottomText, setBottomText] = useState("20");
  const [resultPdfUri, setResultPdfUri] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const title = route?.params?.toolTitle ?? "Crop PDF";

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
  };

  const toNonNegativeNumber = (value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
      return 0;
    }

    return Math.max(0, parsed);
  };

  const applyCrop = async () => {
    if (!selectedPdfUri) {
      Alert.alert("Select a PDF", "Pick a PDF file first.");
      return;
    }

    const left = toNonNegativeNumber(leftText);
    const right = toNonNegativeNumber(rightText);
    const top = toNonNegativeNumber(topText);
    const bottom = toNonNegativeNumber(bottomText);

    try {
      setIsProcessing(true);

      const sourceBase64 = await FileSystem.readAsStringAsync(selectedPdfUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const pdfDoc = await PDFDocument.load(sourceBase64);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        const cropWidth = pageWidth - left - right;
        const cropHeight = pageHeight - top - bottom;

        if (cropWidth <= 1 || cropHeight <= 1) {
          Alert.alert(
            "Invalid crop values",
            "Crop values are too large for one or more pages.",
          );
          setIsProcessing(false);
          return;
        }

        page.setCropBox(left, bottom, cropWidth, cropHeight);
      }

      const updatedBase64 = await pdfDoc.saveAsBase64({
        dataUri: false,
        useObjectStreams: true,
      });

      const tempPath = `${FileSystem.documentDirectory}crop-${Date.now()}.pdf`;

      await FileSystem.writeAsStringAsync(tempPath, updatedBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const saved = await savePdfToMyPdfFolderFromUri(tempPath, "crop");
      setResultPdfUri(saved.fileUri);
      setShowToast(true);
    } catch {
      Alert.alert("Failed", "Could not crop this PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const viewUpdatedPdf = () => {
    if (!resultPdfUri) {
      Alert.alert("No result yet", "Crop PDF first.");
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
              name={route?.params?.toolIcon || "copyright-circle"}
              size={28}
              color={route?.params?.toolColor || "#10B981"}
            />
          </View>

          <Text className="text-sm text-slate-500 text-center mb-4">
            Crop all PDF pages by margins (in points). 72 points = 1 inch.
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
              Crop margins (points)
            </Text>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs text-slate-500 mb-1">Left</Text>
                <TextInput
                  value={leftText}
                  onChangeText={setLeftText}
                  keyboardType="decimal-pad"
                  placeholder="20"
                  placeholderTextColor="#94A3B8"
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-500 mb-1">Right</Text>
                <TextInput
                  value={rightText}
                  onChangeText={setRightText}
                  keyboardType="decimal-pad"
                  placeholder="20"
                  placeholderTextColor="#94A3B8"
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900"
                />
              </View>
            </View>

            <View className="flex-row gap-3 mt-3">
              <View className="flex-1">
                <Text className="text-xs text-slate-500 mb-1">Top</Text>
                <TextInput
                  value={topText}
                  onChangeText={setTopText}
                  keyboardType="decimal-pad"
                  placeholder="20"
                  placeholderTextColor="#94A3B8"
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-500 mb-1">Bottom</Text>
                <TextInput
                  value={bottomText}
                  onChangeText={setBottomText}
                  keyboardType="decimal-pad"
                  placeholder="20"
                  placeholderTextColor="#94A3B8"
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900"
                />
              </View>
            </View>
          </View>

          <Pressable
            onPress={applyCrop}
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
                {isProcessing ? "Cropping..." : "Crop PDF"}
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
                View Updated PDF
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <TostNotification
        visible={showToast}
        message="PDF cropped. Tap View Updated PDF."
        onHide={() => setShowToast(false)}
      />
    </SafeAreaView>
  );
};

export default CropPdf;