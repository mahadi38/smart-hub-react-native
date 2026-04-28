import { View, Text } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";

const TermsWebView = () => {
  return (
    <View className="pt-1" style={{ flex: 1 }}>
      <WebView
        source={{ uri: "https://www.smartsoftware.com.bd/app-using-terms" }}
      />
    </View>
  );
};

export default TermsWebView;
