import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { allToolsData } from "../constant/AllFeatureData";
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
      <View className="ml-4 flex-row gap-[1px] font-sans items-center">
        <Image
          source={require("../../assets/smart-tools-hub-logo.png")}
          className="w-10 h-10"
        />
        <Text className="text-lg font-extrabold text-blue-500">
          Smart Tools Hub
        </Text>
      </View>
      <View className="px-4 mb-4 mt-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold ml-2">All Tools</Text>

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
              bgClassName: tool.bgClassName,
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
          <View className=" rounded-xl mx-4 py-3 border-t border-l border-r mb-[1px] border-blue-300 p-2 bg-white shadow-md shadow-blue-500">
            <Text className="text-xl text-gray-600 ml-3">{tool.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
