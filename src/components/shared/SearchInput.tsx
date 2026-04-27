import { View,TextInput } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
type Props = {
  value: string;
  onChangeText: (text: string) => void;
  className?: string;
};


const SearchInput = ({ value, onChangeText, className }: Props) => {
  return (
    <View className={`relative  rounded-full ${className}`}>
          <TextInput
          value={value}
          onChangeText={onChangeText}
            placeholder="Search tools..."
            className="bg-white text-gray-600 rounded-full px-4 py-3 pr-12 text-base border border-blue-300 shadow-lg shadow-blue-600"
            placeholderTextColor="#9CA3AF"
          />

          {/* Search icon inside search input field*/}

          <View className="absolute right-4 top-1/2 -translate-y-1/2">
            
            <FontAwesome name="search" size={18} color="#3B82F6" />
          </View>
        </View>
  )
}

export default SearchInput