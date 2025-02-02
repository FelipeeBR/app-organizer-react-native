import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";


export default function Tarefa({ task }: any) {
  return (
    <View className="w-full bg-white rounded-lg shadow-md flex flex-col justify-between border border-slate-300 p-4 mb-2">
      <Text className="font-medium">{task.title}</Text>
      <View className="flex items-center gap-2">
        <Text className="ml-2">Até o dia 15/05/2025</Text>
      </View>
      <View className="mt-4 flex-row gap-2">
        <TouchableOpacity className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all focus:ring focus:ring-blue-200">
          <FontAwesome5 name="edit" size={16} color="white"/>
        </TouchableOpacity>

        <TouchableOpacity className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all focus:ring focus:ring-red-200">
          <FontAwesome5 name="trash" size={16} color="white"/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

