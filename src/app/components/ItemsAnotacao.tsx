import { TouchableOpacity, View, Text } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function ItemsAnotacao() {
    const router = useRouter();

    return (
        <View className="w-full flex bg-gray-200 items-end px-4 mb-5 mt-2">
            <View className="flex-row gap-2">
                <TouchableOpacity onPress={()=> router.push(`/anotacao/create`)} className="w-10 h-10 rounded-full border flex items-center justify-center border-white bg-slate-700">
                    <FontAwesome6 name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}