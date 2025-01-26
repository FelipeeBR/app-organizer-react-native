import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yup  from 'yup';

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, setValue, formState: { errors },} = useForm();

  function viewSenha(){
    setShowPassword(!showPassword);
  }

  useEffect(() => {
    register('email');
    register('senha');
  },[register]);

  const onSubmit = (data: any) => Alert.alert(data.email, data.senha);

  return (
    <View className="flex-1 items-center justify-center m-5">
      <View>
        <Text className="text-3xl font-bold">Login</Text>
      </View>
      <View className="flex-1 justify-center m-5">
        <View className="gap-3">
          <View className="flex flex-row w-full items-center justify-between px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
            <TextInput
              className="w-full"
              placeholder="Email"
              placeholderTextColor="gray"
              onChangeText={text => setValue('email', text)}
            />
          </View>
          
          <View className="flex flex-row w-full items-center justify-between px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
            <TextInput
              className="w-full"
              placeholder="Senha"

              placeholderTextColor="gray"
              secureTextEntry={showPassword ? false : true}
              onChangeText={text => setValue('senha', text)}
            />
            <TouchableOpacity onPress={viewSenha}>
              <Text>
                {showPassword ? <FontAwesome name="eye-slash" size={20} color="gray"/> : <FontAwesome name="eye" size={20} color="gray"/>}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View className="mt-5 tracking-wide font-semibold bg-blue-500 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center">
            <TouchableOpacity className="flex w-full items-center" onPress={handleSubmit(onSubmit)}>
              <Text className="text-lg text-gray-100">Entrar</Text>
            </TouchableOpacity>
          </View>

          <View className='flex items-center justify-center mt-3'>
            <Text>Não possui uma conta? <Link href={'/pages/register/register'} className='text-blue-500 underline'>Cadastre-se</Link></Text>
          </View>
        </View>
      </View>
    </View>
  );
}
