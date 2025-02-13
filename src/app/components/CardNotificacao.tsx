import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function CardNotificacao({ info }: any) {
    const { id, descricao } = info;
    return (
        <View className="bg-white rounded-lg shadow-md flex flex-col justify-between relative p-4 mb-2">
            <View className="flex-row justify-between truncate">
                <View className="truncate">
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 200, fontSize: 16 }}>{descricao}</Text>
                </View>

                <View>
                    <TouchableOpacity className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg">
                        <FontAwesome5 name="check" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}