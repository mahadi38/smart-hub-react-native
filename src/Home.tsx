import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import ToolsIcons from "./components/shared/ToolsIcons";
import { populerData } from "../conostant/poulerData";
import AntDesign from "@expo/vector-icons/AntDesign";
import AuthModal from "./components/AuthModal";

interface toolsItems {
  id: string;
  title: string;
  icon: string;
  color?: string;
  route: string;
}

const Home = ({ navigation }: any) => {
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const renderTools = ({ item }: { item: toolsItems }) => (
    <ToolsIcons
      id={item.id}
      title={item.title}
      icon={item.icon}
      color={item.color}
      onPress={() =>
        navigation?.navigate?.(item.route, {
          toolTitle: item.title,
          toolIcon: item.icon,
          toolColor: item.color,
        })
      }
    />
  );
  return (
    <SafeAreaView
      edges={["left", "right"]}
      className="flex-1 bg-gray-100"
    >
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />
      <View className="px-4 flex-row justify-center items-center gap-2">
        <View className="relative shadow-lg w-[310px] shadow-blue-500 rounded-full">
          <TextInput
            placeholder="Search tools..."
            className="bg-white text-gray-600 rounded-full px-4 py-3 pr-12 text-base shadow-sm border border-gray-200"
            placeholderTextColor="#9CA3AF"
          />

          <View className="absolute right-4 top-1/2 -translate-y-1/2">
            <AntDesign name="search" size={18} color="#6B7280" />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setAuthModalVisible(true)}
          className="h-10 w-10 items-center justify-center mr-2 rounded-full bg-blue-500"
        >
          <AntDesign name="user" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      

      <View className="mx-3 my-3 mb-2 flex-1 rounded-3xl bg-white shadow-xl">
        <View className="mt-2">
        <Text className="text-xl font-bold px-4 mx-auto text-slate-500">
          Popular Tools
        </Text>
      </View>
        <FlatList
          data={populerData}
          renderItem={renderTools}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 10,
          }}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 9 }}
          className="flex-1 shadow-lg shadow-blue-700"
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
