import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Perfil() {
    const router = useRouter();
    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("authToken");
        router.replace("/login");
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-100">
            <Text className="text-2xl font-bold mb-6">Nome do Usuário</Text>
            <TouchableOpacity
                className="bg-red-500 p-3 rounded"
                onPress={handleLogout}
            >
                <Text className="text-white font-bold">Sair</Text>
            </TouchableOpacity>
        </View>
    );
}