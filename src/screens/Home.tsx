import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import ToolsIcons from "../components/shared/ToolsIcons";
import { populerData } from "../constant/AllFeatureData";

import SearchInput from "../components/shared/SearchInput";
import AppHeader from "../AppHeader";

interface toolsItems {
  id: string;
  title: string;
  icon: string;
  color?: string;
  route: string;
}

const Home = ({ navigation }: any) => {
  const [searchText, setSearchText] = useState("");

  const filteredData = populerData.filter((item) =>
    item.title.toLowerCase().includes(searchText.trim().toLowerCase()),
  );
  const renderTools = ({ item }: { item: toolsItems }) => (
    // pressable component for each tool card in home screen, on pressing it navigates to the respective tool.

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
    <SafeAreaView edges={[]} className="flex-1 bg-gray-100">
      <AppHeader />
      {/* Signup/signin button pressing it open the auth modal and search input field in home screen header */}

      <View className="px-4 pt-1 flex-row justify-center items-center gap-2">
        {/* Search input field in home screen */}

        <SearchInput
          value={searchText}
          onChangeText={setSearchText}
          className="w-full"
        />

        {/* signin/signup button in home screen */}
      </View>

      {/* Home screen body with popular tools list using flatlist */}

      <View className="mx-3 my-3 mb-2 flex-1 rounded-3xl bg-white shadow-xl">
        <View className="mt-2">
          <Text className="text-xl font-bold px-4 mx-auto text-slate-500">
            Popular Tools
          </Text>
        </View>

        {/* Flatlist for popular tools in home screen */}

        <FlatList
          data={filteredData}
          renderItem={renderTools}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 12,
            marginBottom: 10,
          }}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 9 }}
          className="flex-1 shadow-lg shadow-blue-500"
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
