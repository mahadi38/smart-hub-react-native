import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAuth = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isSignIn && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    Alert.alert("Success", `${isSignIn ? "Sign In" : "Sign Up"} successful!`);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        <View className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-800">
              {isSignIn ? "Sign In" : "Sign Up"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Email</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <AntDesign name="mail" size={18} color="#9CA3AF" />
              <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="#D1D5DB"
                className="flex-1 ml-3 text-gray-800"
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <AntDesign name="lock" size={18} color="#9CA3AF" />
              <TextInput
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#D1D5DB"
                className="flex-1 ml-3 text-gray-800"
              />
            </View>
          </View>

          {/* Confirm Password Input (Sign Up Only) */}
          {!isSignIn && (
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">
                Confirm Password
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
                <AntDesign name="lock" size={18} color="#9CA3AF" />
                <TextInput
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholderTextColor="#D1D5DB"
                  className="flex-1 ml-3 text-gray-800"
                />
              </View>
            </View>
          )}

          {/* Auth Button */}
          <TouchableOpacity
            onPress={handleAuth}
            className="bg-blue-500 rounded-lg py-3 mb-4"
          >
            <Text className="text-white font-bold text-center text-lg">
              {isSignIn ? "Sign In" : "Sign Up"}
            </Text>
          </TouchableOpacity>

          {/* Toggle Sign In/Sign Up */}
          <View className="flex-row justify-center items-center gap-2">
            <Text className="text-gray-600">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <TouchableOpacity onPress={() => setIsSignIn(!isSignIn)}>
              <Text className="text-blue-500 font-bold">
                {isSignIn ? "Sign Up" : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AuthModal;
