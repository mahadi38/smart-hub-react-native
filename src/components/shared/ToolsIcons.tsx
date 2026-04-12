import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "@expo/vector-icons/AntDesign";

interface ToolsIconsProps {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  color?: string;
}
const ToolsIcons = ({ id, title, icon, onPress, color }: ToolsIconsProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.86}
      style={{ width: "31%" }}
      className="h-36 items-center justify-center px-3 py-4 mb-2 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-blue-700"
    >
      <View className="h-14 w-14 items-center justify-center rounded-full bg-blue-50 border border-blue-100">
        <Icon
          name={icon as any}
          size={26}
          color={color ?? "rgba(0, 122, 255, 1)"}
        />
      </View>
      <View className="mt-3 h-10 justify-center">
        <Text
          numberOfLines={2}
          className="text-center text-xs font-semibold text-gray-700"
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ToolsIcons;
