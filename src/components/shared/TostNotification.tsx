import React, { useEffect } from "react";
import { View, Text } from "react-native";

interface TostNotificationProps {
  visible: boolean;
  message: string;
  onHide?: () => void;
  duration?: number;
  className?: string;
}

const TostNotification = ({
  visible,
  message,
  onHide,
  duration = 3000,
  className = "",
}: TostNotificationProps) => {
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      onHide?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, onHide]);

  if (!visible) return null;

  return (
    <View
      className={`absolute top-28 left-0 right-0 items-center z-50 px-4 ${className}`}
    >
      <View className="rounded-full bg-blue-500 px-4 py-2 shadow-lg">
        <Text className="text-white text-md font-semibold">{message}</Text>
      </View>
    </View>
  );
};

export default TostNotification;
