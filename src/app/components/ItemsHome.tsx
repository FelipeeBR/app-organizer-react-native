import { Text, TouchableOpacity, View, Modal, TextInput, Platform, Pressable, ScrollView } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect, useState } from "react";
import { format, parse, set, startOfDay } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import useTarefaStore from "../useTarefaStore";

const inputValidation = yup.object().shape({
    title: yup.string().required('Titulo é obrigatório'),
    description: yup.string().required('Descrição é obrigatória'),
    priority: yup.string().required('Escolha a prioridade'),
    status: yup.string().required('Escolha o status'),
    date: yup.date().required('Escolha a data'),
});

export default function ItemsHome({ atualizarDados}: any) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectDisciplina, setSelectDisciplina] = useState();
    const [selectPriority, setSelectPriority] = useState();
    const [selectStatus, setSelectStatus] = useState();
    const [disciplinas, setDisciplinas] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const { adicionarTarefa } = useTarefaStore();

    const [dateInput, setDateInput] = useState(format(new Date(), "dd/MM/yyyy"));

    const { register, handleSubmit, setValue, formState: { errors },} = useForm({
        resolver: yupResolver(inputValidation)});
    
    useEffect(() => {
        register('title');
        register('description');
        register('date');
        register('priority');
        register('status');
    },[register]);

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const togglePicker = () => {
        setShowPicker(!showPicker);
    };

    const onChange = (_event: any, selectedDate?: Date) => {
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

    useEffect(() => {
        const fetchDisciplinas = async () => {
          try {
            const token = await SecureStore.getItemAsync("authToken");
            if (token) {
              const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/disciplinas`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setDisciplinas(response.data);
              setSelectDisciplina(response.data[0].id);
            }
          } catch (error) {
            console.error("Erro ao buscar disciplinas:", error);
          }
        }; 
        fetchDisciplinas();
      }, []);

    const handleOpen = () => {
        setModalVisible(true); 
    };

    const onSubmit = async (data: any) => {
        try {
            const dataFormatada = parse(dateInput, "dd/MM/yyyy", new Date());
              
            const dataInicioDoDia = startOfDay(dataFormatada);
            const dataISO = format(dataInicioDoDia, "yyyy-MM-dd'T'HH:mm:ss");
        
            setValue('date', dataInicioDoDia);
    
            const token = await SecureStore.getItemAsync("authToken");
            if (!token) {
              console.error("Token de autenticação ausente.");
              return;
            }
    
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/tarefa`, {
                ...data,
                date: dataISO,
                priority: selectPriority,
                status: selectStatus,
                disciplinaId: selectDisciplina,
              }, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if(response.status === 201) {
                adicionarTarefa(response.data);
                atualizarDados();
            } else {
              console.error("Erro ao criar tarefa:", response.data);
            }
            setModalVisible(!modalVisible);
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
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
                <View className="flex-1 justify-center items-center">
                    <ScrollView className="w-[90%] bg-white rounded-lg p-4 shadow-xl border border-slate-300 m-32" contentContainerStyle={{ paddingBottom: 50 }}>
                        <Text className="flex text-slate-800 text-xl items-center justify-center">Criar Tarefa</Text>
                        <View className="gap-3">
                            <View className="flex flex-row w-full px-8 py-4 items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                                <TextInput
                                className="w-full"
                                placeholder="Título"
                                placeholderTextColor="gray"
                                onChangeText={text => setValue('title', text)}
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
                                multiline
                                numberOfLines={4}
                                onChangeText={text => setValue('description', text)}
                                />
                            </View>
                            <View>
                                {errors.description && <Text className="text-red-500">{errors.description.message}</Text>}
                            </View>

                            <Text>Disciplina</Text>
                            <Picker
                                selectedValue={selectDisciplina}
                                onValueChange={(itemValue, itemIndex) =>
                                setSelectDisciplina(itemValue)
                                }>
                                {disciplinas.map((disciplina: any) => (
                                    <Picker.Item key={disciplina.id} label={disciplina.name} value={disciplina.id} />
                                ))}
                            </Picker>
                            
                            <Text>Prioridade</Text>
                            <Picker
                                selectedValue={selectPriority}
                                onValueChange={(itemValue) => {
                                    const value = itemValue || 'BAIXA';
                                    setSelectPriority(itemValue); 
                                    setValue('priority', value); 
                                }}>
                                <Picker.Item label="Baixa" value="BAIXA" />
                                <Picker.Item label="Média" value="MEDIA" />
                                <Picker.Item label="Alta" value="ALTA" />
                            </Picker>
                            <View>
                                {errors.priority && <Text className="text-red-500">{errors.priority.message}</Text>}
                            </View>

                            <Text>Status</Text>
                            <Picker
                                selectedValue={selectStatus}
                                onValueChange={(itemValue) => {
                                    const value = itemValue || 'PENDING';
                                    setSelectStatus(itemValue); 
                                    setValue('status', value); 
                                }}>
                                <Picker.Item label="Pendente" value="PENDING" />
                                <Picker.Item label="Fazendo" value="IN_PROGRESS" />
                                <Picker.Item label="Concluída" value="COMPLETED" />
                            </Picker>
                            <View>
                                {errors.status && <Text className="text-red-500">{errors.status.message}</Text>}
                            </View>
                            
                            <Text>Prazo</Text>
                            {showPicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="spinner"
                                    onChange={onChange}
                                />
                            )}
                            {!showPicker && (
                                <View className="flex flex-row w-full px-8 py-4 items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                                    <Pressable onPress={togglePicker}>
                                        <TextInput
                                        className="w-full"
                                        placeholder="Data"
                                        placeholderTextColor="gray"
                                        editable={false}
                                        onChangeText={setDateInput}
                                        value={dateInput}
                                        />
                                    </Pressable>
                                </View>
                            )}
                            <View>
                                {errors.date && <Text className="text-red-500">{errors.date.message}</Text>}
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
                    </ScrollView>
                </View>
            </Modal>
        </View>
    )
}