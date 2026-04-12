import React from "react";
import { View, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AppHeader = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between bg-white shadow-sm px-4 pb-5"
      style={{ paddingTop: insets.top + 12 }}
    >
      <TouchableOpacity onPress={() => navigation.toggleDrawer?.()}>
        <AntDesign name="menu-unfold" size={24} color="#111827" />
      </TouchableOpacity>

      <View className="items-center justify-center"></View>

      <View style={{ width: 24 }} />
    </View>
  );
};

export default AppHeader;
