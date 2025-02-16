import React, { useEffect, useState } from "react";
import { View, Text, Pressable, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Picker } from '@react-native-picker/picker';


const inputValidation = yup.object().shape({
    title: yup.string().required('O nome é obrigatório'),
    content: yup.string(),
    obrigatoria: yup.string().required('Escolha o tipo'),
    dependencia: yup.string().required('Escolha uma opção'),
});
export default function CardDisciplina({ disciplina }: any) {
    const { id, name, details, dependencia, obrigatoria } = disciplina;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectTipo, setSelectTipo] = useState();
    const [selectDependencia, setSelectDependencia] = useState();
    const router = useRouter();

    const { register, handleSubmit, setValue, control, formState: { errors },} = useForm({
        resolver: yupResolver(inputValidation),
        defaultValues: {
            title: name,
            content: details,
            dependencia: dependencia,
            obrigatoria: obrigatoria
        }
    
    });

    useEffect(() => {
        register('title');
        register('content');
        register('dependencia');
        register('obrigatoria');
    },[register]);

    const handleOpen = () => {
        setModalVisible(true); 
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleDeleteDisciplina = async () => {
        try {
            const token = await SecureStore.getItemAsync("authToken");
            const response = await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/disciplina/${id}`, {
                headers: {
                    Authorization: `Bearer ${String(token)}`,
                },
            });
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }


    const onSubmit = async (data: any) => {
        try {
            const token = await SecureStore.getItemAsync("authToken");
            const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/disciplina/${id}`, {...data, token: String(token)}, {
                headers: {
                    Authorization: `Bearer ${String(token)}`,
                },
            });
            console.log(response.status);
            if(response.status === 200) {
                setModalVisible(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return(
        <View className="bg-white rounded-lg shadow-md flex flex-col justify-between relative p-4 mb-2"> 
            <Pressable onPress={() => router.push(`/disciplina/${id}`)}>
                <View className="flex items-center justify-center text-blue-500 bg-blue-100 rounded-full w-16 h-16">
                    <FontAwesome5 name="book-open" size={24} color="blue" />
                </View>
                <View className="flex flex-col flex-grow">
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 200, fontSize: 16 }} className="text-lg font-semibold text-gray-800">{name}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 200, fontSize: 16 }} className="text-sm text-gray-600 mt-1">{details}</Text>
                </View>
            </Pressable>
            <View className="flex items-start">
                <View className="mt-4 flex-row gap-2 sm:mt-auto">
                    <TouchableOpacity onPress={handleOpen} className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg">
                        <FontAwesome5 name="edit" size={16} color="white"/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleDeleteDisciplina} className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg">
                        <FontAwesome5 name="trash" size={16} color="white"/>
                    </TouchableOpacity>
                    <View>
                        {Number(dependencia) > 0 && (
                            <View className="flex flex-row items-center bg-orange-500 text-white px-4 py-2 rounded-lg">
                                <FontAwesome5 name="exclamation-triangle" size={16} color="white" />
                                <Text className="text-white text-sm ml-2">Dependência</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
            <Modal
                visible={modalVisible} 
                animationType="slide" 
                transparent={true} 
                onRequestClose={handleCloseModal} 
                >
                <View className="flex-1 justify-center items-center">
                    <View className="w-[90%] bg-white rounded-lg p-4 shadow-xl border border-slate-300 m-32">
                        <Text className="flex text-slate-800 text-xl items-center justify-center">Editar Disciplina</Text>
                        <View className="gap-3">
                            <View className="flex flex-row w-full px-8 py-4 items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                            <Controller
                                name="title"
                                control={control}
                                defaultValue={name} 
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
        
                            <View className="flex flex-row w-full px-8 py-4 items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm">
                                <TextInput
                                    className="w-full"
                                    placeholder="Descrição"
                                    placeholderTextColor="gray"
                                    onChangeText={text => setValue('content', text)}
                                    defaultValue={details}
                                />
                                </View>
                            <View>
                            {errors.content && <Text className="text-red-500">{errors.content.message}</Text>}
                            </View>

                            <Text>Tipo</Text>
                            <Picker
                                selectedValue={selectTipo}
                                onValueChange={(itemValue) => {
                                    const value = itemValue || "1";
                                    setSelectTipo(itemValue); 
                                    setValue('obrigatoria', value); 
                                }}>
                                <Picker.Item label="Obrigatória" value="1" />
                                <Picker.Item label="Optativa" value="0" />
                            </Picker>
                            <View>
                                {errors.obrigatoria && <Text className="text-red-500">{errors.obrigatoria.message}</Text>}
                            </View>

                            <Text>Depêndencia</Text>
                            <Picker
                                selectedValue={selectDependencia}
                                onValueChange={(itemValue) => {
                                    const value = itemValue || "1";
                                    setSelectDependencia(itemValue); 
                                    setValue('dependencia', value); 
                                }}>
                                <Picker.Item label="Sim" value="1" />
                                <Picker.Item label="Não" value="0" />
                            </Picker>
                            <View>
                                {errors.dependencia && <Text className="text-red-500">{errors.dependencia.message}</Text>}
                            </View>
                        </View>
                        <View className="flex-row items-end gap-3">
                            <TouchableOpacity className="flex-row h-10 px-6 gap-2 items-center outline-none rounded-md bg-green-500" onPress={handleSubmit(onSubmit)}>
                                <Text className="text-white text-lg">Editar</Text>
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