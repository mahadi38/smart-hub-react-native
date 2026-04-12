import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import Home from "../src/Home";
import AllTools from "../src/AllTools";
import PdfScanner from "../src/PdfScanner";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />

        <Tab.Screen
        name="PdfScanner"
        component={PdfScanner}
        options={{
          title: "Pdf Scanner",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="line-scan"
              color={color}
              size={size}
            />
          ),
        }}
      />


      <Tab.Screen
        name="AllTools"
        component={AllTools}
        options={{
          title: "All Tools",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="view-grid"
              color={color}
              size={size}
            />
          ),
        }}
      />
      
    </Tab.Navigator>
  );
};

export default TabNavigation;
