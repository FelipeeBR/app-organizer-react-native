import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as Notifications from 'expo-notifications';
import { getNotificacoes } from "../../notificacao";
import CardNotificacao from "../../components/CardNotificacao";

async function scheduleLocalNotification(descricao: any, triggerSeconds: any) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Nova Notificação",
            body: descricao,
        },
        trigger: {
            seconds: triggerSeconds,
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
    });
}

/*function calculateTriggerSeconds(dataEnvio: any) {
    const dataNotificacao = new Date(dataEnvio); 
    const dataAtual = new Date(); 
    const diferencaSegundos = Math.floor((dataNotificacao - dataAtual) / 1000);
    return diferencaSegundos > 0 ? diferencaSegundos : 1;
}*/

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
                    console.log(data);
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
