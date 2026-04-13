import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import React, { useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PdfMaker, { PdfMakerRef } from "../components/PdfMaker";

const PdfScanner = ({ navigation }: any) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const pdfMakerRef = useRef<PdfMakerRef>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [pdfUri, setPdfUri] = useState<string | null>(null);

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

  const createPdf = async () => {
    const uri = await pdfMakerRef.current?.createPdf();
    if (!uri) return;

    setPdfUri(uri);
    navigation.navigate("PdfViewer", {
      pdfUri: uri,
      title: "Scanned PDF",
    });
  };

  const openPdf = async () => {
    if (!pdfUri) return;

    navigation.navigate("PdfViewer", {
      pdfUri,
      title: "Scanned PDF",
    });
  };

  return (
    <View className="flex-1 bg-black">
      <PdfMaker ref={pdfMakerRef} images={photos} onPdfReady={setPdfUri} />

      {/* Live camera view from expo-camera and photo preview  */}

      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        ratio="4:3"
      />
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
        {pdfUri ? (
          <TouchableOpacity
            onPress={openPdf}
            className="bg-green-600 mt-3 px-4 py-2 rounded-lg items-center"
          >
            <Text className="text-white font-bold">View PDF</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default PdfScanner;
