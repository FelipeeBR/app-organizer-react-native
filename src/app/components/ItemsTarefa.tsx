import { Text, TouchableOpacity, View, Modal, TextInput, Platform, Pressable } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect, useMemo, useState } from "react";
import { format, parse, formatISO, startOfDay } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const inputValidation = yup.object().shape({
  title: yup.string().required('O titulo é obrigatório'),
  description: yup.string().required('Preencha a descrição'),
  priority: yup.string(),
  status: yup.string(),
  date: yup.date().required('Preencha a data'),
});

export default function ItemsTarefa({ atualizarTarefas }: any) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectDisciplina, setSelectDisciplina] = useState();
    const [selectPriority, setSelectPriority] = useState("BAIXA");
    const [selectStatus, setSelectStatus] = useState("PENDING");
    const [disciplinas, setDisciplinas] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());

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
            
            setValue('date', dataFormatada);
            setValue('priority', selectPriority);
            setValue('status', selectStatus);
    
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
                atualizarTarefas();
                setModalVisible(!modalVisible);
            } else {
              console.error("Erro ao criar tarefa:", response.data);
            }
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
        }
    }

    const memoData = useMemo(() => (
        <DateTimePicker
            value={date ?? new Date()}
            mode="date"
            display="spinner"
            onChange={onChange}
        />
    ), [date]);

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
                    <View className="w-[90%] bg-white rounded-lg p-4 shadow-xl border border-slate-300 m-32">
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
                                onValueChange={(itemValue, itemIndex) =>
                                setSelectPriority(itemValue)
                                }>
                                <Picker.Item label="Baixa" value="BAIXA" />
                                <Picker.Item label="Média" value="MEDIA" />
                                <Picker.Item label="Alta" value="ALTA" />
                            </Picker>

                            <Text>Status</Text>
                            <Picker
                                selectedValue={selectStatus}
                                onValueChange={(itemValue, itemIndex) =>
                                setSelectStatus(itemValue)
                                }>
                                <Picker.Item label="Pendente" value="PENDING" />
                                <Picker.Item label="Fazendo" value="IN_PROGRESS" />
                                <Picker.Item label="Concluída" value="COMPLETED" />
                            </Picker>
                            
                            <Text>Prazo</Text>
                            {showPicker && memoData}
                            {!showPicker && (
                                <View className="flex flex-row w-full items-center px-8 py-4 justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
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
                    </View>
                </View>
            </Modal>
        </View>
    )
}