import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {jwtDecode, JwtPayload} from 'jwt-decode';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});




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

    async function handleNotification() {
        const { status } = await Notifications.requestPermissionsAsync();
    
        if (status !== 'granted') {
            Alert.alert('Notificações', 'Permissão para notificações não concedida.');
            return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    }

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

            <TouchableOpacity className="flex-row bg-blue-500 p-3 rounded mt-3" onPress={handleNotification}>
                <Text>Notificacoes</Text>
            </TouchableOpacity>
        </View>
    );
}