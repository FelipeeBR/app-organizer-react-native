import { TouchableOpacity, View, Text } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { fetchNotificacoes, getNotificacoes } from "../notificacao";
import { useEffect, useState } from "react";

export default function ItemsAnotacao() {
    const [notificacoes, setNotificacoes] = useState([]);
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;
    
        const fetchData = async () => {
            try {
                await fetchNotificacoes();
                const data = await getNotificacoes();
    
                if (isMounted) {
                    setNotificacoes(data);
                }
            } catch (error) {
                console.error("Erro ao carregar notificações:", error);
            }
        };
    
        fetchData();
    
        const interval = setInterval(() => {
            fetchData();
        }, 15000);      // 15 Segundos
    
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    return (
        <View className="w-full flex bg-gray-200 items-end px-4 mb-5 mt-2">
            <View className="flex-row gap-2">
                <TouchableOpacity className="w-10 h-10 flex items-center justify-center">
                    <FontAwesome5 name="bell" size={24} color="#334155" />
                    {notificacoes.length > 0 && (
                        <View className="w-5 h-5 rounded-full bg-red-500 absolute top-0 right-0 items-center justify-center">
                            <Text className="text-white text-xs">{notificacoes.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> router.push(`/anotacao/create`)} className="w-10 h-10 rounded-full border flex items-center justify-center border-white bg-slate-700">
                    <FontAwesome6 name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}