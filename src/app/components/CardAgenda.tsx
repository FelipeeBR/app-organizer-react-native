import { Text, TouchableOpacity, View, Modal, TextInput, Platform, Pressable } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect, useMemo, useState } from "react";
import { add, addDays, addHours, format, parse, parseISO } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Picker } from '@react-native-picker/picker';

const getTipo = (tipo: any) => {
    switch (tipo) {
        case 'TRABALHO':
        return <View><Text className='flex items-center gap-2 text-white'>Trabalho</Text></View>; 
        case 'PROVA':
        return <View><Text className='flex items-center gap-2 text-white'>Prova</Text></View>; 
        case 'EVENTO':
        return <View><Text className='flex items-center gap-2 text-white'>Evento</Text></View>; 
        default:
        return <View><Text className='flex items-center gap-2 text-white'>Evento</Text></View>;
    }
};

const getColor = (tipo: any) => {
    switch (tipo) {
      case 'TRABALHO':
        return 'bg-green-500'; 
      case 'PROVA':
        return 'bg-red-500'; 
      case 'EVENTO':
        return 'bg-blue-500'; 
      default:
        return 'bg-gray-500';
    }
};


const inputValidation = yup.object().shape({
    description: yup.string().required('A descrição é obrigatória').max(30, 'A descrição deve ter no máximo 30 caracteres'),
    date: yup.date(),
    time: yup.date(),
    tipo: yup.string().required('Escolha o tipo'),
});

export default function CardAgenda({ info }: any) {
    const { id, description, date, tipo } = info;
    const [modalVisible, setModalVisible] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [showPicker2, setShowPicker2] = useState(false);
    const [data, setData] = useState<Date | null>(null);
    const [time, setTime] = useState<Date | null>(null);
    const [dateInput, setDateInput] = useState("");
    const [horaInput, setHoraInput] = useState("");
    const [selectTipo, setSelectTipo] = useState(tipo);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(inputValidation)
    });
    
    useEffect(() => {
        register("description");
        register("date");
        register("time");
        register("tipo");
        setDateInput(format(parseISO(date), "dd/MM/yyyy"));
        setValue("description", description);
        const parsedDate = parseISO(date);
        const dateWithAddedHours = addHours(parsedDate, 3);
        setHoraInput(format(dateWithAddedHours, "HH:mm"));
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
            setData(selectedDate);
            const formattedDate = format(selectedDate, 'dd/MM/yyyy'); 
            setDateInput(formattedDate);
            setValue("date", selectedDate.toISOString() as any);
        
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

    const memoData = useMemo(() => (
        <DateTimePicker
            value={data ?? new Date()}
            mode="date"
            display="spinner"
            onChange={onChangeDate}
        />
    ), [data]);

    const memoHora = useMemo(() => (
        <DateTimePicker
            value={time ?? new Date()}
            mode="time"
            display="spinner"
            onChange={onChangeTime}
        />
    ), [time]);

    const formatarData = (dateInput: string, horaInput: string) => {
        try {
            const dataFormatada = parse(dateInput, "dd/MM/yyyy", new Date());
            if (isNaN(dataFormatada.getTime())) {
                throw new Error("Erro ao converter data. Verifique o formato.");
            }
    
            const horaFormatada = parse(horaInput, "HH:mm", new Date());
            if (isNaN(horaFormatada.getTime())) {
                throw new Error("Erro ao converter hora. Verifique o formato.");
            }
    
            return new Date(
                dataFormatada.getFullYear(),
                dataFormatada.getMonth(),
                dataFormatada.getDate(),
                horaFormatada.getHours(),
                horaFormatada.getMinutes()
            ).toISOString();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const dataHora = formatarData(dateInput, horaInput);
            if (!dataHora) return;
            const token = await SecureStore.getItemAsync("authToken");
            const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/agenda/${id}`, {
                ...data,
                date: dataHora,
                token: String(token),
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            handleCloseModal();
            console.log(data);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar agenda:', error);
        }
    }

    const handleDeleteAgenda = async (id: number) => {
        try {
            const token = await SecureStore.getItemAsync("authToken");
            const response = await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/agenda/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            if (response.status === 200) {
                return response.data;
            }
                
        } catch (error) {
            console.error('Erro ao deletar agenda:', error);
        }
    }

    return (
        <View className='bg-white rounded-lg shadow-md flex flex-col justify-between relative p-4 mb-2'>
            <View className="flex-row gap-2">
                <Text className={`flex items-center justify-center text-white ${getColor(tipo)} rounded-lg px-2 font-semibold`}>
                    {getTipo(tipo)}
                </Text>
                <Text className="text-sm font-semibold text-gray-800 italic">
                    {format(addHours(new Date(date), 3), "dd/MM/yyyy 'às' HH:mm")}
                </Text>
            </View>
            <View className="flex flex-col flex-grow">
                <Text className="text-sm font-semibold text-gray-800 italic">
                    {description}
                </Text>
            </View>
            <View className="flex flex-col flex-grow">
                <View className="mt-4 flex-row gap-2">
                    <TouchableOpacity onPress={handleOpen} className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg">
                        <FontAwesome5 name="edit" size={16} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteAgenda(id)} className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg">
                        <FontAwesome5 name="trash" size={16} color="white"/>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={handleCloseModal}>
                <View className="flex-1 justify-center items-center">
                    <View className="w-[90%] bg-white rounded-lg p-4 shadow-xl border border-slate-300 m-32">
                        <View className="gap-3">
                            <Text>Descrição</Text>
                            <View className="flex flex-row w-full px-8 py-4 items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                                <TextInput className="w-full" placeholder="Descrição" placeholderTextColor="gray" onChangeText={text => setValue("description", text)} defaultValue={description}/>
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
                                    <Text className="text-white text-lg">Editar</Text>
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