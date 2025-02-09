import { Text, TouchableOpacity, View, Modal } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect, useState } from "react";
import { format, parse, formatISO, parseISO } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import AnotacaoCreate from "./AnotacaoCreate";

const inputValidation = yup.object().shape({
    title: yup.string().required('O titulo é obrigatório'),
});

export default function ItemsAgenda() {
    const [modalVisible, setModalVisible] = useState(false);
    const handleOpen = () => {
        setModalVisible(true); 
    };
    
    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <View className="w-full flex bg-gray-200 items-end px-4 mb-5 mt-2">
            <View className="flex-row gap-2">
                <TouchableOpacity className="w-10 h-10 flex items-center justify-center">
                    <FontAwesome5 name="bell" size={24} color="#334155" />
                </TouchableOpacity>
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
                    <View className="w-full h-[85%] bg-white rounded-lg p-4 shadow-xl border border-slate-300 m-32">
                        <AnotacaoCreate/>
                        <View className="flex-row justify-center items-center gap-3">
                            <TouchableOpacity className="flex h-10 px-6 gap-2 items-center outline-none rounded-md bg-red-500" onPress={handleCloseModal}>
                                <Text className="text-white text-lg">Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}