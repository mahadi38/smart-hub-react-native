import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import DrawerNavigation from "./routes/DrawerNavigation";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <NavigationContainer>
        <DrawerNavigation />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
