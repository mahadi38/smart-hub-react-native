import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { allToolsData } from "../../conostant/poulerData";
import AntDesign from "@expo/vector-icons/AntDesign";

const DrawerContent = ({ navigation, ...props }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <DrawerContentScrollView {...props}>
      <View className="px-4 mb-4" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold">All Tools</Text>
          <TouchableOpacity onPress={() => navigation.closeDrawer()}>
            <AntDesign name="close" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
      {allToolsData.map((tool) => (
        <TouchableOpacity
          key={tool.id}
          onPress={() => {
            navigation.navigate("MainStack", {
              screen: tool.route,
              params: {
                toolTitle: tool.title,
                toolIcon: tool.icon,
                toolColor: tool.color,
              },
            });
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
