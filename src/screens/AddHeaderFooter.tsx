import React, { useRef, useState } from "react";
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
import { StandardFonts, rgb } from "pdf-lib";
import TostNotification from "../components/shared/TostNotification";
import { savePdfToMyPdfFolderFromUri } from "../utils/PdfStorage";

const SIDE_PADDING = 28;

const getAdjustedFontSize = (
  text: string,
  maxWidth: number,
  baseSize: number,
  font: any,
) => {
  if (!text) {
    return baseSize;
  }

  const textWidth = font.widthOfTextAtSize(text, baseSize);
  if (textWidth <= maxWidth) {
    return baseSize;
  }

  const scaled = (maxWidth / textWidth) * baseSize;
  return Math.max(8, scaled);
};

const AddHeaderFooter = ({ navigation, route }: any) => {
  const [selectedPdfUri, setSelectedPdfUri] = useState<string | null>(null);
  const [selectedPdfName, setSelectedPdfName] = useState<string>("");
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [resultPdfUri, setResultPdfUri] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const footerInputRef = useRef<TextInput>(null);

  const title = route?.params?.toolTitle ?? "Add Header & Footer";

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

  const applyHeaderFooter = async () => {
    if (!selectedPdfUri) {
      Alert.alert("Select a PDF", "Pick a PDF file first.");
      return;
    }

    if (!headerText.trim() && !footerText.trim()) {
      Alert.alert(
        "Add text",
        "Type header text or footer text before applying.",
      );
      return;
    }

    try {
      setIsProcessing(true);

      const sourceBase64 = await FileSystem.readAsStringAsync(selectedPdfUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const pdfDoc = await PDFDocument.load(sourceBase64);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNumber = index + 1;
        const maxWidth = width - SIDE_PADDING * 2;

        if (headerText.trim()) {
          const text = headerText.trim().replace("{page}", String(pageNumber));
          const fontSize = getAdjustedFontSize(text, maxWidth, 14, font);
          const textWidth = font.widthOfTextAtSize(text, fontSize);
          const x = Math.max(SIDE_PADDING, (width - textWidth) / 2);

          page.drawText(text, {
            x,
            y: height - 24,
            size: fontSize,
            font,
            color: rgb(0.1, 0.1, 0.1),
          });
        }

        if (footerText.trim()) {
          const text = footerText.trim().replace("{page}", String(pageNumber));
          const fontSize = getAdjustedFontSize(text, maxWidth, 12, font);
          const textWidth = font.widthOfTextAtSize(text, fontSize);
          const x = Math.max(SIDE_PADDING, (width - textWidth) / 2);

          page.drawText(text, {
            x,
            y: 18,
            size: fontSize,
            font,
            color: rgb(0.1, 0.1, 0.1),
          });
        }
      });

      const updatedBase64 = await pdfDoc.saveAsBase64({ dataUri: false });
      const tempPath = `${FileSystem.documentDirectory}header-footer-${Date.now()}.pdf`;

      await FileSystem.writeAsStringAsync(tempPath, updatedBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const saved = await savePdfToMyPdfFolderFromUri(
        tempPath,
        "header-footer",
      );
      setResultPdfUri(saved.fileUri);
      setShowToast(true);
    } catch (error) {
      Alert.alert("Failed", "Could not add header/footer to this PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const viewUpdatedPdf = () => {
    if (!resultPdfUri) {
      Alert.alert("No result yet", "Apply header/footer first.");
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

    applyHeaderFooter();
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
              name={route?.params?.toolIcon || "file-text"}
              size={28}
              color={route?.params?.toolColor || "#10B981"}
            />
          </View>

          <Text className="text-sm text-slate-500 text-center mb-4">
            Pick a PDF, type your header/footer,
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
              Header text
            </Text>
            <TextInput
              value={headerText}
              onChangeText={setHeaderText}
              placeholder="Example: My Company Report - Page {page}"
              placeholderTextColor="#94A3B8"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => footerInputRef.current?.focus()}
              className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900"
            />

            <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-4 mb-2">
              Footer text
            </Text>
            <TextInput
              ref={footerInputRef}
              value={footerText}
              onChangeText={setFooterText}
              placeholder="Example: Confidential | {page}"
              placeholderTextColor="#94A3B8"
              returnKeyType="done"
              onSubmitEditing={handleKeyboardApply}
              className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900"
            />
          </View>

          <Pressable
            onPress={applyHeaderFooter}
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
                {isProcessing ? "Applying..." : "Apply Header & Footer"}
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
        message="Header/footer added. Tap View Updated PDF."
        onHide={() => setShowToast(false)}
      />
    </SafeAreaView>
  );
};

export default AddHeaderFooter;
