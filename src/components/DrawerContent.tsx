import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { allToolsData } from "../constant/AllFeatureData";
import AntDesign from "@expo/vector-icons/AntDesign";
import { WebView } from 'react-native-webview';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const DrawerContent = (props: any) => {
  const insets = useSafeAreaInsets();
  const navigation = props.navigation;

  return (
    // Custom Drawer content component which is used in Drawer Navigation
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: insets.top + 20 }}
    >

      <View className="flex-row items-center justify-between pr-2 border-b mb-5 border-blue-300">
      <View className="ml-4 flex-row gap-[1px] pb-4 font-sans items-center">
        <Image
          source={require("../../assets/smart-tools-hub-logo.png")}
          className="w-10 h-10"
        />
        <Text className="text-lg font-extrabold text-blue-500">
          Smart Tools Hub
        </Text>
        
      </View>
       <TouchableOpacity className="mb-4" onPress={() => navigation.closeDrawer()}>
            <AntDesign name="close" size={25} color="#EF4444" />
          </TouchableOpacity>
      </View>

      {allToolsData.map((tool) => (
        <TouchableOpacity
          key={tool.id}
          onPress={() => {
            const toolParams = {
              toolTitle: tool.title,
              toolIcon: tool.icon,
              toolColor: tool.color,
              bgClassName: tool.bgClassName,
            };

            const rootNavigation = navigation.getParent();
            if (rootNavigation) {
              rootNavigation.navigate(tool.route, toolParams);
            } else {
              navigation.navigate("MainTabs", {
                screen: "AllTools",
                params: toolParams,
              });
            }
            navigation.closeDrawer();
          }}
        >
          <View className="flex-row justify-start pl-6 rounded-xl py-3 mb-2 p-2 bg-gray-50/50 border border-gray-200 ">
            <MaterialIcons name={tool.icon as any} size={24} color={tool.color} />
            <Text className="text-lg text-gray-600 ml-3">{tool.title}</Text>
            
          </View>
        </TouchableOpacity>
      ))}

      <View className="my-9 px-7 gap-4">
           <TouchableOpacity
        onPress={() => navigation.navigate('TermsWebView')}
        >
         
          <View className="flex-row justify-between">
            <Text className="text-gray-800">
              Trams and Condition
            </Text> 
            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />          
          </View>
        </TouchableOpacity>

           <TouchableOpacity
        onPress={()=>navigation.navigate("ContactWebview")}
        >
          <View className="flex-row justify-between">
            <Text className="text-gray-800">
              Contact Us
            </Text> 
            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />            
          </View>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
