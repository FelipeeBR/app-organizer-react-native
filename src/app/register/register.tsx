import { Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Link, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from "axios";

const inputValidation = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  password: yup.string().required('Senha não pode ficar em branco').min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: yup.string().required('Confirme sua senha').test('passwords-match', 'Senhas precisam ser idênticas', function(value) {
    const { password } = this.parent;
    return password === value;
  }),
  name: yup.string().required('Nome é obrigatório'),
});

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, setValue, formState: { errors },} = useForm({
        resolver: yupResolver(inputValidation)});

    function viewSenha(){
        setShowPassword(!showPassword);
    }
    function viewConfirmSenha(){
        setShowConfirmPassword(!showConfirmPassword);
    }

    useEffect(() => {
        register('email');
        register('password');
        register('confirmPassword');
        register('name');
      },[register]);

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            const response = await axios.post(
              `${process.env.EXPO_PUBLIC_API_URL}/users/register`, data);
      
            if(response.status === 201) {
                router.replace("/login"); 
            } else {
                setLoading(false);
            }
          }catch(error: any) {
            Alert.alert("Erro", error.response.data.error);
            setLoading(false);
          }
    }

    return (
        <View className="flex-1 items-center justify-center m-5">
            <View className='flex flex-col items-center justify-center p-5'>
                <View>
                    <Text className='text-3xl font-extrabold'>Organizer</Text>
                </View>
                <View>
                    <Text className="text-base">Controle Universitário</Text>
                </View>
            </View>
            <View>
                <Text className="text-2xl font-bold">Cadastre-se</Text>
            </View>
            <View className="flex-1 justify-center m-5">
                <View className="gap-3">
                    <View className="flex flex-row w-full items-center justify-between px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                        <TextInput
                        className="w-full"
                        placeholder="Nome"
                        placeholderTextColor="gray"
                        onChangeText={text => setValue('name', text)}
                        />
                    </View>

                    <View>
                        {errors.name && <Text className="text-red-500">{errors.name.message}</Text>}
                    </View>

                    <View className="flex flex-row w-full items-center justify-between px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                        <TextInput
                        className="w-full"
                        placeholder="Email"
                        placeholderTextColor="gray"
                        onChangeText={text => setValue('email', text)}
                        />
                    </View>

                    <View>
                        {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}
                    </View>
                
                    <View className="flex flex-row w-full items-center justify-between px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                        <TextInput
                        className="w-full"
                        placeholder="Senha"
                        placeholderTextColor="gray"
                        secureTextEntry={showPassword ? false : true}
                        onChangeText={text => setValue('password', text)}
                        />
                        <TouchableOpacity onPress={viewSenha}>
                        <Text>
                            {showPassword ? <FontAwesome name="eye-slash" size={20} color="gray"/> : <FontAwesome name="eye" size={20} color="gray"/>}
                        </Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        {errors.password && <Text className="text-red-500">{errors.password.message}</Text>}
                    </View>

                    <View className="flex flex-row w-full items-center justify-between px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                        <TextInput
                        className="w-full"
                        placeholder="Confirmar Senha"
                        placeholderTextColor="gray"
                        secureTextEntry={showConfirmPassword ? false : true}
                        onChangeText={text => setValue('confirmPassword', text)}
                        />
                        <TouchableOpacity onPress={viewConfirmSenha}>
                        <Text>
                            {showConfirmPassword ? <FontAwesome name="eye-slash" size={20} color="gray"/> : <FontAwesome name="eye" size={20} color="gray"/>}
                        </Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        {errors.confirmPassword && <Text className="text-red-500">{errors.confirmPassword.message}</Text>}
                    </View>
                
                    <View className="mt-5 tracking-wide font-semibold bg-blue-500 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center">
                        <TouchableOpacity className="flex w-full items-center" onPress={handleSubmit(onSubmit)} disabled={loading}>
                            {loading ? <ActivityIndicator color="white"/> : <Text className="text-white">Criar Conta</Text>}
                        </TouchableOpacity>
                    </View>

                    <View className='flex items-center justify-center mt-3'>
                        <Text>Já possui uma conta? <Link href={'/login'} className='text-blue-500 underline'>Faça login</Link></Text>
                    </View>
                </View>
            </View>
        </View>
    );
}