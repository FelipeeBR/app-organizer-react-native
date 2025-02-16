import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import CardAnotacao from '../../components/CardAnotacao';
import ItemsAnotacao from '../../components/ItemsAnotacao';

export default function Anotacao() {
  const [anotacoes, setAnotacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnotacoes = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/anotacoes`, {
          headers: {
            Authorization: `Bearer ${String(token)}`,
          },
        });
        setAnotacoes(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        return;
      }
    };
    fetchAnotacoes();
  }, [anotacoes]);

  return (
    <View className="bg-gray-200">
      <ItemsAnotacao/>
      <ScrollView className="flex-1 p-4 min-h-[80vh] bg-gray-200" contentContainerStyle={{ paddingBottom: 50 }}>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : anotacoes && anotacoes.length > 0 ? (
        anotacoes.map((anotacao: any) => <CardAnotacao key={anotacao.id} info={anotacao} />)
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">Nenhuma anotação encontrada</Text> 
        </View>
      )}
      </ScrollView>
    </View>
  );
}

