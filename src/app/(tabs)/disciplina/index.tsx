import React from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";


export default function Disciplina() {
  const router = useRouter();
  return (
    <View>
      <Text>Lista de Disciplinas</Text>
      <Button title="Acessar Detalhes" onPress={() => router.push("/disciplina/disciplinaTarefa")} />
    </View>
  );
}
