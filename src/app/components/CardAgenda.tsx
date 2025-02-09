import React from "react";
import { View, Text } from "react-native";

export default function CardAgenda({ info }: any) {
    const { id, description, date } = info;
    return (
        <View className="bg-white rounded-lg shadow-md flex flex-col justify-between relative p-4 mb-2">
            <Text className="text-lg font-bold">{description}</Text>
            <Text className="text-sm text-gray-500">{date}</Text>
        </View>
    );
}