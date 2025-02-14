import { Text, TouchableOpacity, View, Modal, TextInput } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect, useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const inputValidation = yup.object().shape({
  title: yup.string().required('Titulo é obrigatório'),
  content: yup.string().required('Descrição é obrigatória'),
});
export default function ItemsDisciplina() {
    const [modalVisible, setModalVisible] = useState(false);

    const { register, handleSubmit, setValue, control, formState: { errors },} = useForm({
        resolver: yupResolver(inputValidation),
        defaultValues: {
            title: '',
            content: ''
        }
    
    });
    
    useEffect(() => {
        register('title');
        register('content');
    },[register]);
    
    const handleOpen = () => {
        setModalVisible(true); 
    };
    
    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const onSubmit = async (data: any) => {
        try {
            const token = await SecureStore.getItemAsync("authToken");
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/disciplina`, {...data, token: String(token)}, {
                headers: {
                    Authorization: `Bearer ${String(token)}`,
                },
            });
            if(response.status === 201) {
                setModalVisible(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View className="w-full flex bg-gray-200 items-end px-4 mb-5 mt-2">
            <View className="flex-row gap-2">
                <TouchableOpacity onPress={handleOpen} className="w-10 h-10 rounded-full border flex items-center justify-center border-white bg-slate-700">
                    <FontAwesome6 name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <Modal
                visible={modalVisible} 
                animationType="slide" 
                transparent={true} 
                onRequestClose={handleCloseModal} 
            >
                <View className='flex-1 justify-center items-center'>
                <View className="w-[90%] bg-white rounded-lg p-4 shadow-xl border border-slate-300 m-32">
                        <Text className="flex text-slate-800 text-xl items-center justify-center">Adicionar Disciplina</Text>
                        <View className="gap-3">
                            <View className="flex flex-row w-full px-8 py-4 items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        className="w-full"
                                        placeholder="Título"
                                        placeholderTextColor="gray"
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                    )}
                                />
                            </View>
                            <View>
                                {errors.title && <Text className="text-red-500">{errors.title.message}</Text>}
                            </View>
        
                            <View className="flex flex-row w-full px-8 py-4 items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                                <TextInput
                                    className="w-full"
                                    placeholder="Descrição"
                                    placeholderTextColor="gray"
                                    onChangeText={text => setValue('content', text)}
                                />
                                </View>
                            <View>
                                {errors.content && <Text className="text-red-500">{errors.content.message}</Text>}
                            </View>
                        </View>
                        <View className="flex-row items-end gap-3">
                            <TouchableOpacity className="flex-row h-10 px-6 gap-2 items-center outline-none rounded-md bg-green-500" onPress={handleSubmit(onSubmit)}>
                                <Text className="text-white text-lg">Adicionar</Text>
                            </TouchableOpacity>
        
                            <TouchableOpacity className="flex-row h-10 px-6 gap-2 items-center outline-none rounded-md bg-red-500" onPress={handleCloseModal}>
                                <Text className="text-white text-lg">Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}