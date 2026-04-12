import { View, Text, FlatList, TextInput } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";

import ToolsIcons from "./components/shared/ToolsIcons";
import { allToolsData } from "../conostant/poulerData";

interface toolsItems {
  id: string;
  title: string;
  icon: string;
  color?: string;
  route: string;
}

const AllTools = ({ navigation }: any) => {
  const renderTools = ({ item }: { item: toolsItems }) => (
    <ToolsIcons
      id={item.id}
      title={item.title}
      icon={item.icon}
      color={item.color}
      onPress={() =>
        navigation?.navigate?.(item.route, { toolTitle: item.title ,toolIcon: item.icon, toolColor: item.color})
      }
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 py-2 mt-3 shadow-lg shadow-blue-500">
        <View className="relative shadow-lg shadow-blue-800 rounded-full">
          <TextInput
            placeholder="Search tools..."
            className="bg-white rounded-full text-gray-600 px-4 py-3 pr-12 text-base shadow-sm border border-gray-200"
            placeholderTextColor="#9CA3AF"
          />
          <View className="absolute right-4 top-1/2 -translate-y-1/2">
            <AntDesign name="search" size={18} color="#6B7280" />
          </View>
        </View>
      </View>

      <View className="shadow-md bg-white py-3 mx-3 mt-2 mb-2 shadow-blue-500 rounded-full">
        <Text className="text-xl font-bold px-4 mx-auto">All Tools</Text>
      </View>

      <View className="mx-3 flex-1 rounded-3xl bg-white shadow-xl">
        <FlatList
          data={allToolsData}
          renderItem={renderTools}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 10,
          }}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 14 }}
          className="flex-1 shadow-lg"
        />
      </View>
    </SafeAreaView>
  );
};

export default AllTools;
