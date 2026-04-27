import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import Home from "../screens/Home";
import AllTools from "../screens/AllTools";
import PdfScanner from "../screens/PdfScanner";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    // Home Bottom tab
    <Tab.Navigator screenOptions={{ headerShown: false,
          tabBarStyle: {
      borderTopWidth: 1, // or 1 for a thin border
      borderTopColor: "#BFDBFE", // choose your color
      // ...other styles
    },
     }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      {/* PDF Scanner bottom tab */}

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

      {/* All Tools Bottom Tab */}

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
