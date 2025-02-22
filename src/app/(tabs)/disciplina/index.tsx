import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import CardDisciplina from "../../components/CardDisciplina";
import ItemsDisciplina from "../../components/ItemsDisciplina";
import { set } from "date-fns";


export default function Disciplina() {
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/disciplinas`, {
          headers: {
            Authorization: `Bearer ${String(token)}`,
          },
        });
        setDisciplinas(response.data);
        setLoading(false);
      } catch (error) {
        setDisciplinas([]);
        setLoading(false);
        return;
      }
    }
    fetchDisciplinas();
  }, [disciplinas]);

  return (
    <View className="bg-gray-200">
      <ItemsDisciplina/>
      <ScrollView className="flex-1 p-4 min-h-[80vh] bg-gray-200" contentContainerStyle={{ paddingBottom: 50 }}>
        {loading ? (
          <View className="flex-1 items-center justify-center p-4 min-h-[80vh]">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : disciplinas && disciplinas.length > 0 ? (
          disciplinas.map((disciplina: any) => <CardDisciplina key={disciplina.id} disciplina={disciplina} />)
        ) : (
          <View className="flex-1 items-center justify-center p-4 min-h-[80vh]">
            <Text className="text-gray-500 text-lg">Nenhuma disciplina encontrada</Text> 
          </View>
        )}
      </ScrollView>
    </View>
  );
}
