import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import QRCode from "react-native-qrcode-svg";

const QrGenerator = ({ navigation, route }: any) => {
  const [text, setText] = useState("https://example.com");

  const title = route?.params?.toolTitle ?? "QR Code Generator";
  const safeValue = useMemo(() => {
    const trimmed = text.trim();
    return trimmed.length ? trimmed : " ";
  }, [text]);

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
              name={route?.params?.toolIcon || "qrcode"}
              size={28}
              color={route?.params?.toolColor || "#22C55E"}
            />
          </View>

          <Text className="text-sm text-slate-500 text-center mb-4">
            Type text or link and your QR code updates instantly.
          </Text>

          <View className="rounded-2xl shadow-md shadow-blue-500 bg-slate-50 border border-slate-200 p-4">
            <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Text or URL
            </Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Enter text or URL"
              placeholderTextColor="#94A3B8"
              multiline
              className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 min-h-28"
            />
          </View>

          <View className="mt-5 shadow-md shadow-blue-500 rounded-2xl bg-slate-50 border border-slate-200 p-5 items-center justify-center">
            <QRCode value={safeValue} size={220} color="#0F172A" />
          </View>

          <Pressable
            onPress={() => setText("")}
            className="mt-5 items-center justify-center rounded-full py-4 shadow-md active:opacity-90 bg-slate-700 shadow-slate-400"
          >
            <View className="flex-row items-center">
              <AntDesign name="delete" size={20} color="#FFFFFF" />
              <Text className="ml-3 text-base font-semibold text-white">
                Clear
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QrGenerator;
