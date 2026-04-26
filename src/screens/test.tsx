import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import AntDesign from "@expo/vector-icons/AntDesign";
import Pdf from "react-native-pdf";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import TostNotification from "../components/shared/TostNotification";
import { savePdfToMyPdfFolderFromUri } from "../utils/PdfStorage";

type PageSize = {
  width: number;
  height: number;
};

type Annotation = {
  pageIndex: number;
  xRatio: number;
  yRatio: number;
  text: string;
  fontSize: number;
};

const DEFAULT_TEXT = "";

const EditPdf = ({ navigation, route }: any) => {
  const [selectedPdfUri, setSelectedPdfUri] = useState<string | null>(null);
  const [selectedPdfName, setSelectedPdfName] = useState<string>("");
  const [pageSizes, setPageSizes] = useState<PageSize[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [draftText, setDraftText] = useState("");
  const [draftAnnotation, setDraftAnnotation] = useState<Annotation | null>(
    null,
  );
  const [containerLayout, setContainerLayout] = useState({
    width: 0,
    height: 0,
  });
  const [resultPdfUri, setResultPdfUri] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const pdfRef = useRef<any>(null);
  const inputRef = useRef<TextInput>(null);

  const title = route?.params?.toolTitle ?? "Edit PDF";

  const activePageSize = useMemo(() => {
    return pageSizes[currentPage - 1] ?? null;
  }, [pageSizes, currentPage]);

  const outputFileName = useMemo(() => {
    return `${FileSystem.documentDirectory}edited-${Date.now()}.pdf`;
  }, []);

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
    const uri = asset?.uri ?? null;
    if (!uri) {
      Alert.alert("Error", "Could not read the selected PDF.");
      return;
    }

    try {
      setIsProcessing(true);
      const sourceBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const pdfDoc = await PDFDocument.load(sourceBase64);
      const sizes = pdfDoc.getPages().map((page) => page.getSize());

      setSelectedPdfUri(uri);
      setSelectedPdfName(asset?.name ?? "Selected PDF");
      setPageSizes(sizes);
      setCurrentPage(1);
      setTotalPages(sizes.length);

      setAnnotations([]);
      setDraftAnnotation(null);
      setDraftText("");
      setResultPdfUri(null);
    } catch {
      Alert.alert("Error", "Could not open this PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const commitDraft = () => {
    if (!draftAnnotation) {
      return;
    }

    const text = draftText.trim();
    if (!text) {
      setDraftAnnotation(null);
      setDraftText("");
      return;
    }

    setAnnotations((previous) => [
      ...previous,
      {
        ...draftAnnotation,
        text,
      },
    ]);
    setDraftAnnotation(null);
    setDraftText("");
    Keyboard.dismiss();
  };

  const getAnnotationsForSave = () => {
    const text = draftText.trim();

    if (!draftAnnotation || !text) {
      return annotations;
    }

    return [
      ...annotations,
      {
        ...draftAnnotation,
        text,
      },
    ];
  };

  useEffect(() => {
    if (!draftAnnotation) {
      return;
    }

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [draftAnnotation]);

  const jumpToPage = (pageNumber: number) => {
    if (!selectedPdfUri || !totalPages) {
      return;
    }

    const clampedPage = Math.max(1, Math.min(pageNumber, totalPages));
    pdfRef.current?.setPage?.(clampedPage);
    setCurrentPage(clampedPage);

    setDraftAnnotation(null);
    setDraftText("");
  };

  const handleTapOnPdf = (x: number, y: number) => {
    if (
      !selectedPdfUri ||
      !activePageSize ||
      !containerLayout.width ||
      !containerLayout.height
    ) {
      return;
    }

    if (draftAnnotation) {
      commitDraft();
    }

    const clampedX = Math.max(0, Math.min(x, containerLayout.width - 8));
    const clampedY = Math.max(0, Math.min(y, containerLayout.height - 8));

    const xRatio = clampedX / containerLayout.width;
    const yRatio = clampedY / containerLayout.height;

    // Font size after edit

    const fontSize = Math.max(
      10,
      Math.min(18, Math.min(activePageSize.width, activePageSize.height) / 36),
    );

    const nextDraft: Annotation = {
      pageIndex: currentPage - 1,
      xRatio,
      yRatio,
      text: DEFAULT_TEXT,
      fontSize,
    };

    setDraftAnnotation(nextDraft);
    setDraftText("");
  };

  const applyEdit = async () => {
    if (!selectedPdfUri) {
      Alert.alert("Select a PDF", "Pick a PDF file first.");
      return;
    }

    const annotationsToSave = getAnnotationsForSave();

    if (!annotationsToSave.length) {
      Alert.alert("Add text", "Tap anywhere on the PDF and type something.");
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

      annotationsToSave.forEach((annotation) => {
        const page = pages[annotation.pageIndex];
        if (!page) {
          return;
        }

        const { width, height } = page.getSize();
        const x = annotation.xRatio * width;
        const yFromTop = annotation.yRatio * height;
        const y = Math.max(8, height - yFromTop - annotation.fontSize);

        page.drawText(annotation.text, {
          x,
          y,
          size: annotation.fontSize,
          font,
          color: rgb(0.08, 0.18, 0.45),
        });
      });

      const updatedBase64 = await pdfDoc.saveAsBase64({
        dataUri: false,
        useObjectStreams: true,
      });

      await FileSystem.writeAsStringAsync(outputFileName, updatedBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const saved = await savePdfToMyPdfFolderFromUri(outputFileName, "edited");
      setAnnotations(annotationsToSave);
      setDraftAnnotation(null);
      setDraftText("");
      Keyboard.dismiss();
      setResultPdfUri(saved.fileUri);
      setShowToast(true);
    } catch {
      Alert.alert("Failed", "Could not edit this PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const viewUpdatedPdf = () => {
    if (!resultPdfUri) {
      Alert.alert("No result yet", "Apply edit first.");
      return;
    }

    navigation.navigate("PdfViewer", {
      pdfUri: resultPdfUri,
      title,
    });
  };

  const renderAnnotation = (annotation: Annotation, index: number) => {
    if (!containerLayout.width || !containerLayout.height) {
      return null;
    }

    const left = annotation.xRatio * containerLayout.width;
    const top = annotation.yRatio * containerLayout.height;

    return (
      <View
        key={`${annotation.pageIndex}-${index}`}
        className="absolute"
        style={{
          left,
          top,
        }}
      >
        {/* font size tap window */}
        <Text className="text-[13px] font-medium text-blue-950">
          {annotation.text}
        </Text>
      </View>
    );
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


        <TostNotification
        visible={showToast}
        message="PDF edited. Tap View Updated PDF."
        onHide={() => setShowToast(true)} 
        className="-mt-12"     
      />

        <View className="flex-1 rounded-[32px] bg-white shadow-lg shadow-blue-500 border border-blue-100 overflow-hidden">
          <View
            className="flex-1 bg-slate-200"
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setContainerLayout({ width, height });
            }}
          >
            {selectedPdfUri ? (
              <Pdf
                ref={pdfRef}
                source={{ uri: selectedPdfUri, cache: true }}
                style={{ flex: 1 }}
                trustAllCerts={false}
                onLoadComplete={(numberOfPages) => setTotalPages(numberOfPages)}
                onPageChanged={(page) => setCurrentPage(page)}
                onError={() =>
                  Alert.alert("Failed", "Could not load this PDF.")
                }
              />
            ) : (
              <View className="flex-1 items-center justify-center px-8">
                <AntDesign name="file-text" size={46} color="#64748B" />
                <Text className="mt-4 text-lg font-bold text-slate-700">
                  No PDF loaded yet
                </Text>
                <Text className="mt-2 text-center text-sm text-slate-500">
                  Select a PDF file to open it in full view and start editing.
                </Text>
              </View>
            )}

            <Pressable
              onPress={(event) => {
                if (draftAnnotation) {
                  commitDraft();
                }

                const { locationX, locationY } = event.nativeEvent;
                handleTapOnPdf(locationX, locationY);
              }}
              className="absolute inset-0"
            />

            <View className="absolute inset-0" pointerEvents="box-none">
              {annotations
                .filter(
                  (annotation) => annotation.pageIndex === currentPage - 1,
                )
                .map((annotation, index) =>
                  renderAnnotation(annotation, index),
                )}

              {draftAnnotation?.pageIndex === currentPage - 1 &&
              containerLayout.width &&
              containerLayout.height ? (
                <View
                  className="absolute"
                  style={{
                    left: draftAnnotation.xRatio * containerLayout.width,
                    top: draftAnnotation.yRatio * containerLayout.height,
                  }}
                >
                  <TextInput
                    ref={inputRef}
                    value={draftText}
                    onChangeText={setDraftText}
                    onBlur={commitDraft}
                    onSubmitEditing={applyEdit}
                    autoFocus
                    blurOnSubmit
                    placeholder="Type here"
                    placeholderTextColor="#94A3B8"
                    className="min-w-[180px] rounded-lg border border-blue-300 bg-white px-3 py-2 text-[16px] font-medium text-slate-900"
                    style={{
                      maxWidth: Math.max(
                        180,
                        containerLayout.width -
                          draftAnnotation.xRatio * containerLayout.width -
                          24,
                      ),
                      minHeight: 46,
                    }}
                  />
                </View>
              ) : null}
            </View>
          </View>

          <View className="border-t border-slate-100 bg-white px-4 py-4">
            <Pressable
              onPress={pickPdf}
              className="items-center justify-center rounded-full bg-blue-500 py-4 shadow-md shadow-blue-500 active:opacity-90"
            >
              <View className="flex-row items-center">
                <AntDesign name="cloud-upload" size={20} color="#FFFFFF" />
                <Text className="ml-3 text-base font-semibold text-white">
                  {selectedPdfUri ? "Choose Another PDF" : "Select PDF"}
                </Text>
              </View>
            </Pressable>

            {totalPages > 1 ? (
              <View className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Page navigation
                </Text>

                <View className="mt-3 flex-row items-center justify-between gap-2">
                  <Pressable
                    onPress={() => jumpToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className={`h-11 flex-1 items-center justify-center rounded-full ${
                      currentPage <= 1 ? "bg-slate-200" : "bg-blue-500"
                    }`}
                  >
                    <Text className="font-semibold text-white">Prev</Text>
                  </Pressable>

                  <View className="mx-2 flex-row items-center rounded-full border border-slate-200 bg-white px-3 py-2">
                    <View className="h-11 w-16 rounded-full border border-slate-300 bg-white px-3 py-2 text-center text-[16px] font-medium text-slate-900 mr-1">
                      <Text className="text-center">{currentPage}</Text>
                    </View>
                    <Text className="text-sm text-slate-500">
                      / {totalPages}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => jumpToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={`h-11 flex-1 items-center justify-center rounded-full ${
                      currentPage >= totalPages ? "bg-slate-200" : "bg-blue-500"
                    }`}
                  >
                    <Text className="font-semibold text-white">Next</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}

            <Text className="mt-3 text-center text-sm text-slate-500">
              Tap on the PDF, type your text, then save.
            </Text>

            <Pressable
              onPress={applyEdit}
              disabled={isProcessing}
              className={`mt-4 items-center justify-center rounded-full py-4 shadow-md active:opacity-90 ${
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
                  {isProcessing ? "Applying..." : "Save Edited PDF"}
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
              < View className="flex-row items-center">
                <AntDesign name="eye" size={20} color="#FFFFFF" />
                <Text className="ml-3 text-base font-semibold text-white">
                  View Updated PDF
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
};

export default EditPdf;
