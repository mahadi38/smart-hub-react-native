import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MY_PDF_FOLDER_URI_KEY = "my_pdf_folder_uri";
const MY_PDF_FOLDER_NAME = "MyPdf";

export type SavedPdfResult = {
  fileUri: string;
  fileName: string;
  folderUri: string;
};

const getFolderPath = () => {
  if (!FileSystem.documentDirectory) {
    throw new Error("Document directory is not available.");
  }

  return `${FileSystem.documentDirectory}${MY_PDF_FOLDER_NAME}/`;
};

const getStoredFolderUri = async (): Promise<string | null> => {
  return AsyncStorage.getItem(MY_PDF_FOLDER_URI_KEY);
};

const setStoredFolderUri = async (folderUri: string) => {
  await AsyncStorage.setItem(MY_PDF_FOLDER_URI_KEY, folderUri);
};

export const clearStoredMyPdfFolder = async () => {
  await AsyncStorage.removeItem(MY_PDF_FOLDER_URI_KEY);
};

export const getOrCreateMyPdfFolder = async (): Promise<string> => {
  const stored = await getStoredFolderUri();
  const expectedFolder = getFolderPath();

  if (stored && stored.startsWith(expectedFolder)) {
    return stored;
  }

  if (stored) {
    await clearStoredMyPdfFolder();
  }

  const folderUri = expectedFolder;
  const info = await FileSystem.getInfoAsync(folderUri);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
  }

  await setStoredFolderUri(folderUri);
  return folderUri;
};

export const savePdfToMyPdfFolderFromUri = async (
  sourcePdfUri: string,
  prefix = "pdf",
): Promise<SavedPdfResult> => {
  const folderUri = await getOrCreateMyPdfFolder();
  const fileName = `${prefix}-${Date.now()}.pdf`;
  const destinationUri = `${folderUri}${fileName}`;

  const destinationInfo = await FileSystem.getInfoAsync(destinationUri);
  if (destinationInfo.exists) {
    await FileSystem.deleteAsync(destinationUri, { idempotent: true });
  }

  await FileSystem.copyAsync({
    from: sourcePdfUri,
    to: destinationUri,
  });

  return {
    fileUri: destinationUri,
    fileName,
    folderUri,
  };
};

export const listMyPdfFiles = async (): Promise<string[]> => {
  const folderUri = await getOrCreateMyPdfFolder();
  return FileSystem.readDirectoryAsync(folderUri);
};

export const getPdfFileUri = async (fileName: string) => {
  const folderUri = await getOrCreateMyPdfFolder();
  return `${folderUri}${fileName}`;
};

export const deletePdfFromMyPdfFolder = async (fileName: string) => {
  const folderUri = await getOrCreateMyPdfFolder();
  const fileUri = `${folderUri}${fileName}`;

  await FileSystem.deleteAsync(fileUri, { idempotent: true });
};
