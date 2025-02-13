import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {jwtDecode, JwtPayload} from 'jwt-decode';

interface JwtEmail extends JwtPayload {
    email: string; 
}
export default function Perfil() {
    const [user, setUser] = useState<string | null>(null);
    const router = useRouter();
    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("authToken");
        router.replace("/login");
    };

    useEffect(() => {
        const getUser = async () => {
            const token = await SecureStore.getItemAsync("authToken");
            if (!token) return;
            const decodedToken = jwtDecode<JwtEmail>(token);
            setUser(decodedToken.email);  
        };
        getUser();
    }, []);

    return (
        <View className="flex-1 justify-center items-center bg-gray-100">
            <Text className="text-2xl font-bold mb-6">{user}</Text>
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