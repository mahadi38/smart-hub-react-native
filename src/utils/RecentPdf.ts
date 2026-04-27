import AsyncStorage from "@react-native-async-storage/async-storage";

const RECENT_PDF_KEY = "recent_pdf";

export const setRecentPdf = async (pdfUri: string, title?: string) => {
  await AsyncStorage.setItem(RECENT_PDF_KEY, JSON.stringify({ pdfUri, title }));
};

export const getRecentPdf = async (): Promise<{
  pdfUri: string;
  title?: string;
} | null> => {
  const value = await AsyncStorage.getItem(RECENT_PDF_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const clearRecentPdf = async () => {
  await AsyncStorage.removeItem(RECENT_PDF_KEY);
};
