import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Pdf from "react-native-pdf";
import * as Sharing from "expo-sharing";

const PdfViewer = ({ navigation, route }: any) => {
  const pdfUri = route?.params?.pdfUri;
  const title = route?.params?.title ?? "View PDF";

  const handleShare = async () => {
    if (!pdfUri) return;

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfUri, {
        mimeType: "application/pdf",
        dialogTitle: "Share PDF",
      });
      return;
    }

    Alert.alert("Share unavailable", pdfUri);
  };

  if (!pdfUri) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="px-5 mt-5">
          <Pressable
            onPress={() => navigation?.goBack?.()}
            className="h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm"
          >
            <AntDesign name="arrow-left" size={20} color="#0F172A" />
          </Pressable>
          <View className="mt-6 rounded-2xl bg-white border border-slate-200 p-5">
            <Text className="text-lg font-bold text-slate-900">
              No PDF found
            </Text>
            <Text className="text-sm text-slate-500 mt-2">
              Generate or merge a PDF first, then open the viewer.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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

        <View className="flex-1 rounded-[24px] overflow-hidden border border-blue-100 bg-white shadow-lg shadow-blue-400">
          <Pdf
            source={{ uri: pdfUri, cache: true }}
            style={{ flex: 1 }}
            trustAllCerts={false}
          />
        </View>

        <Pressable
          onPress={handleShare}
          className="absolute bottom-12 right-8 h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-xl shadow-blue-500"
        >
          <AntDesign name="share-alt" size={22} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default PdfViewer;
