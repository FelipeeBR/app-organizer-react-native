import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import CardNotificacao from "../components/CardNotificacao";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function Notificacao() {
    const [notificacoes, setNotificacoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchNotificacoes = async () => {
            try {
                const token = await SecureStore.getItemAsync("authToken");
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/notificacoes`, {
                    headers: {
                        Authorization: `Bearer ${String(token)}`,
                    },
                });
                if(isMounted) {
                    setNotificacoes(response.data);
                    setLoading(false);
                }
                return response.data;
            } catch (error) {
            }
        }
        fetchNotificacoes();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleUpdateNotificacao = (idAtualizado: number) => {
        setNotificacoes(prev => prev.filter(n => n.id !== idAtualizado));
    };

    return (
        <View className="flex bg-gray-100 h-full">
            <ScrollView className="flex-1 p-4 min-h-[80vh] bg-gray-200" contentContainerStyle={{ paddingBottom: 50 }}>
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : notificacoes && notificacoes.length > 0 ? (
                    notificacoes.map((notificacao: any) => <CardNotificacao key={notificacao.id} info={notificacao} onUpdate={handleUpdateNotificacao} />)
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500 text-lg">Nenhuma notificação encontrada</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
