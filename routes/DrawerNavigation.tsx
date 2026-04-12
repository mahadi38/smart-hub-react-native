import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StackNavigation from "./StackNavigation";
import DrawerContent from "../src/components/DrawerContent";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: "left",
        drawerStyle:{
          marginTop: 35,
        }
      }}
       drawerContent={(props) => <DrawerContent {...props} />}
    >
<Drawer.Screen name="MainStack" component={StackNavigation} />
    </Drawer.Navigator>
    
  );
};

export default DrawerNavigation;