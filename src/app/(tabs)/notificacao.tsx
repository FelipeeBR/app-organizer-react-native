import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import { getNotificacoes } from "../notificacao";
import CardNotificacao from "../components/CardNotificacao";

export default function Notificacao() {
    const [notificacoes, setNotificacoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const data = await getNotificacoes();
                if(isMounted) {
                    setNotificacoes(data);
                    setLoading(false);
                }
            } catch (error) {
            }
        };
        fetchData();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <View className="flex bg-gray-100">
            <ScrollView className="flex-1 p-4 min-h-[80vh] bg-gray-200" contentContainerStyle={{ paddingBottom: 50 }}>
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : notificacoes && notificacoes.length > 0 ? (
                    notificacoes.map((notificacao: any) => <CardNotificacao key={notificacao.id} info={notificacao} />)
                ) : (
                    <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="small" color="#ff0000" /> 
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
