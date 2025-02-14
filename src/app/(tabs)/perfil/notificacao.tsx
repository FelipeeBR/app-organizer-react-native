import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { getNotificacoes } from "../../notificacao";
import CardNotificacao from "../../components/CardNotificacao";

export default function Notificacao() {
    const router = useRouter();
    const [notificacoes, setNotificacoes] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const data = await getNotificacoes();
                if(isMounted) {
                    setNotificacoes(data);
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
            <View className="flex items-start">
                <View className="mt-4 flex gap-2">
                    <TouchableOpacity className="flex items-center justify-center bg-gray-100 px-4 py-2 rounded-lg" onPress={() => router.push("/perfil")}>
                        <Text className="text-black font-bold">Voltar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView className="flex-1 p-4 min-h-[80vh] bg-gray-200" contentContainerStyle={{ paddingBottom: 50 }}>
                {notificacoes.map((notificacao: any) => (
                    <CardNotificacao key={notificacao.id} info={notificacao} />
                ))}
            </ScrollView>
        </View>
    );
}
