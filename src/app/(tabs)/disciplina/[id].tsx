import { useRouter } from "expo-router";
import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import CardTarefa from "../../components/Tarefa/CardTarefa";
import ItemsTarefa from "../../components/ItemsTarefa";

export default function DisciplinaTarefa() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [listTarefas, setListTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTarefas = async () => {
    try {
      const tokenData = await SecureStore.getItemAsync("authToken");
      if(!tokenData)return; 
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/tarefas`, {
        headers: {
          Authorization: `Bearer ${String(tokenData)}`,
          "Content-Type": "application/json",
        },
        params: { id: id },
      });
      setListTarefas(response.data);
      setLoading(false);
    } catch(error: any) {
      setListTarefas([]);
      setLoading(false);
      return;
    }
  }

  useEffect(() => {
    fetchTarefas();
  }, [listTarefas]);

  return (
    <View className="bg-gray-200">
      <ItemsTarefa atualizarTarefas={fetchTarefas} />
      <ScrollView className="flex-1 p-4 min-h-[80vh] bg-gray-200" contentContainerStyle={{ paddingBottom: 50 }}>
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : listTarefas && listTarefas.length > 0 ? (
          listTarefas.map((tarefa: any) => <CardTarefa key={tarefa.id} tarefa={tarefa} />)
        ) : (
          <View className="flex-1 items-center justify-center p-4 min-h-[80vh]">
            <Text className="text-gray-500 text-lg">Nenhuma tarefa encontrada</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}