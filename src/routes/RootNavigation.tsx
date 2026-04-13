import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DrawerNavigation from "./DrawerNavigation";
import UploadPDF from "../screens/UploadPDF";

const RootStack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <RootStack.Screen name="UploadPDF" component={UploadPDF} />
    </RootStack.Navigator>
  );
};

export default RootNavigation;
