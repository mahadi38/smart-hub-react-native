import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { allToolsData } from "../constant/poulerData";
import AntDesign from "@expo/vector-icons/AntDesign";

const DrawerContent = (props: any) => {
  const insets = useSafeAreaInsets();
  const navigation = props.navigation;

  return (
    // Custom Drawer content component which is used in Drawer Navigation
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: insets.top + 12 }}
    >
      <View className="px-4 mb-4" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold">All Tools</Text>

          {/* Close button for drawer */}

          <TouchableOpacity onPress={() => navigation.closeDrawer()}>
            <AntDesign name="close" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* All tools data maped to show in drawer  */}

      {allToolsData.map((tool) => (
        <TouchableOpacity
          key={tool.id}
          onPress={() => {
            const toolParams = {
              toolTitle: tool.title,
              toolIcon: tool.icon,
              toolColor: tool.color,
            };

            const rootNavigation = navigation.getParent();
            if (rootNavigation) {
              rootNavigation.navigate(tool.route, toolParams);
            } else {
              navigation.navigate("MainTabs", {
                screen: "AllTools",
                params: toolParams,
              });
            }

            navigation.closeDrawer();
          }}
        >
          <View className="border border-blue-300/60 rounded-lg mx-4 mb-2 p-2 bg-white shadow-lg shadow-blue-200">
            <Text className="text-xl text-gray-700">{tool.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
