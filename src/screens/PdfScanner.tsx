import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import React, { useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const PdfScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [facing, setFacing] = useState<"back" | "front">("back");

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center">
        {/* Camera permission button */}

        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-bold">Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Photo Storage from camera and save to state logic

  const takePhoto = async () => {
    const shot = await cameraRef.current?.takePictureAsync({ quality: 0.9 });
    if (shot?.uri) setPhotos((prev) => [...prev, shot.uri]);
  };

  // Take photo from photos state then convert it to base64 and create PDF logic

  const createPdf = async () => {
    if (!photos.length)
      return Alert.alert("No pages", "Capture at least one page.");
    const pages = await Promise.all(
      photos.map(async (uri) => {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        return `<img src="data:image/jpeg;base64,${base64}" style="width:100%;display:block;page-break-after:always;" />`;
      }),
    );

    // converting base64 image to HTML format and then creating PDF from it using expo-print

    const html = `
      <html><body style="margin:0;padding:0;">
      ${pages.join("")}
      </body></html>
    `;

    // Build PDF from HTML and get the saved file path
    
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert("PDF created", uri);
    }
  };

  return (
    <View className="flex-1 bg-black">
      {/* Live camera view from expo-camera and photo preview  */}

      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />
      <View className="p-3 bg-white">
        {/* Craptured photos preview in horizontal scroll view and buttons to flip camera, take photo and create PDF from photos */}

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {photos.map((p) => (
            <Image
              key={p}
              source={{ uri: p }}
              style={{ width: 56, height: 56, marginRight: 8, borderRadius: 8 }}
            />
          ))}
        </ScrollView>
        <View className="flex-row justify-between items-center ">
          <TouchableOpacity
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          >
            <MaterialIcons name="camera-front" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={takePhoto}
            className="g-gray-200 px-4 ml-10 py-2 rounded-lg"
          >
            <MaterialIcons name="camera-alt" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={createPdf}
            className="bg-blue-500 px-4  rounded-lg"
          >
            <Text className="text-white py-2 font-bold">Make PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PdfScanner;
