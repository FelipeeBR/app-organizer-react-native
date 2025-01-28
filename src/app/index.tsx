import { View } from "react-native";
import { useState } from "react";
import Login from "@/src/app/login";

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);

  function viewSenha(){
    setShowPassword(!showPassword);
  }
  return (
    <View className="flex-1 items-center justify-center">
      <Login/>
    </View>
  );
}
