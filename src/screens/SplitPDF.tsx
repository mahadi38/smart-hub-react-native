import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { PDFDocument } from "pdf-lib";
import AntDesign from "@expo/vector-icons/AntDesign";
import AppHeader from "../AppHeader";

const SplitPDF = ({navigation, route}:any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sourceName, setSourceName] = useState<string>("");
  const [outputFiles, setOutputFiles] = useState<string[]>([]);

  const ensureOutputFolder = async () => {
    const folder = `${FileSystem.documentDirectory}MyPdf`;
    const info = await FileSystem.getInfoAsync(folder);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
    }
    return folder;
  };

  const pickAndSplitPdf = async () => {
    try {
      setIsLoading(true);
      setOutputFiles([]);

      const pick = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (pick.canceled) return;

      const asset = pick.assets?.[0];
      if (!asset?.uri) {
        Alert.alert("Error", "Could not read selected PDF.");
        return;
      }

      setSourceName(asset.name ?? "selected.pdf");

      const inputBase64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const inputPdf = await PDFDocument.load(inputBase64);
      const pageCount = inputPdf.getPageCount();

      if (pageCount === 0) {
        Alert.alert("Error", "This PDF has no pages.");
        return;
      }

      const outputFolder = await ensureOutputFolder();
      const time = Date.now();
      const createdFiles: string[] = [];

      for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(inputPdf, [pageIndex]);
        newPdf.addPage(copiedPage);

        const outputBase64 = await newPdf.saveAsBase64();
        const outputPath = `${outputFolder}/split_${time}_page_${pageIndex + 1}.pdf`;

        await FileSystem.writeAsStringAsync(outputPath, outputBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        createdFiles.push(outputPath);
      }

      setOutputFiles(createdFiles);
      Alert.alert("Done", `Created ${createdFiles.length} PDF files.`);
    } catch (error) {
      Alert.alert("Split Failed", "Something went wrong while splitting.");
    } finally {
      setIsLoading(false);
    }
  };

  const shareFile = async (fileUri: string) => {
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert("Share Unavailable", "Sharing is not available on this device.");
      return;
    }
    await Sharing.shareAsync(fileUri);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
        <View className='relative justify-center mb-4 h-11 mt-5 mx-3'>
          <Pressable
          onPress={()=>navigation?.goBack?.()}
          className='h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm z-10'
          >
            <AntDesign name="arrow-left" size={20} color="#0F172A" />
          </Pressable>


          <View className='absolute left-0 right-0 items-center'>
            <View className='border bg-white rounded-full px-5 py-2 border-slate-200 shadow-md shadow-blue-500'>
              <Text className='text-xl font-bold text-slate-700'>
                {route?.params?.toolTitle ?? "Edit PDF"}
              </Text>
            </View>
          </View>
        </View>

      <View className="mx-3 mt-2 mb-2 flex-1 rounded-3xl bg-white shadow-xl p-4">
        <Text className="text-xl font-bold text-slate-600 mb-1">Split PDF</Text>
        <Text className="text-sm text-gray-500 mb-4">
          Pick one PDF, then it creates one file per page.
        </Text>

        <Pressable
          onPress={pickAndSplitPdf}
          disabled={isLoading}
          className={`rounded-xl py-3 px-4 flex-row items-center justify-center ${
            isLoading ? "bg-blue-300" : "bg-blue-500"
          }`}
        >
          <AntDesign name="upload" size={18} color="#fff" />
          <Text className="text-white font-semibold ml-2">
            {isLoading ? "Splitting..." : "Pick PDF & Split"}
          </Text>
        </Pressable>

        {sourceName ? (
          <Text className="mt-3 text-gray-600">Source: {sourceName}</Text>
        ) : null}

        {isLoading ? (
          <View className="mt-4 items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : null}

        <ScrollView className="mt-4">
          {outputFiles.map((file, index) => (
            <View
              key={file}
              className="mb-2 p-3 rounded-xl border border-gray-200 bg-gray-50"
            >
              <Text className="text-gray-700 mb-2 ml-36">Page {index + 1}</Text>
              <Pressable
                onPress={() => shareFile(file)}
                className="bg-emerald-500 rounded-lg ml-[120px] py-2 px-3 self-start"
              >
                <Text className="text-white font-medium">Share</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SplitPDF;