import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Pressable, Platform } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { format, parse, formatISO, parseISO, addDays } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm, Controller } from 'react-hook-form';
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
export default function CardTarefa({ tarefa }: any) {
    const { id, title, description, date, priority, status, disciplinaId } = tarefa;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectPriority, setSelectPriority] = useState(priority);
    const [selectStatus, setSelectStatus] = useState(status);
    const [selectDisciplina, setSelectDisciplina] = useState(disciplinaId);
    const [data, setData] = useState(new Date());

    const [disciplinas, setDisciplinas] = useState([]);
    const taskDate = date ? parseISO(date) : new Date();
    const [dateInput, setDateInput] = useState(format(taskDate, "dd/MM/yyyy"));
    const [showPicker, setShowPicker] = useState(false);

    const { register, handleSubmit, setValue, control, formState: { errors }} = useForm({
        resolver: yupResolver(inputValidation),
        defaultValues: {
            title: title,
            description: description,
            priority: priority,
            status: status,
        }
    });
      
    useEffect(() => {
    register('title');
    register('description');
    register('date');
    register('priority');
    register('status');
    },[register]);

    const handleOpen = () => {
        setModalVisible(true); 
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const togglePicker = () => {
        setShowPicker(!showPicker);
    };

    useEffect(() => {
        const fetchDisciplinas = async () => {
          try {
            const token = await SecureStore.getItemAsync("authToken");
            if(token) {
              const response = await axios.get(`${process.env.REACT_APP_API_URL}/disciplinas`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setDisciplinas(response.data);
            }
          } catch (error) {
            console.error("Erro ao buscar disciplinas:", error);
          }
        }; 
        fetchDisciplinas();
    }, []);

    const onChange = (_event: any, selectedDate?: Date) => {
        if (selectedDate) {
          setData(selectedDate);
          const formattedDate = format(selectedDate, "dd/MM/yyyy");
          setDateInput(formattedDate);
          setValue("date", selectedDate);
    
          if (Platform.OS === "android") {
            togglePicker();
          }
        } else {
          togglePicker();
        }
    };

    const getStatusColor = (status: any) => {
        switch (status) {
          case 'PENDING':
            return 'bg-red-500'; 
          case 'COMPLETED':
            return 'bg-green-500'; 
          case 'IN_PROGRESS':
            return 'bg-blue-500'; 
          default:
            return 'bg-gray-500';
        }
    };

    const getPriorityColor = (priority: any) => {
        switch (priority) {
          case 'ALTA':
            return 'bg-red-500'; 
          case 'MEDIA':
            return 'bg-yellow-500'; 
          case 'BAIXA':
            return 'bg-green-500'; 
          default:
            return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status: any) => {
        switch (status) {
            case 'PENDING':
                return (
                    <View className='flex-row items-center gap-2'>
                        <FontAwesome6 name="circle-xmark" color="white" size={20}/>
                        <Text className='text-white'>Pendente</Text>
                    </View>
                ); 
            case 'IN_PROGRESS':
                return (
                    <View className='flex-row items-center gap-2'>
                        <FontAwesome5 name="hourglass-end" color="white" size={20}/>
                        <Text className='text-white'>Fazendo</Text>
                    </View>
                ); 
            case 'COMPLETED':
                return (
                    <View className='flex-row items-center gap-2'>
                        <FontAwesome5 name="check-double" color="white" size={20}/>
                        <Text className='text-white'>Concluída</Text>
                    </View>
                ); 
            default:
                return <FontAwesome5 name="tasks" color="white" size={20}/>;
        }
    };

    const onSubmit = async (data: any) => {
        try {
          const dataFormatada = parse(dateInput, "dd/MM/yyyy", new Date());
          if (isNaN(dataFormatada.getTime())) {
            console.error("Erro ao converter data. Verifique o formato.");
            return;
          }
          const dataISO = formatISO(dataFormatada);
          setValue('date', dataFormatada);
          setValue('priority', selectPriority);
          setValue('status', selectStatus);
    
          const token = await SecureStore.getItemAsync("authToken");
          if (!token) {
            console.error("Token de autenticação ausente.");
            return;
          }
    
          const response = await axios.put(`${process.env.REACT_APP_API_URL}/tarefa/${id}`, {
            ...data,
            date: dataISO,
            priority: selectPriority,
            status: selectStatus,
            disciplinaId: selectDisciplina,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if(response.status === 200) {
            setModalVisible(!modalVisible);
          }else{
            console.error("Erro ao atualizar tarefa:", response.data);
          }
    
          setModalVisible(!modalVisible);
        } catch (error) {
          console.error("Erro ao submeter os dados:", error);
        }
      };

    const memoData = useMemo(() => (
        <DateTimePicker
            value={data ?? new Date()}
            mode="date"
            display="spinner"
            onChange={onChange}
        />
    ), [data]);

    return (
        <View className="bg-white rounded-lg shadow-md flex flex-col justify-between border border-slate-300 p-4 mb-2">
            <View className="flex flex-col items-center justify-between mb-4">
                <View className={`rounded-lg text-white text-sm font-semibold px-2 py-1 flex items-center gap-2 capitalize ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                </View>
                <View className={`rounded-lg text-white text-sm font-semibold px-4 py-1 w-44 text-center capitalize m-1 ${getPriorityColor(priority)}`}>
                    <Text className='text-white'>Prioridade: {priority}</Text>
                </View>
                <View>
                    <View className="flex-row items-center gap-2">
                        <FontAwesome5 name="calendar" color="#334155" size={20}/>
                        <Text className="text-sm text-gray-600">Prazo: {format(addDays(new Date(date), 1), 'dd/MM/yyyy')}</Text>
                    </View>
                </View>
            </View>
            <View className="flex-grow">
                <Text className="text-lg font-bold text-gray-800 mb-2">{title}</Text>
                <Text className="text-sm text-gray-600">{description}</Text>
            </View>
            <View className="flex items-start">
                <View className="mt-4 flex-row gap-2 sm:mt-auto">
                    <TouchableOpacity onPress={handleOpen} className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg">
                        <FontAwesome5 name="edit" size={16} color="white"/>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg">
                        <FontAwesome5 name="trash" size={16} color="white"/>
                    </TouchableOpacity>
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
                        <Text className="flex text-slate-800 text-xl items-center justify-center">Editar Tarefa</Text>
                        <View className="gap-3">
                        <View className="flex flex-row w-full items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                            <Controller
                                name="title"
                                control={control}
                                defaultValue={title}
                                render={({ field: { onChange, value } }) => (
                                <TextInput
                                    className="w-full"
                                    placeholder="Título"
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

                        <View className="flex flex-row w-full items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                            <TextInput
                            className="w-full"
                            placeholder="Descrição"
                            placeholderTextColor="gray"
                            onChangeText={text => setValue('description', text)}
                            defaultValue={description}
                            />
                        </View>
                        <View>
                            {errors.description && <Text className="text-red-500">{errors.description.message}</Text>}
                        </View>

                        <Text>Disciplina</Text>
                        <Picker
                            enabled={false}
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
                            <View className="flex flex-row w-full items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
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
                            <TouchableOpacity className="flex h-10 px-6 gap-2 items-center outline-none rounded-md bg-green-500" onPress={handleSubmit(onSubmit)}>
                            <Text className="text-white text-lg">Editar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex h-10 px-6 gap-2 items-center outline-none rounded-md bg-red-500" onPress={handleCloseModal}>
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