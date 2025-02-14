import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from '@expo/vector-icons/FontAwesome'
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Button, Pressable, Platform } from "react-native";
import { format, parse, formatISO, parseISO, addDays, startOfDay, add } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios";
import * as SecureStore from "expo-secure-store";


const getTaskStatusDetails = (task: any) => {
  if (!task.date || isNaN(new Date(task.date).getTime())) {
    return {
      icon: <FontAwesome5 name="exclamation-circle" size={16} color="gray" />,
      color: "text-gray-500",
      message: "Data inválida",
    };
  }

  const taskDate = addDays(new Date(task.date), 1);

  if (task.status === "COMPLETED") {
    return {
      icon: <FontAwesome name="check-circle" size={16} color="green" />,
      color: "text-green-500",
      message: `Até o dia ${format(taskDate, "dd/MM/yyyy")}`,
    };
  } else if (taskDate > new Date()) {
    return {
      icon: <FontAwesome5 name="clock" size={16} color="blue" />,
      color: "text-blue-500",
      message: `Até o dia ${format(taskDate, "dd/MM/yyyy")}`,
    };
  } else {
    return {
      icon: <FontAwesome5 name="exclamation-circle" size={16} color="red" />,
      color: "text-red-500",
      message: `Até o dia ${format(taskDate, "dd/MM/yyyy")}`,
    };
  }
};

const inputValidation = yup.object().shape({
  title: yup.string().required('O titulo é obrigatório'),
  description: yup.string().required('Preencha a descrição'),
  priority: yup.string(),
  status: yup.string(),
  date: yup.date().required('Preencha a data'),
});

export default function Tarefa({ task, atualizarDados }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectPriority, setSelectPriority] = useState(task.priority);
  const [selectStatus, setSelectStatus] = useState(task.status);
  const [selectDisciplina, setSelectDisciplina] = useState(task.disciplinaId);
  const [date, setDate] = useState(new Date());

  const { register, handleSubmit, setValue, formState: { errors },} = useForm({
    resolver: yupResolver(inputValidation)});
  
  useEffect(() => {
    register('title');
    register('description');
    register('date');
    register('priority');
    register('status');
  },[register]);

  //Data
  const taskDate = task.date ? parseISO(task.date) : new Date();
  const [dateInput, setDateInput] = useState(format(addDays(taskDate, 1), "dd/MM/yyyy"));
  const [showPicker, setShowPicker] = useState(false);

  const [statusDetails, setStatusDetails] = useState(getTaskStatusDetails(task));
  const [disciplinas, setDisciplinas] = useState([]);

  useEffect(() => {
    setStatusDetails(getTaskStatusDetails(task));
  }, [task]);

  const { icon, color, message } = getTaskStatusDetails(task);


  const handleOpen = () => {
    setModalVisible(true); 
  };

  const onSubmit = async (data: any) => {
    try {
      const dataFormatada = parse(dateInput, "dd/MM/yyyy", new Date());
  
      const dataInicioDoDia = startOfDay(dataFormatada);
      const dataISO = format(dataInicioDoDia, "yyyy-MM-dd'T'HH:mm:ss");
  
      setValue('date', dataInicioDoDia);
      setValue('priority', selectPriority);
      setValue('status', selectStatus);
  
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        console.error("Token de autenticação ausente.");
        return;
      }
  
      const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/tarefa/${task.id}`, {
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
  
      if (response.status === 200) {
        atualizarDados();
      } else {
        console.error("Erro ao atualizar tarefa:", response.data);
      }
  
      setModalVisible(!modalVisible);
    } catch (error) {
      console.error("Erro ao submeter os dados:", error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
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

  useEffect(() => {
    setValue('title', task.title);
    setValue('description', task.description);
    setValue('date', task.date);
    setValue('priority', task.priority);
    setValue('status', task.status);
  }, []);

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        if(token) {
          const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/disciplinas`, {
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

  const handleDeleteTarefa = async (id: number) => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        console.error("Token de autenticação ausente.");
        return;
      }

      const response = await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/tarefa/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        atualizarDados();
      } else {
        console.error("Erro ao deletar tarefa:", response.data);
      }
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };



  return (
    <View className="w-full bg-white rounded-lg shadow-md flex flex-col justify-between border border-slate-300 p-4 mb-2">
      <Text className="font-medium">{task.title}</Text>
      <View className="flex-row gap-2">
        {icon}
        <Text className="ml-2">{message}</Text>
      </View>
      <View className="mt-4 flex-row gap-2">
        <TouchableOpacity onPress={handleOpen} className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg">
          <FontAwesome5 name="edit" size={16} color="white"/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDeleteTarefa(task.id)} className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg">
          <FontAwesome5 name="trash" size={16} color="white"/>
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
                <Text className="flex text-slate-800 text-xl items-center justify-center">Editar Tarefa</Text>
                <View className="gap-3">
                  <View className="flex flex-row w-full px-8 py-4 items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-base">
                    <TextInput
                      className="w-full"
                      placeholder="Título"
                      placeholderTextColor="gray"
                      onChangeText={text => setValue('title', text)}
                      defaultValue={task.title}
                    />
                  </View>
                  <View>
                    {errors.title && <Text className="text-red-500">{errors.title.message}</Text>}
                  </View>

                  <View className="flex flex-row w-full px-8 py-4 items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-base">
                    <TextInput
                      className="w-full"
                      placeholder="Descrição"
                      placeholderTextColor="gray"
                      onChangeText={text => setValue('description', text)}
                      defaultValue={task.description}
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
                  {showPicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="spinner"
                      onChange={onChange}
                      />
                  )}
                  {!showPicker && (
                    <View className="flex flex-row w-full px-8 py-4 items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-base">
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

