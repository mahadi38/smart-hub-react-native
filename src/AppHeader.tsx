import React from "react";
import { View, TouchableOpacity, Image, Text} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AppHeader = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between bg-white border-b border-blue-200 shadow-lg shadow-blue-500 px-3 py-2 pt-5 mb-2 round-lg"
      style={{ paddingTop: insets.top + 10 }}
    >
      <View className="flex-1 px-4 py-1 flex-row gap-1 items-center">

        <TouchableOpacity
        className=""
          onPress={() =>
            navigation.getParent()?.dispatch(DrawerActions.openDrawer())
          }
        >
          <AntDesign name="menu-unfold" size={28} color="#111827" />
        </TouchableOpacity>

        {/* Home and logo in AppHeader */}

        <View className="flex-row gap-[1px] font-sans items-center justify-center">         
          <Image
            source={require("../assets/smart-tools-hub-logo.png")}
            className="w-10 h-10"
          />
          <Text className="text-lg font-extrabold text-blue-500">
            Smart Tools Hub
          </Text>        
        </View>

        {/* App Drawer button in App Header */}

        
      </View>

      <View />
    </View>
  );
};

export default AppHeader;
