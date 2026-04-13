import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import AntDesign from "@expo/vector-icons/AntDesign";

const UploadPDF = ({ navigation, route }: any) => {
  const [pickedFileName, setPickedFileName] = useState<string | null>(null);
  const toolTitle = route?.params?.toolTitle ?? "Upload PDF";

  const handlePickPdf = async () => {
    // File picker configuration to allow only PDF and document files, and to copy the selected file to cache Directory.

    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "image/*",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
      copyToCacheDirectory: true,
      multiple: false,
    });

    // If the user picked a file, store its name; if no name exists, show default text

    if (!result.canceled) {
      setPickedFileName(result.assets[0]?.name ?? "Selected PDF");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-5 -mt-4 flex-1">
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

        <View className="rounded-[32px] bg-white shadow-lg shadow-blue-500 border border-blue-100 p-6">
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
              Choose a PDF file from your phone and continue with a clean,
              beautiful flow.
            </Text>
          </View>

          {/* File upload button */}

          <Pressable
            onPress={handlePickPdf}
            className="mt-6 items-center justify-center rounded-full bg-blue-500 py-4 shadow-md shadow-blue-500 active:opacity-90"
          >
            <View className="flex-row items-center">
              <AntDesign name="cloud-upload" size={20} color="#FFFFFF" />
              <Text className="ml-3 text-base font-semibold text-white">
                Uploade
              </Text>
            </View>
          </Pressable>

          {/* Selected file name display section */}

          <View className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Selected file
            </Text>
            <Text className="mt-2 text-sm font-medium text-slate-700">
              {pickedFileName ?? "No PDF selected yet"}
            </Text>
          </View>

          {/* Download File button */}

        <Pressable
            
            className="mt-6 items-center justify-center rounded-full bg-blue-500 py-4 shadow-md shadow-blue-500 active:opacity-90"
          >
            <View className="flex-row items-center">
              <AntDesign name="cloud-upload" size={20} color="#FFFFFF" />
              <Text className="ml-3 text-base font-semibold text-white">
                Download
              </Text>
            </View>
          </Pressable>

        </View>

        {/* Bottom section with two info cards */}

        <View className="mt-6 flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
            <Text className="text-lg font-bold text-slate-900">Fast</Text>
            <Text className="mt-1 text-xs text-slate-500">
              Quick PDF selection from device storage.
            </Text>
          </View>
          <View className="flex-1 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
            <Text className="text-lg font-bold text-slate-900">Clean</Text>
            <Text className="mt-1 text-xs text-slate-500">
              Beautiful upload layout with blue accents.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UploadPDF;
