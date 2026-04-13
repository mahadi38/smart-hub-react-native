import React, { useState } from "react";
import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";

const QrScanner = () => {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState("");

  const handleScan = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setResult(data);
  };

  const openIfUrl = async () => {
    if (!result) return;
    const isUrl = result.startsWith("http://") || result.startsWith("https://");

    if (!isUrl) {
      Alert.alert("Scanned Content", result);
      return;
    }

    const canOpen = await Linking.canOpenURL(result);
    if (!canOpen) {
      Alert.alert("Invalid URL", result);
      return;
    }

    await Linking.openURL(result);
  };

  if (!permission) return <View className="flex-1 bg-black" />;

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-center text-gray-700 mb-4">
          Camera permission is required to scan QR codes.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-500 px-5 py-3 rounded-lg"
        >
          <Text className="text-white font-bold">Allow Camera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        onBarcodeScanned={scanned ? undefined : handleScan}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />

      <View
        className="bg-white p-4"
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        <Text className="text-xs text-gray-500">Scanned Content</Text>
        <Text className="text-base text-gray-900 mt-1" numberOfLines={3}>
          {result || "Point camera at a QR code"}
        </Text>

        <View className="flex-row gap-3 mt-4 mb-5">
          <TouchableOpacity
            className="flex-1 bg-gray-200 py-3 rounded-lg items-center"
            onPress={() => {
              setScanned(false);
              setResult("");
            }}
          >
            <Text className="font-semibold text-gray-800">Scan Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg items-center ${result ? "bg-blue-500" : "bg-blue-200"}`}
            disabled={!result}
            onPress={openIfUrl}
          >
            <Text className="font-semibold text-white">Open</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default QrScanner;
