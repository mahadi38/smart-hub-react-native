import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DrawerNavigation from "./DrawerNavigation";
import UploadPDF from "../screens/ImageToPDF";
import QrScanner from "../screens/QrScanner";
import MargePDF from "../screens/MargePDF";
import PdfViewer from "../screens/PdfViewer";
import FileManager from "../screens/FileManager";
import AddHeaderFooter from "../screens/AddHeaderFooter";
import PageNumber from "../screens/PageNumber";
import CompressPDF from "../screens/CompressPDF";
import QrGenerator from "../screens/QrGenerator";
import PdfWatermark from "../screens/PdfWatermark";
import ResizePDF from "../screens/ResizePDF";
import CropPdf from "../screens/CropPdf";
import SplitPDF from "../screens/SplitPDF";
import EditPdf from "../screens/EditPdf";
import TermsWebView from "../components/TermsWebView";
import ContactWebview from "../components/ContactWebview";

const RootStack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <RootStack.Screen name="UploadPDF" component={UploadPDF} />
      <RootStack.Screen name="QrScanner" component={QrScanner} />
      <RootStack.Screen name="MargePDF" component={MargePDF} />
      <RootStack.Screen name="PdfViewer" component={PdfViewer} />
      <RootStack.Screen name="FileManager" component={FileManager} />
      <RootStack.Screen name="AddHeaderFooter" component={AddHeaderFooter} />
      <RootStack.Screen name="PageNumber" component={PageNumber} />
      <RootStack.Screen name="CompressPDF" component={CompressPDF} />
      <RootStack.Screen name="QrGenerator" component={QrGenerator} />
      <RootStack.Screen name="PdfWatermark" component={PdfWatermark} />
      <RootStack.Screen name="ResizePDF" component={ResizePDF} />
      <RootStack.Screen name="CropPdf" component={CropPdf} />
      <RootStack.Screen name="SplitPDF" component={SplitPDF} />
      <RootStack.Screen name="EditPdf" component={EditPdf} />
      <RootStack.Screen name="TermsWebView" component={TermsWebView} />
      <RootStack.Screen name="ContactWebview" component={ContactWebview} />
    </RootStack.Navigator>
  );
};

export default RootNavigation;