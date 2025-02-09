import { View, Text, TouchableOpacity, Pressable, Modal } from 'react-native';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useState } from 'react';
import AnotacaoEdit from './AnotacaoEdit';

export default function CardAnotacao({ info }: any) {
    const {id, title} = info;
    const [modalVisible, setModalVisible] = useState(false);

    const handleDeleteAnotacao = async () => {
        try {
            const token = await SecureStore.getItemAsync("authToken");
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/anotacao/${id}`, {
            headers: {
                Authorization: `Bearer ${String(token)}`,
            },
            });
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    

    const handleOpen = () => {
        setModalVisible(true); 
    };
    
    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <View className="bg-white rounded-lg shadow-md flex flex-col justify-between relative p-4 mb-2">
            <Pressable onPress={handleOpen}>
                <View className="flex items-center justify-center text-blue-500 bg-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20">
                    <FontAwesome5 name="list-alt" size={24} color="blue" />
                </View>
                <View className="flex flex-col flex-grow">
                    <Text>
                        {title}
                    </Text>
                </View>
            </Pressable>
            <View className="flex items-start">
                <View className="mt-4 flex gap-2">
                    <TouchableOpacity className='flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg' onPress={handleDeleteAnotacao}>
                        <FontAwesome5 name="trash" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                visible={modalVisible} 
                animationType="slide" 
                transparent={true} 
                onRequestClose={handleCloseModal} 
            >
                <View className='flex-1 justify-center items-center'>
                    <View className="w-full h-[85%] bg-white rounded-lg p-4 shadow-xl border border-slate-300 m-32">
                        <AnotacaoEdit id={id}/>
                        <View className="flex-row justify-center items-center gap-3">
                            <TouchableOpacity className="flex h-10 px-6 gap-2 items-center outline-none rounded-md bg-red-500" onPress={handleCloseModal}>
                                <Text className="text-white text-lg">Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}