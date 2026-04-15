import { View, Text, TextInput } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';


const SearchInput = ({ className = "" }: any) => {
  return (
    <View className={`relative shadow-lg  shadow-blue-500 rounded-full ${className}`}>
          <TextInput
            placeholder="Search tools..."
            className="bg-white text-gray-600 rounded-full px-4 py-3 pr-12 text-base shadow-sm border border-gray-200"
            placeholderTextColor="#9CA3AF"
          />

          {/* Search icon inside search input field*/}

          <View className="absolute right-4 top-1/2 -translate-y-1/2">
            
            <FontAwesome name="search" size={18} color="#6B7280" />
          </View>
        </View>
  )
}

export default SearchInput