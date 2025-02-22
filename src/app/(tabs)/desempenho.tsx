import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { format } from "date-fns";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function Desempenho() {
    const [valores, setValores] = React.useState({
        aproveitamento: null,
        recomendacao: null,
        tarefasCompletadasCount: 0,
        tarefasPendentesCount: 0,
        tarefasConcluidasRecentemente: 0,
        tarefasPendentes: [],
    });
    const [ver, setVer] = React.useState(false);

    const handleDesempenho = async () => {
        try {
            const token = await SecureStore.getItemAsync("authToken");
            if(!token) return;
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/desempenho`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setValores(response.data);
            setVer(true);
            return response.data; 
        } catch (error) {
            console.error("Erro ao buscar desempenho:", error);
            return null;
        }
    };
    return (
        <View className="bg-gray-200 h-full">
            <View className="flex flex-col items-center text-center mb-6">
                <Text className="text-xl font-bold text-gray-900 p-3">Veja como está seu desempenho</Text>
            </View>

            <View className="flex justify-center mb-6 mx-5">
                <TouchableOpacity onPress={handleDesempenho} className="flex-row bg-blue-600 text-white font-semibold p-3 items-center justify-center rounded-lg">
                    <FontAwesome5 name="chart-line" size={24} color="white" />
                    <Text className="flex text-white">Mostrar meu desempenho</Text>
                </TouchableOpacity>
            </View>
            {valores.aproveitamento !== null && (
                <ScrollView className="bg-white rounded-xl shadow-lg p-6 space-y-6" contentContainerStyle={{ paddingBottom: 50 }}>
                    <View className="flex-row items-center space-x-4 border-b p-4">
                        <FontAwesome5 name="chart-line" size={24} color="#1f2937" />
                        <View className="flex-row items-center">
                            <Text className="text-xl font-semibold text-gray-800">
                                Aproveitamento: <Text className="text-blue-600">{valores.aproveitamento}%</Text>
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center space-x-4 border-b p-4">
                        <FontAwesome5 name="marker" size={24} color="#1f2937" />
                        <View className="flex-row items-center">
                            <Text className="text-xl font-semibold text-gray-800">
                                Tarefas Pendentes: <Text className="text-red-500">{valores.tarefasPendentesCount}</Text>
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center space-x-4 border-b p-4">
                        <FontAwesome5 name="check-square" size={24} color="#1f2937" />
                        <View className="flex-row items-center">
                            <Text className="text-xl font-semibold text-gray-800">
                                Tarefas Finalizadas: <Text className="text-green-500">{valores.tarefasCompletadasCount}</Text>
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center space-x-4 border-b p-4">
                        <FontAwesome5 name="check-square" size={24} color="#1f2937" />
                        <View className="flex-row items-center">
                            <Text className="text-xl font-semibold text-gray-800">
                                Tarefas concluídas nos últimos 7 dias: <Text className="text-green-500">{valores.tarefasConcluidasRecentemente}</Text>
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center space-x-4 border-b p-4">
                        <FontAwesome5 name="hand-point-right" size={24} color="#1f2937" />
                        <Text className="text-xl font-semibold text-gray-800">
                            Recomendação: {valores.recomendacao || "Nenhuma recomendação disponível"}
                        </Text>
                    </View>

                    <View className="border-t pt-4">
                        <View className="flex-row items-center space-x-4 p-4">
                            <FontAwesome5 name="exclamation-triangle" size={24} color="#ca8a04" />
                            <Text className="text-xl font-semibold text-gray-800">Tarefas Prioritárias:</Text>
                        </View>
                        {valores.tarefasPendentes.length > 0 ? (
                            <View className="mt-4 space-y-4">
                                {valores.tarefasPendentes.map((tarefa: any) => (
                                    <View key={tarefa.id} className="flex justify-between items-center bg-gray-50 border border-slate-300 rounded-lg p-4 shadow truncate mb-2">
                                        <Text className="text-lg font-semibold text-gray-800 truncate">{tarefa.title}</Text>
                                        <Text className="text-sm text-gray-600 font-bold">Até: {format(new Date(tarefa.date), 'dd/MM/yyyy')}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text className="text-gray-600 mt-2 text-center">Nenhuma tarefa prioritária no momento.</Text>
                        )}
                    </View>
                </ScrollView>
            )}

            {valores.aproveitamento === null && ver && (
                <View className="flex-row bg-white rounded-xl shadow-lg p-6 text-center m-3">
                    <FontAwesome5 name="exclamation-triangle" size={24} color="#ca8a04" />
                    <Text className="text-lg font-semibold text-gray-800 text-center">Não foi possível calcular o desempenho</Text>
                </View>
            )}
        </View>
    );
}