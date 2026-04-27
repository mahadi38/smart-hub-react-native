import React, { useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";
import { View, Text, Pressable, Alert } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { SafeAreaView } from "react-native-safe-area-context";
import { setRecentPdf } from "../utils/RecentPdf";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import AntDesign from "@expo/vector-icons/AntDesign";
import PDFDocument from "pdf-lib/cjs/api/PDFDocument";
import TostNotification from "../components/shared/TostNotification";
import { savePdfToMyPdfFolderFromUri } from "../utils/PdfStorage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

const MargePDF = ({ navigation, route }: any) => {
  const [pickedFiles, setPickedFiles] = useState<
    DocumentPicker.DocumentPickerAsset[]
  >([]);
  const [mergedPdfUri, setMergedPdfUri] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isMerging, setIsMerging] = useState(false);

  const title = route?.params?.toolTitle ?? "Merge PDF";

  const subtitle = useMemo(
    () =>
      "Choose multiple PDF files, merge them in order, and download a clean combined file.",
    [],
  );

  const loadPdfFromUri = async (uri: string) => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return PDFDocument.load(base64, {
      ignoreEncryption: true,
    });
  };

  const pickPdfFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf"],
      copyToCacheDirectory: true,
      multiple: true,
    });

    if (result.canceled) return;

    setMergedPdfUri(null);
    setPickedFiles((previousFiles) => {
      const mergedFiles = [...previousFiles, ...result.assets];
      const uniqueFiles = mergedFiles.filter(
        (file, index, self) =>
          index === self.findIndex((item) => item.uri === file.uri),
      );

      return uniqueFiles;
    });
  };

  const mergePdfs = async () => {
    if (pickedFiles.length < 2) {
      Alert.alert("Need more files", "Select at least 2 PDF files to merge.");
      return;
    }
    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of pickedFiles) {
        let sourceDoc;
        try {
          sourceDoc = await loadPdfFromUri(file.uri);
        } catch (loadError) {
          Alert.alert(
            "Merge failed",
            `Could not open ${file.name || "one selected PDF"}. Some PDFs are encrypted or unsupported.`,
          );
          setIsMerging(false);
          return;
        }
        const pages = await mergedPdf.copyPages(
          sourceDoc,
          sourceDoc.getPageIndices(),
        );
        pages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }
      const mergedBase64 = await mergedPdf.saveAsBase64({ dataUri: false });
      const outputPath = `${FileSystem.documentDirectory}merged-${Date.now()}.pdf`;
      await FileSystem.writeAsStringAsync(outputPath, mergedBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const saved = await savePdfToMyPdfFolderFromUri(outputPath, "merged");
      setMergedPdfUri(saved.fileUri);
      setShowToast(true);
    } catch (error) {
      Alert.alert("Merge failed", "Could not merge selected PDFs.");
    } finally {
      setIsMerging(false);
    }
  };

  const viewMergedPdf = async () => {
    if (!mergedPdfUri) {
      Alert.alert("No merged PDF", "Merge files first, then view.");
      return;
    }

    // Save recent PDF before navigating
    setRecentPdf(mergedPdfUri, "Merged PDF");
    navigation.navigate("PdfViewer", {
      pdfUri: mergedPdfUri,
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
              <Text className="text-2xl font-bold text-slate-900">
                Merge PDFs
              </Text>
            </View>
          </View>
        </View>

        <View className="rounded-[32px] bg-white shadow-lg shadow-blue-500 border border-blue-100 p-6 flex-1">
          <View className="flex justify-center items-center">
            <View className={`h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 mb-4 ${route?.params?.bgClassName || "bg-blue-50 border-blue-100"}`}>
              <MaterialIcons
                name={route?.params?.toolIcon || "branches"}
                size={40}
                color={route?.params?.toolColor || "#2563EB"}
              />
            </View>

            <Text className="text-3xl font-bold text-slate-900">{title}</Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500 text-center">
              {subtitle}
            </Text>
          </View>

          <Pressable
            onPress={pickPdfFiles}
            className="mt-6 items-center justify-center rounded-full bg-blue-500 py-4 shadow-md shadow-blue-500 active:opacity-90"
          >
            <View className="flex-row items-center">
              <AntDesign name="cloud-upload" size={20} color="#FFFFFF" />
              <Text className="ml-3 text-base font-semibold text-white">
                Select PDFs Touchab
              </Text>
            </View>
          </Pressable>

          <View className="mt-5 rounded-2xl shadow-md shadow-blue-500 bg-slate-50 border border-slate-200 p-4 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Selected files ({pickedFiles.length})
            </Text>

            {pickedFiles.length ? (
              <DraggableFlatList
                data={pickedFiles}
                className="mb-3"
                keyExtractor={(file, index) => `${file.uri}-${index}`}
                onDragEnd={({ data }) => setPickedFiles(data)}
                renderItem={({ item, drag, isActive, getIndex }) => (
                  <View
                    key={`${item.uri}-${getIndex()}`}
                    className="mb-2 rounded-xl border border-slate-200 bg-white px-3 py-5"
                    style={{ opacity: isActive ? 0.5 : 1 }}
                  >
                    <Text
                      className="text-sm font-medium text-slate-700"
                      numberOfLines={1}
                      onLongPress={drag}
                    >
                      {`${(getIndex() as number) + 1}. ${item.name}`}
                    </Text>
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 10 }}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text className="text-sm font-medium text-slate-500">
                No PDF selected yet
              </Text>
            )}
          </View>

          <Pressable
            onPress={isMerging ? undefined : mergePdfs}
            disabled={isMerging || pickedFiles.length < 2}
            className={`mt-6 items-center justify-center rounded-full py-4 shadow-md active:opacity-90 ${
              pickedFiles.length > 1 && !isMerging
                ? "bg-blue-500 shadow-blue-500"
                : "bg-slate-300 shadow-slate-300"
            }`}
          >
            <View className="flex-row items-center">
              {isMerging ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <AntDesign name="retweet" size={20} color="#FFFFFF" />
              )}
              <Text className="ml-3 text-base font-semibold text-white">
                {isMerging ? "Merging..." : "Merge Now"}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={viewMergedPdf}
            className={`mt-3 items-center justify-center rounded-full py-4 shadow-md active:opacity-90 ${
              mergedPdfUri
                ? "bg-emerald-600 shadow-emerald-500"
                : "bg-slate-300 shadow-slate-300"
            }`}
          >
            <View className="flex-row items-center">
              <AntDesign name="eye" size={20} color="#FFFFFF" />
              <Text className="ml-3 text-base font-semibold text-white">
                View Merged PDF
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <TostNotification
        visible={showToast}
        message="PDFs merged successfully. Tap View Merged PDF."
        onHide={() => setShowToast(false)}
      />
    </SafeAreaView>
  );
};

export default MargePDF;
