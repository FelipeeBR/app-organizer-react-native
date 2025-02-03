import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from '@expo/vector-icons/FontAwesome'
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Button, Pressable, Platform } from "react-native";
import { format, addDays, parse } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


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
  date: yup.date(),
});

export default function Tarefa({ task }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectPriority, setSelectPriority] = useState();
  const [selectStatus, setSelectStatus] = useState();

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
  const [date, setDate] = useState(new Date());
  const [dateInput, setDateInput] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const [statusDetails, setStatusDetails] = useState(getTaskStatusDetails(task));

  useEffect(() => {
    setStatusDetails(getTaskStatusDetails(task));
  }, [task]);

  const { icon, color, message } = getTaskStatusDetails(task);


  const handleOpen = () => {
    setModalVisible(true); 
  };

  const onSubmit = async (data: any) => {
    try {
      const dataFormatada = parse(dateInput, "EEE MMM dd yyyy", new Date());
      if (isNaN(dataFormatada.getTime())) {
        console.error("Erro ao converter data. Verifique o formato.");
        return;
      }

      setValue('date', dataFormatada);
      setValue('priority', selectPriority);
      setValue('status', selectStatus);
      console.log("Dados enviados: ", { ...data, date: dataFormatada, priority: selectPriority, status: selectStatus, disciplinaId: task.disciplinaId });
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

  const onChange = ({type}: any, selectedDate: any) => {
    if(type === 'set') {
      const currentDate = selectedDate || date;
      setDateInput(currentDate);
      if(Platform.OS === 'android') {
        togglePicker();
        setDateInput(currentDate.toDateString());
      }
    } else{
      togglePicker();
    }
  }


  return (
    <View className="w-full bg-white rounded-lg shadow-md flex flex-col justify-between border border-slate-300 p-4 mb-2">
      <Text className="font-medium">{task.title}</Text>
      <View className="flex-row gap-2">
        {icon}
        <Text className="ml-2">{message}</Text>
      </View>
      <View className="mt-4 flex-row gap-2">
        <TouchableOpacity onPress={handleOpen} className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all focus:ring focus:ring-blue-200">
          <FontAwesome5 name="edit" size={16} color="white"/>
        </TouchableOpacity>

        <TouchableOpacity className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all focus:ring focus:ring-red-200">
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
                  <View className="flex flex-row w-full items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                    <TextInput
                      className="w-full"
                      placeholder="Título"
                      placeholderTextColor="gray"
                      onChangeText={text => setValue('title', text)}
                    />
                  </View>

                  <View className="flex flex-row w-full items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                    <TextInput
                      className="w-full"
                      placeholder="Descrição"
                      placeholderTextColor="gray"
                      onChangeText={text => setValue('description', text)}
                    />
                  </View>
                  <Text>Disciplina</Text>
                  <View className="flex flex-row w-full items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                    <TextInput
                      className="w-full"
                      placeholder="Disciplina"
                      placeholderTextColor="gray"
                      editable={false}
                    />
                  </View>
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
                  
                  <Text>Data</Text>
                  {showPicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="spinner"
                      onChange={onChange}
                      />
                  )}
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
                    <Button title="Salvar" onPress={handleSubmit(onSubmit)} />
                    <Button title="Fechar" onPress={handleCloseModal} />
                  </View>
                </View>
            </View>
        </View>
      </Modal>
    </View>
  );
}

