import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigation from "./TabNavigation";
import UploadPDF from "../src/UploadPDF";
import AppHeader from "../src/components/AppHeader";


const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
        
      <Stack.Navigator  screenOptions={{
    header: () => <AppHeader />,
  }}>
        <Stack.Screen name="MainTabs" component={TabNavigation} />
        <Stack.Screen name="UploadPDF" component={UploadPDF} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
