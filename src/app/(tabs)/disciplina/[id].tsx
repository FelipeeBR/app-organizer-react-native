import { useRouter } from "expo-router";
import { View, Text, Button, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import ItemsDisciplina from "../../components/ItemsDisciplina";
import CardTarefa from "../../components/Tarefa/CardTarefa";

export default function DisciplinaTarefa() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [listTarefas, setListTarefas] = useState([]);

  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const tokenData = await SecureStore.getItemAsync("authToken");
        if(!tokenData)return; 
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/tarefas`, {
          headers: {
            Authorization: `Bearer ${String(tokenData)}`,
            "Content-Type": "application/json",
          },
          params: { id: id },
        });
        setListTarefas(response.data);
      } catch(error: any) {
        console.error('Erro ao buscar tarefas:', error.response.data);
      }
    }
    fetchTarefas();
  }, [listTarefas]);

  return (
    <View className="bg-gray-200">
      <ItemsDisciplina/>
      <ScrollView className="flex-1 p-4 min-h-[80vh] bg-gray-200" contentContainerStyle={{ paddingBottom: 50 }}>
        {listTarefas.map((tarefa: any) => (
          <CardTarefa key={tarefa.id} tarefa={tarefa} />
        ))}
      </ScrollView>
    </View>
  );
}