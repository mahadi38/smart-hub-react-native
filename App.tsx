import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import StackNavigation from "./routes/StackNavigation";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <StackNavigation />
    </SafeAreaProvider>
  );
}
