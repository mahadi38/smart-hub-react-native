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
import SearchInput from "./components/shared/SearchInput";

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

    // pressable component for each tool card in home screen, on pressing it navigates to the respective tool screen with the tool data as params

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
      {/* Signup/signin button pressing it open the auth modal and search input field in home screen header */}

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />
      <View className="px-4 flex-row justify-center items-center gap-2">

        {/* Search input field in home screen */}

        <SearchInput className="w-[310px]" />
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
