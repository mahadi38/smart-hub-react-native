import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ToolsIcons from "../components/shared/ToolsIcons";
import { allToolsData } from "../constant/AllFeatureData";
import SearchInput from "../components/shared/SearchInput";
import AppHeader from "../AppHeader";

interface toolsItems {
  id: string;
  title: string;
  icon: string;
  color?: string;
  route: string;
}

const AllTools = ({ navigation }: any) => {
  const [query, setQuery] = useState("");

  const filteredTools = allToolsData.filter((item) =>
    item.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

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
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-gray-100">
      <AppHeader />
      <View className="px-4 pt-1 shadow-lg shadow-blue-500">
        {/* Search input component*/}

        <SearchInput value={query} onChangeText={setQuery} className="mb-1" />
      </View>

      <View className="mx-3 mt-2 mb-2 flex-1 rounded-3xl bg-white shadow-xl">
        {/* All tools Tools list header */}

        <View className="mt-2">
          <Text className="text-xl font-bold px-4 mx-auto text-slate-500">
            All Tools
          </Text>
        </View>

        {/* Flatlist For Alltools icon */}

        <FlatList
          data={filteredTools}
          renderItem={renderTools}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 10,
          }}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 9 }}
          className="flex-1 shadow-lg"
        />
      </View>
    </SafeAreaView>
  );
};

export default AllTools;
