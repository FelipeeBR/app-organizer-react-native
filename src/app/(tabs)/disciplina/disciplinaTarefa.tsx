import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";

export default function DisciplinaTarefa() {
  const router = useRouter();

  return (
    <View>
      <Text>Detalhes da Disciplina</Text>
      <Button title="Voltar" onPress={() => router.back()} />
    </View>
  );
}