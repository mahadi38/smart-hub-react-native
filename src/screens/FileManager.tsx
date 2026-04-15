import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Sharing from "expo-sharing";
import {
  deletePdfFromMyPdfFolder,
  getOrCreateMyPdfFolder,
  listMyPdfFiles,
} from "../utils/PdfStorage";

const FileManager = ({ navigation }: any) => {
  const [folderUri, setFolderUri] = useState<string>("");
  const [files, setFiles] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadFiles = useCallback(async () => {
    try {
      setRefreshing(true);
      const uri = await getOrCreateMyPdfFolder();
      const list = await listMyPdfFiles();
      setFolderUri(uri);
      setFiles(list);
    } catch {
      Alert.alert("Error", "Could not load MyPdf folder.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const openFile = (fileName: string) => {
    if (!folderUri) return;

    const pdfUri = `${folderUri}${fileName}`;
    navigation.navigate("PdfViewer", {
      pdfUri,
      title: fileName.replace(/\.pdf$/i, ""),
    });
  };

  const shareFile = async (fileName: string) => {
    if (!folderUri) return;

    const pdfUri = `${folderUri}${fileName}`;
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfUri, {
        mimeType: "application/pdf",
        dialogTitle: "Share PDF",
      });
      return;
    }

    Alert.alert("Share unavailable", pdfUri);
  };

  const removeFile = (fileName: string) => {
    Alert.alert("Delete file", `Delete ${fileName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePdfFromMyPdfFolder(fileName);
            await loadFiles();
          } catch {
            Alert.alert("Error", "Could not delete file.");
          }
        },
      },
    ]);
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
              <Text className="text-xl font-bold text-slate-900">
                MyPdf Files
              </Text>
            </View>
          </View>
        </View>

        <View className="rounded-[32px] bg-white shadow-lg shadow-blue-500 border border-blue-100 p-5 flex-1">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-2xl font-bold text-slate-900">
                File Manager
              </Text>
              <Text className="text-sm text-slate-500">
                All saved PDFs in your `MyPdf` folder
              </Text>
            </View>

            <Pressable
              onPress={loadFiles}
              className="h-11 w-11 items-center justify-center rounded-full bg-blue-500"
            >
              <AntDesign name="reload" size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          <FlatList
            data={files}
            keyExtractor={(item) => item}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={loadFiles} />
            }
            ListEmptyComponent={
              <View className="items-center justify-center mt-12 px-6">
                <AntDesign name="folder-open" size={44} color="#94A3B8" />
                <Text className="mt-3 text-lg font-bold text-slate-700">
                  No PDF files yet
                </Text>
                <Text className="mt-1 text-sm text-slate-500 text-center">
                  Create a PDF from scanner, image-to-pdf, or merge to see it
                  here.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <View className="flex-row items-center">
                  <View className="h-12 w-12 rounded-2xl bg-blue-100 items-center justify-center mr-3">
                    <AntDesign name="file-pdf" size={24} color="#2563EB" />
                  </View>

                  <View className="flex-1">
                    <Text
                      className="text-sm font-bold text-slate-900"
                      numberOfLines={1}
                    >
                      {item}
                    </Text>
                    <Text className="text-xs text-slate-500">
                      Saved in MyPdf folder
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2 mt-4">
                  <Pressable
                    onPress={() => openFile(item)}
                    className="flex-1 rounded-full bg-blue-500 py-3 items-center"
                  >
                    <Text className="text-white font-semibold">Open</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => shareFile(item)}
                    className="flex-1 rounded-full bg-emerald-600 py-3 items-center"
                  >
                    <Text className="text-white font-semibold">Share</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => removeFile(item)}
                    className="h-12 w-12 rounded-full bg-rose-500 items-center justify-center"
                  >
                    <AntDesign name="delete" size={18} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FileManager;
