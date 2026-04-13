import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DrawerNavigation from "./DrawerNavigation";
import UploadPDF from "../screens/UploadPDF";
import QrScanner from "../screens/QrScanner";
import MargePDF from "../components/MargePDF";
import PdfViewer from "../screens/PdfViewer";

const RootStack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <RootStack.Screen name="UploadPDF" component={UploadPDF} />
      <RootStack.Screen name="QrScanner" component={QrScanner} />
      <RootStack.Screen name="MargePDF" component={MargePDF} />
      <RootStack.Screen name="PdfViewer" component={PdfViewer} />
    </RootStack.Navigator>
  );
};

export default RootNavigation;
