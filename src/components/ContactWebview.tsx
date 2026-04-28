import { View, Text } from 'react-native'
import React from 'react'
import { WebView } from "react-native-webview";

const ContactWebview = () => {
  return (
    <View className="pt-2" style={{ flex: 1 }}>
      <WebView
        source={{ uri:"https://www.smartsoftware.com.bd/contact-us" }}
      />
    </View>
  
  )
}

export default ContactWebview