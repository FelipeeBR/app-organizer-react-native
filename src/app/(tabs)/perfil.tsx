import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Perfil() {
    const [name, setName] = useState();
    const router = useRouter();
    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("authToken");
        router.replace("/login");
    };

    useEffect(() => {
        const getName = async () => {
            const token = await SecureStore.getItemAsync("authToken");
            if(!token) return;
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setName(data);
        }
        getName();
    }, [name]);

    return (
        <View className="flex-1 justify-center items-center bg-gray-100">
            <Text className="text-2xl font-bold mb-6">{name}</Text>
            <TouchableOpacity
                className="flex-row bg-red-500 p-3 rounded"
                onPress={handleLogout}
            >
                <FontAwesome name="sign-out" size={24} color="white" />
                <Text className="text-white font-bold">Sair</Text>
            </TouchableOpacity>
        </View>
    );
}