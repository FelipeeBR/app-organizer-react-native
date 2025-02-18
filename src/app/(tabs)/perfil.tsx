import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Notifications from 'expo-notifications';
import axios from "axios";
import { set } from "date-fns";

interface User {
    name: string;
    email: string; 
    expoPushToken: string | null;
}
export default function Perfil() {
    const [user, setUser] = useState<User>({ name: "", email: "", expoPushToken: null });
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("authToken");
        router.replace("/login");
    };

    useEffect(() => {
        let isMounted = true;
        const getUser = async () => {
            try {
                const token = await SecureStore.getItemAsync("authToken");
                if(!token) return;
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/users/usuario`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if(isMounted) {
                    setUser(response.data);
                    setLoading(false);
                } 
                return response.data;
            } catch (error) {  
                console.log(error);
            }
            
        };
        getUser();
        return () => {
            isMounted = false;
        };
    }, []);

    async function handleNotification() {
        if(!user.expoPushToken) {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Notificações', 'Permissão para notificações não concedida.');
                return;
            }
            const pushToken = (await Notifications.getExpoPushTokenAsync()).data;
            try {
                const token = await SecureStore.getItemAsync("authToken");
                if(!token) return;
                const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/salvar-token`, 
                    { expoToken: pushToken, token: String(token) }, 
                    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
                );                
                setUser({...user, expoPushToken: pushToken});
                return response.data;
            } catch (error) {
            }
        } else{
            try {
                const token = await SecureStore.getItemAsync("authToken");
                if (!token) return;
    
                const response = await axios.put(
                    `${process.env.EXPO_PUBLIC_API_URL}/remover-token`,
                    { token: String(token) },
                    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
                );
    
                setUser(prevUser => ({ ...prevUser, expoPushToken: null }));
                return response.data;
            } catch (error) {
            }
        }
    }

    return (
        <View className="flex-1 justify-center items-center bg-gray-100">
            <Text className="text-2xl font-bold mb-6">{user.name}</Text>
            <View className="flex-row items-center gap-2">
                {!loading ? (
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity className="flex-row bg-blue-500 p-3 rounded" onPress={handleNotification}>
                            {user.expoPushToken ? (
                                <View className="flex-row items-center gap-2">
                                    <FontAwesome name="bell" size={24} color="white" />
                                    <Text className="text-white">Desativar Notificações</Text>
                                </View>
                            ) : (
                                <View className="flex-row items-center gap-2">
                                    <FontAwesome name="bell-o" size={24} color="white" />
                                    <Text className="text-white">Ativar Notificações</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-row bg-red-500 p-3 rounded"
                            onPress={handleLogout}
                        >
                            <FontAwesome name="sign-out" size={24} color="white" />
                            <Text className="text-white font-bold">Sair</Text>
                        </TouchableOpacity>
                    </View>
                ): (
                    <ActivityIndicator size="large" color="blue" />
                )}
                
            </View>
        </View>
    );
}