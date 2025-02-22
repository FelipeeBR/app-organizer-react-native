import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import CardNotificacao from "../components/CardNotificacao";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import useNotificacaoStore from "../useNotificacaoStore";
import { set } from "date-fns";

export default function Notificacao() {
    const [notificacoes, setNotificacoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { removerNotificacao, adicionarNotificacao } = useNotificacaoStore();

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
                setNotificacoes([]);
                setLoading(false);
            }
        }
        fetchNotificacoes();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleUpdateNotificacao = (idAtualizado: number) => {
        setNotificacoes(prev => prev.filter(n => n.id !== idAtualizado));
        removerNotificacao(idAtualizado);
    };

    return (
        <View className="flex-1 bg-gray-200 h-full">
            <View>
                {loading ? (
                    <View className="flex-1 items-center justify-center p-4 min-h-[80vh]">
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : notificacoes && notificacoes.length > 0 ? (
                    <ScrollView className="flex-1 p-4 min-h-[80vh]" contentContainerStyle={{ paddingBottom: 50 }}>
                        {notificacoes.map((notificacao: any) => <CardNotificacao key={notificacao.id} info={notificacao} onUpdate={handleUpdateNotificacao} />)}
                    </ScrollView>
                ) : (
                    <View className="flex-1 items-center justify-center p-4 min-h-[80vh]">
                        <Text className="text-gray-500 text-lg">Nenhuma notificação encontrada</Text>
                    </View>
                )}
            </View>
        </View>
    );
}
