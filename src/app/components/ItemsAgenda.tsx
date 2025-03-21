import { Text, TouchableOpacity, View, Modal, TextInput, Platform, Pressable } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect, useMemo, useState } from "react";
import { format, parse } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Picker } from '@react-native-picker/picker';

const inputValidation = yup.object().shape({
    description: yup.string().required('A descrição é obrigatória').max(30, 'A descrição deve ter no máximo 30 caracteres'),
    date: yup.date().required('Preencha a data'),
    time: yup.date().required('Preencha a hora'),
    tipo: yup.string().required('Escolha o tipo'),
});

export default function ItemsAgenda({ atualizarDados }: any) {
    const [modalVisible, setModalVisible] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [showPicker2, setShowPicker2] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState<Date | null>(null);
    const [dateInput, setDateInput] = useState("");
    const [horaInput, setHoraInput] = useState("");
    const [selectTipo, setSelectTipo] = useState();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(inputValidation)
    });

    useEffect(() => {
        register("description");
        register("date");
        register("time");
        register("tipo");
    }, [register]);

    const handleOpen = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const togglePicker = () => {
        setShowPicker(!showPicker);
    };

    const togglePicker2 = () => {
        setShowPicker2(!showPicker2);
    };

    const onChangeDate = (_event: any, selectedDate?: Date) => {
        if(selectedDate) {
            setDate(selectedDate);
            const formattedDate = format(selectedDate, "dd/MM/yyyy");
            setDateInput(formattedDate);
            setValue("date", selectedDate);
        
            if(Platform.OS === "android") {
                togglePicker();
            }
        } else {
            togglePicker();
        }
    };
    

    const onChangeTime = (_event: any, selectedTime?: Date) => {
        if (selectedTime) {
            setTime(selectedTime);
            const formattedTime = format(selectedTime, "HH:mm");
            setHoraInput(formattedTime);
            setValue("time", selectedTime);

            if (Platform.OS === "android") {
                togglePicker2();
            }
        } else {
            togglePicker2();
        }
    };

    const formatarData = () => {
        const dataFormatada = parse(dateInput, "dd/MM/yyyy", new Date());
        if(isNaN(dataFormatada.getTime())) {
            console.error("Erro ao converter data. Verifique o formato.");
            return;
        }
        const dataFormatada2 = parse(horaInput, "HH:mm", new Date());
        if(isNaN(dataFormatada2.getTime())) {
            console.error("Erro ao converter hora. Verifique o formato.");
            return;
        }
        const dataHoraCombinada = new Date(
            dataFormatada.getFullYear(),
            dataFormatada.getMonth(),
            dataFormatada.getDate(),
            dataFormatada2.getHours(),
            dataFormatada2.getMinutes()
        );
        if(isNaN(dataHoraCombinada.getTime())) {
            console.error("Erro ao combinar data e hora.");
            return;
        }
        setValue("date", dataHoraCombinada);
    }

    const onSubmit = async (data: any) => {
        try {
            formatarData();
            const token = await SecureStore.getItemAsync("authToken");
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/agenda`, {
                ...data,
                token: String(token),
            }, {
                headers: {
                    Authorization: `Bearer ${String(token)}`,
                },
            });
            if(response.status === 201) {
                setModalVisible(false);
                atualizarDados();
            }
        } catch (error) {
            console.error("Erro ao criar agenda:", error);
        }
    };

    const memoData = useMemo(() => (
        <DateTimePicker
            value={date ?? new Date()}
            mode="date"
            display="spinner"
            onChange={onChangeDate}
        />
    ), [date]);

    const memoHora = useMemo(() => (
        <DateTimePicker
            value={time ?? new Date()}
            mode="time"
            display="spinner"
            onChange={onChangeTime}
        />
    ), [time]);

    return (
        <View className="w-full flex bg-gray-200 items-end px-4 mb-5 mt-2">
            <View className="flex-row gap-2">
                <TouchableOpacity onPress={handleOpen} className="w-10 h-10 rounded-full border flex items-center justify-center border-white bg-slate-700">
                    <FontAwesome6 name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={handleCloseModal}>
                <View className="flex-1 justify-center items-center">
                    <View className="w-[90%] bg-white rounded-lg p-4 shadow-xl border border-slate-300 m-32">
                        <Text className="flex text-slate-800 text-xl items-center justify-center">Adicionar Agenda</Text>
                        <View className="gap-3">
                            <Text>Descrição</Text>
                            <View className="flex flex-row w-full px-8 py-4 items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                                <TextInput className="w-full" placeholder="Descrição" placeholderTextColor="gray" onChangeText={text => setValue("description", text)} />
                            </View>
                            <View>{errors.description && <Text className="text-red-500">{errors.description.message}</Text>}</View>

                            <Text>Tipo</Text>
                            <Picker
                                selectedValue={selectTipo}
                                onValueChange={(itemValue) => {
                                    const value = itemValue || "TRABALHO";
                                    setSelectTipo(itemValue); 
                                    setValue('tipo', value); 
                                }}>
                                <Picker.Item label="Trabalho" value="TRABALHO" />
                                <Picker.Item label="Prova" value="PROVA" />
                                <Picker.Item label="Evento" value="EVENTO" />
                                <Picker.Item label="Reunião" value="REUNIAO" />
                                <Picker.Item label="Aula" value="AULA" />
                                <Picker.Item label="Importante" value="IMPORTANTE" />
                            </Picker>
                            <View>
                                {errors.tipo && <Text className="text-red-500">{errors.tipo.message}</Text>}
                            </View>

                            <Text>Data</Text>
                            {showPicker && memoData}
                            {!showPicker && (
                                <Pressable onPress={togglePicker}>
                                    <View className="flex flex-row w-full px-8 py-4 items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm">
                                        <TextInput className="w-full" placeholder="Data" placeholderTextColor="gray" editable={false} onChangeText={setDateInput} value={dateInput} />
                                    </View>
                                </Pressable>
                            )}
                            <View>{errors.date && <Text className="text-red-500">{errors.date.message}</Text>}</View>

                            <Text>Hora</Text>
                            {showPicker2 && memoHora}
                            {!showPicker2 && (
                                <Pressable onPress={togglePicker2}>
                                    <TextInput className="w-full" placeholder="Hora" placeholderTextColor="gray" editable={false} onChangeText={setHoraInput} value={horaInput} />
                                </Pressable>
                            )}
                            <View>{errors.time && <Text className="text-red-500">{errors.time.message}</Text>}</View>

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
                </View>
            </Modal>
        </View>
    );
}