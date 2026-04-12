import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AppHeader = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between bg-white shadow-sm px-3 py-2 pt-5 mb-2 round-lg"
      style={{ paddingTop: insets.top + 10 }}
    >
      <View className="flex-1 px-4 flex-row justify-between items-center">
        <View className="items-center justify-center">
          <Image
            source={require("../../assets/tools-hub-Logo.webp")}
            className="w-10 h-10"
          />
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.getParent()?.dispatch(DrawerActions.openDrawer())
          }
        >
          <AntDesign name="menu-unfold" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <View />
    </View>
  );
};

export default AppHeader;
