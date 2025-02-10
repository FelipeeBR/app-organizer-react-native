import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import CardDisciplina from "../../components/CardDisciplina";
import ItemsDisciplina from "../../components/ItemsDisciplina";


export default function Disciplina() {
  const [disciplinas, setDisciplinas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/disciplinas`, {
          headers: {
            Authorization: `Bearer ${String(token)}`,
          },
        });
        setDisciplinas(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDisciplinas();
  }, [disciplinas]);

  return (
    <View className="bg-gray-200">
      <ItemsDisciplina/>
      <ScrollView className="flex-1 p-4 min-h-[80vh] bg-gray-200" contentContainerStyle={{ paddingBottom: 50 }}>
        {disciplinas.map((disciplina: any) => (
          <CardDisciplina key={disciplina.id} disciplina={disciplina} />
        ))}
      </ScrollView>
    </View>
  );
}
