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
import TostNotification from "../components/shared/TostNotification";
import { savePdfToMyPdfFolderFromUri } from "../utils/PdfStorage";

const PRESETS = {
  A4: { width: 595.28, height: 841.89 },
  LETTER: { width: 612, height: 792 },
};

const clampScale = (value: number) => {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 1;
  }

  return Math.min(2, Math.max(0.3, value));
};

const ResizePDF = ({ navigation, route }: any) => {
  const [selectedPdfUri, setSelectedPdfUri] = useState<string | null>(null);
  const [selectedPdfName, setSelectedPdfName] = useState<string>("");
  const [mode, setMode] = useState<"A4" | "LETTER">("A4");
  const [scaleText, setScaleText] = useState("1.00");
  const [resultPdfUri, setResultPdfUri] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const title = route?.params?.toolTitle ?? "Resize PDF";

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

  const applyResize = async () => {
    if (!selectedPdfUri) {
      Alert.alert("Select a PDF", "Pick a PDF file first.");
      return;
    }

    const scale = clampScale(Number(scaleText));
    if (scale <= 0) {
      Alert.alert("Invalid scale", "Scale must be greater than 0.");
      return;
    }

    try {
      setIsProcessing(true);

      const sourceBase64 = await FileSystem.readAsStringAsync(selectedPdfUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const pdfDoc = await PDFDocument.load(sourceBase64);
      const pages = pdfDoc.getPages();
      const target = PRESETS[mode];

      pages.forEach((page) => {
        const oldW = page.getWidth();
        const oldH = page.getHeight();

        const fitScale = Math.min(target.width / oldW, target.height / oldH);
        const combinedScale = fitScale * scale;
        const contentW = oldW * combinedScale;
        const contentH = oldH * combinedScale;

        const offsetX = (target.width - contentW) / 2;
        const offsetY = (target.height - contentH) / 2;

        page.setSize(target.width, target.height);
        page.scaleContent(combinedScale, combinedScale);
        page.translateContent(offsetX / combinedScale, offsetY / combinedScale);
      });

      const updatedBase64 = await pdfDoc.saveAsBase64({
        dataUri: false,
        useObjectStreams: true,
      });
      const tempPath = `${FileSystem.documentDirectory}resize-${Date.now()}.pdf`;

      await FileSystem.writeAsStringAsync(tempPath, updatedBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const saved = await savePdfToMyPdfFolderFromUri(tempPath, "resize");
      setResultPdfUri(saved.fileUri);
      setShowToast(true);
    } catch {
      Alert.alert("Failed", "Could not resize this PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const viewUpdatedPdf = () => {
    if (!resultPdfUri) {
      Alert.alert("No result yet", "Resize PDF first.");
      return;
    }

    navigation.navigate("PdfViewer", {
      pdfUri: resultPdfUri,
      title,
    });
  };

  const handleKeyboardApply = () => {
    if (isProcessing) {
      return;
    }

    applyResize();
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
              name={route?.params?.toolIcon || "block"}
              size={28}
              color={route?.params?.toolColor || "#F52891"}
            />
          </View>

          <Text className="text-sm text-slate-500 text-center mb-4">
            Resize pages to A4 or Letter. You can tweak the scale.
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

          <View className="mt-4 shadow-md shadow-blue-500 rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Selected file
            </Text>
            <Text className="mt-2 text-sm font-medium text-slate-700">
              {selectedPdfName || "No file selected yet"}
            </Text>
          </View>

          <View className="mt-4 shadow-md shadow-blue-500 rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Target page size
            </Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setMode("A4")}
                className={`flex-1 rounded-full py-3 items-center ${mode === "A4" ? "bg-blue-500" : "bg-slate-200"}`}
              >
                <Text
                  className={`font-semibold ${mode === "A4" ? "text-white" : "text-slate-700"}`}
                >
                  A4
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setMode("LETTER")}
                className={`flex-1 rounded-full py-3 items-center ${mode === "LETTER" ? "bg-blue-500" : "bg-slate-200"}`}
              >
                <Text
                  className={`font-semibold ${mode === "LETTER" ? "text-white" : "text-slate-700"}`}
                >
                  Letter
                </Text>
              </Pressable>
            </View>

            <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-4 mb-2">
              Scale (0.30 to 2.00)
            </Text>
            <TextInput
              value={scaleText}
              onChangeText={setScaleText}
              keyboardType="decimal-pad"
              placeholder="1.00"
              placeholderTextColor="#94A3B8"
              returnKeyType="done"
              onSubmitEditing={handleKeyboardApply}
              className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900"
            />
          </View>

          <Pressable
            onPress={applyResize}
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
                {isProcessing ? "Resizing..." : "Resize PDF"}
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
        message="PDF resized. Tap View Updated PDF."
        onHide={() => setShowToast(false)}
      />
    </SafeAreaView>
  );
};

export default ResizePDF;
