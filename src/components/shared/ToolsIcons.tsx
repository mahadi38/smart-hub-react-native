import { View, Text, TouchableOpacity } from "react-native";

import React from "react";

import Icon from "@expo/vector-icons/MaterialIcons";

interface ToolsIconsProps {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  color?: string;
  bgClassName?: string;
}
const ToolsIcons = ({
  id,
  title,
  icon,
  onPress,
  color,
  bgClassName,
}: ToolsIconsProps) => {
  return (
    // Tools card icon component used in Home and All tools screen

    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.86}
      style={{ width: "31%" }}
      className="h-36 items-center justify-center px-3 py-4 mb-1 rounded-2xl bg-white border border-blue-200 shadow-md shadow-blue-400"
    >
      {/* Dynamic icon rendering based on the icon name passed as a prop from ant design icons library */}

      <View
        className={`h-20 w-20 mt-2 items-center justify-center rounded-full border border-blue-200 ${bgClassName ?? ""}`}
         
      >
        <Icon
          name={icon as any}
          size={40}
          color={color ?? "rgba(0, 122, 255, 1)"}
        />
      </View>

      {/* Card bottom title */}

      <View className="h-10 justify-center">
        <Text
          numberOfLines={2}
          className="text-center text-[12px] font-bold text-gray-700"
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ToolsIcons;
