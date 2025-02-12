import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView
} from 'react-native';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import CardAnotacao from '../../components/CardAnotacao';
import ItemsAnotacao from '../../components/ItemsAnotacao';

export default function Anotacao() {
  const [anotacoes, setAnotacoes] = useState([]);

  useEffect(() => {
    const fetchAnotacoes = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/anotacoes`, {
          headers: {
            Authorization: `Bearer ${String(token)}`,
          },
        });
        setAnotacoes(response.data);
      } catch (error) {
        console.error('Erro ao buscar anotações:', error);
      }
    };
    fetchAnotacoes();
  }, [anotacoes]);

  return (
    <View className="bg-gray-200">
      <ItemsAnotacao/>
      <ScrollView className="flex-1 p-4 min-h-[80vh] bg-gray-200" contentContainerStyle={{ paddingBottom: 50 }}>
        {anotacoes.map((anotacao: any) => (
          <CardAnotacao key={anotacao.id} info={anotacao} />
        ))}
      </ScrollView>
    </View>
  );
}

